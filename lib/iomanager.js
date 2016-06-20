var _ = require('lodash');
var path = require('path');

const nconf = require('nconf');
nconf.file({ file: "config.json" });

// --------------------------------------
// Initialisztion
// --------------------------------------

var manager = {};
var io = null;

var clients = {};
var refreshTimer = null;

// --------------------------------------
// Init
// --------------------------------------

manager.init = function(server, dbmanager, callback) {


  // -------------------------------------------
  // Remote action methods
  // -------------------------------------------

  // Handler called when a full refresh of devices' status is required
  // Will update contact each devices to ask for an update
  var requestAllProbesStatus = () => {
    // TODO: Use DB instead of clients
    var probes = _.filter(clients, o => o.type === 'probe' && o.connected);
    // This applies to each connected device
    _.each(probes, probe => {
      // Sending the status request command, response will come as a 'status' event
      probe.socket.emit('action', { type: 'sendstatus'});
      console.log('global -    Asking ' + probe.id + ' to send status');
    });
  };

  // Handler called when all devices' status are required by an admin
  // Will fetch the latest status from the DB and send it using the socket
  var reportAllProbesFullStatus = (socket) => {
    // Getting all devices from the DB
    dbmanager.Device.getAll((err, r) => {
      // Each device is managed individually
      _.forEach(r, function(e) {
        // The object needs to be converted to plain object to be sent
        var t = e.toObject();
        // The admin is expecting the hash to be named as id
        t.id = t.hash;
        console.log('global - Sending full status of ' + e.hash + ' to ' + socket.deviceid);
        // Sending to the admin socket
        socket.emit('status', t);
      });
    });
  };

  // Handler called when a device's status changed
  // Will update the DB and notify admin sockets
  var handleNewProbeStatus = (status) => {
    // Checking if the device is already in the db
    dbmanager.Device.getOrCreate(status.id, (err, d) => {
      // Updating all the fields (not null) from status
      console.log(status.id + ' - Updating');
      // If intact is still intact, the device never got setup
      status['setup'] = d.intact !== 'CeciDoitEtreIntactPourEtre UneNouvelleBox' ? 'yes' : 'no';
      // Only authorized fields can be updated
      var fields = ['connected', 'version', 'intact', 'setup'];
      var props = _.pick(status, fields);
      d.update(props, (err, r) => { 
        r.save(err => { 
          // Updating connected admins with the new change
          // TODO: use DB instead of clients
          var admins = _.filter(clients, o => o.type === 'admin' && o.connected);
          _.each(admins, admin => {
            // The object needs to be converted to plain object to be sent
            var t = r.toObject();
            // The admin is expecting the hash to be named as id
            t.id = t.hash;
            console.log('global - Sending status to ' + admin.id);
            // Sending to the admin socket
            admin.socket.emit('status', t);
          });
        }); 
      });
    });
  };


  var requestCommandExecutionToProbe = (command) => {
    var probe = _.find(clients, o => o.id === command.deviceid);
    if (probe) {
      var cmdid = _.uniqueId();
      probe.socket.emit('action', {
        type: "execute",
        command: {
          id: cmdid,
          device: command.deviceid,
          payload: command.command,
          timeout: command.timeout,
        },
      });
    }
    else {
      console.log('admin -    No active connection to ' + command.deviceid);
    }
  };

  var handleNewCommandStatus = (status, deviceid) => {
    var admins = _.filter(clients, o => o.type === 'admin');
    _.each(admins, admin => {
      status.device = deviceid;
      admin.socket.emit('command', status);
    });
  };

  var handleDeviceSetup = (deviceid) => {
    console.log('BOOYAAAAAAA!');

    // var probe = _.find(clients, o => o.id === deviceid);
    // probe.socket.emit('status', status);

    // var admins = _.filter(clients, o => o.type === 'admin');
    // _.each(admins, admin => {
    //   admin.socket.emit('status', status);
    // });

    // var admins = _.filter(clients, o => o.type === 'admin');
    // _.each(admins, admin => {
    //   status.device = deviceid;
    //   admin.socket.emit('command', status);
    // });
  };

  var io = require('socket.io').listen(server);

  require('socketio-auth')(io, {
    authenticate: (socket, data, callback) => {
      // Get credentials sent by the client 
      var username = data.username;
      var password = data.password;
      // Validate them agains the DB
      dbmanager.User.findOne({ login: username }, function (err, user) {
        console.log('Fetch DB done', err, user);
        if (err) { 
          return callback(null, false, { message: "Unknown error" } ); 
        }
        else if (!user) {
          console.log(username + " - Trying to authenticate with '"+password+"', user NOK");
          return callback(null, false, { message: 'Incorrect login.' });
        }
        else if (user.password != password) {
          console.log(username + " - Trying to authenticate with '"+password+"', password NOK");
          return callback(null, false, { message: 'Incorrect password.' });
        }
        else {
          console.log(username + " - Trying to authenticate with '"+password+"', OK");
          var type = user.type;
          socket.deviceid = username;
          var el = {
            "id": username,
            "socket": socket,
            "type": type,
          };
          clients[username] = el;
          socket.clientInfo = el;
          return callback(null, true);
        }

      });

    },
    timeout: 20000,
  });

  io.on('connection', function(socket) {

    console.log('Connection incoming');

    socket.on('refresh', function(message) {
      console.log(socket.deviceid + ' - Ask for all devices refresh');
      reportAllProbesFullStatus(socket);
    });
    
    socket.on('sendcommand', function(command) {
      console.log(socket.deviceid + ' - Request a command execution for ' + command.deviceid + " (" + command.command + ")");
      requestCommandExecutionToProbe(command);
    });

    socket.on('status', function(status) {
      console.log(socket.deviceid + ' - Probe send status');
      handleNewProbeStatus(status)
    });

    socket.on('command', function(status) {
      console.log(socket.deviceid + ' - Command updated');
      handleNewCommandStatus(status, socket.deviceid); // deviceid is forced on server side for security reasons
    });

    socket.on('setupdevice', function(device) {
      console.log(socket.deviceid + ' - Request a device setup');
      handleDeviceSetup(device, socket.deviceid); // deviceid is forced on server side for security reasons
    });

    socket.on('disconnect', () => {
      console.log(socket.deviceid + ' - Disconnected');
      // Id no deviceid, it is a ghost (Someone with no credentials trying to connect)
      if (socket.deviceid) {
        // Probes have their own way to report status
        if (socket.deviceid && socket.clientInfo.type === 'probe') {
          // Data to be updated
          var res = {
            id: socket.deviceid,
            connected: false,
            lastconnected: Date.now() / 1000 | 0,
          };  
          // Perform the update in DB + notification to all connected admins
          handleNewProbeStatus(res);
        }  
      }
    });

    // Ask all probed to send their status at start
    requestAllProbesStatus();
    // Keep sync the status every minute, in case of some event has been missed
    var refreshTimer = setInterval(requestAllProbesStatus, 60);
  });

  return io;
}

// --------------------------------------
// Exports
// --------------------------------------

module.exports = manager



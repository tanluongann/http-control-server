var fs = require('fs');
var _ = require('lodash');

// --------------------------------------
// Initialisztion
// --------------------------------------

var HTTPS_PORT  = 443;
var privateKey  = fs.readFileSync('/etc/letsencrypt/live/ujust.watch/privkey.pem', 'utf8');
var certificate = fs.readFileSync('/etc/letsencrypt/live/ujust.watch/cert.pem', 'utf8');
var chain       = fs.readFileSync('/etc/letsencrypt/live/ujust.watch/chain.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate, ca: chain};

var server = {};

// --------------------------------------
// User
// --------------------------------------

server.init = function(app, callback) {

  app.use(express.bodyParser());

  app.use('/dist', express.static('dist'));
  app.get('/', (req, res) => {
    res.sendfile(__dirname + '/dist/index.html');
  });

  app.post('/ips', (req, res) => {
    var id = req.body.id;
    var pw = req.body.pwd;
    var ip = req.connection.remoteAddress
    console.log("ID of the device: " + id);
    dbmanager.Device.getOrCreate(id, (err, dev) => {
      console.log("DV : " + dev);
      if (dev.password === pw) {
        console.log("PW : Ok");
      }
      else {
        console.log("PW : Nok, but continuing for the debug");
      }
      dev.update({ "ip": ip }, (err, devu) => {
        console.log("DVU: " + devu);
        devu.save(err => {
          res.setHeader('Content-Type', 'application/json');
          if (err) {
            res.send(JSON.stringify({
              "status": "error",
              "id": id,
              "ip": ip,
            }));
          }
          else {
            res.send(JSON.stringify({
              "status": "updated",
              "id": id,
              "ip": ip,
            }));
          }
        });
      });
    });
  });

  if (callback) callback(err, app);
}

// --------------------------------------
// Exports
// --------------------------------------

module.exports = server



var https = require('https');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');

var express = require('express');
var express_session = require('express-session');

var bodyParser = require('body-parser');

const nconf = require('nconf');
nconf.file({ file: "config.json" });

// --------------------------------------
// Initialisztion
// --------------------------------------

var HTTPS_PORT  = nconf.get('httpsPort');
var privateKey  = fs.readFileSync(nconf.get('privateKey'), 'utf8');
var certificate = fs.readFileSync(nconf.get('certificate'), 'utf8');
var chain       = fs.readFileSync(nconf.get('chain'), 'utf8');
var credentials = {key: privateKey, cert: certificate, ca: chain};

var manager = {};
var server = null;

// --------------------------------------
// User
// --------------------------------------

manager.init = function(app, dbmanager, callback) {

  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;

  passport.use(new LocalStrategy(
    {
      usernameField: "login", 
      passwordField: "password",
      passReqToCallback : true
    },
    function(req, login, password, done) {
      console.log('Using local strategy for auth (' + login + '/' + password+')');
      dbmanager.User.findOne({ login: login }, function (err, user) {
        console.log('Fetch DB done', err, user);
        if (err) { return done(err); }
        if (!user) {
          console.log(login + " - Trying to authenticate with '"+password+"', user NOK");
          return done(null, false, { message: 'Incorrect login.' });
        }
        if (user.password != password) {
          console.log(login + " - Trying to authenticate with '"+password+"', password NOK");
          return done(null, false, { message: 'Incorrect password.' });
        }
        req.user = user;
        console.log(login + " - Trying to authenticate with '"+password+"', OK");
        return done(null, user);
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    dbmanager.User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  app.use(bodyParser.json());
  app.use(express_session({ secret: 'Uj|_|57W4Tch', resave: true, saveUninitialized: true }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/dist', express.static('dist'));

  app.post('/login', 
    passport.authenticate('local'), 
    function(req, res) {
      var user = req.user;
      user.password = '---';
      res.send(user);
    }
  );

  app.get('/', function(req, res) {

    res.sendFile(path.resolve(__dirname + '/../dist/home.html'));
  });

  app.get('/ujw_admin', function(req, res) {

    res.sendFile(path.resolve(__dirname + '/../dist/admin.html'));
  });

  app.post('/ips', function(req, res) {
    var id = req.body.id;
    var pw = req.body.pwd;
    var ip = req.connection.remoteAddress
    dbmanager.Device.getOrCreate(id, function(err, dev) {
      if (err || !dev) {
         console.log(id + " - Updating IP to '"+ip+"', error while fetching the device in DB");
      }
      else {
        if (dev.password === pw) {
          console.log(id + " - Updating IP to '"+ip+"', password OK");
        }
        else {
          console.log(id + " - Updating IP to '"+ip+"', password wrong (OK for debug)");
        }
        dev.update({ "ip": ip }, function(err, devu) {
          devu.save(function(err) {
            res.setHeader('Content-Type', 'application/json');
            if (!id || err) {
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
      }
    });
  });

  app.post('/devices/:device', passport.authenticate('local'), function(req, res) {
    var id = req.params.device;
    var user = req.user;
    dbmanager.Device.findOne({ "hash": id }, function(err, dev) {
      if (err || !dev) {
         console.log(id + " - Getting device info, error while fetching the device in DB");
      }
      else {
        // TODO compare auth user and device owner, if admin authorize
        var access = true;
        if (access) {
          console.log(id + " - Getting device info, ok");
          res.send(dev)
        } 
        else {
          console.log(id + " - Getting device info, user cannot access this device info");
          res.send({}, 401); 
        } 
      }
    });
  });

  server = https.createServer(credentials, app);
  return server;
}

manager.listen = function(callback) {
  server.listen(HTTPS_PORT, callback);
}

// --------------------------------------
// Exports
// --------------------------------------

module.exports = manager



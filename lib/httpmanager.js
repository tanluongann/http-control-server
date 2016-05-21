var https = require('https');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');

var express = require('express');
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
var jsonParser = bodyParser.json();
// --------------------------------------
// User
// --------------------------------------

manager.init = function(app, callback) {

  server = https.createServer(credentials, app);

  app.use('/dist', express.static('dist'));
  app.get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../dist/index.html'));
  });

  app.post('/ips', jsonParser, function(req, res) {
    var id = req.body.id;
    var pw = req.body.pwd;
    var ip = req.connection.remoteAddress
    console.log("ID of the device: " + id);
    dbmanager.Device.getOrCreate(id, function(err, dev) {
      console.log("DV : " + dev);
      if (dev.password === pw) {
        console.log("PW : Ok");
      }
      else {
        console.log("PW : Nok, but continuing for the debug");
      }
      dev.update({ "ip": ip }, function(err, devu) {
        console.log("DVU: " + devu);
        devu.save(function(err) {
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

  return server;
}

manager.listen = function(callback) {
  server.listen(HTTPS_PORT, callback);
}

// --------------------------------------
// Exports
// --------------------------------------

module.exports = manager



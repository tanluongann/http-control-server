var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
const nconf = require('nconf');
var _ = require('lodash');

var dbmanager = require("./lib/dbmanager");
var httpmanager = require("./lib/httpmanager");
var iomanager = require("./lib/iomanager");

nconf.file({ file: "config.json" });

// -------------------------------------------
// WEB & SocketIO handling
// -------------------------------------------

var server = httpmanager.init(app, dbmanager);
var io = iomanager.init(server, dbmanager);

httpmanager.listen(function() {
  console.log('global - Listening HTTPS on 443');
});




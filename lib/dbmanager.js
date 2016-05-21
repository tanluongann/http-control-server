var mongoose = require('mongoose');
var _ = require('lodash');

mongoose.connect('mongodb://localhost/justwatch');

var Schema = mongoose.Schema;
var client = {};

// --------------------------------------
// User
// --------------------------------------

var userSchema = new Schema({ 
  name: {
    first: String,
    last: String, 
  },
  login: String,
  password: String,
  email: String,
  type: String,
});
userSchema.virtual('name.full').set(function (name) {
  var split = name.split(' ');
  this.name.first = split[0];
  this.name.last = split[1];
});
userSchema.virtual('name.full').get(function () {
  return this.name.first + ' ' + this.name.last;
});
client.User = mongoose.model('User', userSchema);

// --------------------------------------
// Device
// --------------------------------------

var deviceSchema = new Schema({ 
  owner: String,
  hash: { type: String, unique: true },
  name: String,
  ip: String,
  connected: Boolean,
  intact: String,
  version: String,
  updated: Number,
  lastconnected: Number,
  setup: String,
  services: [{ 
    name: String,
    status: String,
  }],
});
deviceSchema.statics.getOrCreate = function(hash, callback) {
  var model = this;
  this.findOne({ hash: hash }, function(err, res) {
    if (!err && res) res.new = false;
    if (!err && !res) {
      model.createDefault(hash, callback);
    }
    else {
      if (callback) callback(err, res);
    }
  });
}
deviceSchema.statics.createDefault = function(hash, callback) {
  var model = this;
  var res = new model();
  res.hash = hash;
  res.name = 'Default';
  res.new = true;
  if (callback) callback(null, res);
}
deviceSchema.statics.getAll = function(callback) {
  this.find({}, callback);
}
deviceSchema.methods.update = function(properties, callback) {
  var instance = this;
  _.forEach(properties, function(value, key) {
    instance[key] = value;   
  });
  if (callback) callback(null, this);
}
client.Device = mongoose.model('Device', deviceSchema);

// --------------------------------------
// Exports
// --------------------------------------

module.exports = client



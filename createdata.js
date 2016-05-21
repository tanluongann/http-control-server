var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/justwatch');
var Schema = mongoose.Schema;

// -----------------------------------
// Initialize Schemas
// -----------------------------------

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
var User = mongoose.model('User', userSchema);

userSchema.virtual('name.full').set(function (name) {
  var split = name.split(' ');
  this.name.first = split[0];
  this.name.last = split[1];
});
userSchema.virtual('name.full').get(function () {
	return this.name.first + ' ' + this.name.last;
});

var deviceSchema = new Schema({ 
  owner: String,
  name: String,
  ip: String,
  connected: String,
  intact: String,
  version: String,
  updated: Number,
  services: [{ 
    name: String,
    status: String,
  }],
});
var Device = mongoose.model('Device', deviceSchema);




// -----------------------------------
// Empty all collections
// -----------------------------------

Device.remove().exec();
User.remove().exec();





// -----------------------------------
// Create data
// -----------------------------------

var jeremy = new User({
  name: {
  	first: "Jeremy",
  	last: "T",	
  },
  login: "jeremy",
  password: "Pa$$W0rD",
  email: "jeremy@gmail.com",
  type: "admin",
});
jeremy.save(function(err) {
	console.log('Creating jeremy ' + err ? err : 'Ok');
});

alexis = new User({
  name: {
  	first: "Alexis",
  	last: "L",	
  },
  login: "alexis",
  password: "Pa$$W0rD",
  email: "alexis@gmail.com",
  type: "admin",
});
alexis.save(function(err) {
	console.log('Creating alexis ' + err ? err : 'Ok');
});

francois = new User({
  name: {
  	first: "Francois",
  	last: "H",	
  },
  login: "francois",
  password: "Pa$$W0rD",
  email: "francois@gmail.com",
  type: "user",
});
francois.save(function(err) {
	console.log('Creating francois ' + (err ? err : 'Ok'));
});

User.find({}).exec(function(err, users) {
	console.log('All users');
	console.log(users.toJSON());
});

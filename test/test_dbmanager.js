var expect = require("chai").expect;
var dbmanager = require("../lib/dbmanager");
var util = require('util');
var _ = require('lodash');

describe("DBManager", function() {

	describe(".Device", function() {
	    it("should exist", function() {
	    	expect(dbmanager).to.have.property('Device');
	   	});
		describe(".createDefault", function() {
		    it("return a default model", function(done) {
		    	var hash = '00001111';
		    	dbmanager.Device.createDefault(hash, function(err, d) {
			    	expect(d.hash).to.equal(hash);
			    	expect(d.name).to.equal('Default');
			    	done();
		    	});
	    	});
	   	});
		describe(".getAll", function() {
		    it("return a list of models", function(done) {
		    	var hash = '00001111';
		    	d = new dbmanager.Device();
		    	d.hash = hash;
		    	d.name = 'Patom';
		    	d.save(function(err) {
			    	dbmanager.Device.getAll(function(err, r) {
				    	expect(r).to.be.an('array');
				    	expect(r).to.have.length.above(0);
				    	var i = _.find(r, function(e) { return e.hash === hash; });
				    	expect(i.name).to.equal('Patom');
				    	dbmanager.Device.remove({ hash: hash }).exec(function(err) {
					    	done();
				    	});
			    	});
			   	});
		   	});
		});
		describe(".getOrCreate", function() {
		    it("return a model if hash does not exist", function(done) {
		    	var hash = '00001111';
		    	dbmanager.Device.getOrCreate(hash, function(err, r) {
			    	expect(r.hash).to.equal(hash);
			    	expect(r.name).to.equal('Default');
			    	expect(r.new).to.equal(true);
			    	done();
		    	});
		   	});
		    it("return a model if hash exist", function(done) {
		    	var hash = '00001111';
		    	d = new dbmanager.Device();
		    	d.hash = hash;
		    	d.name = 'Patom';
		    	d.save(function(err) {
			    	dbmanager.Device.getOrCreate(hash, function(err, r) {
				    	expect(r.hash).to.equal(hash);
				    	expect(r.new).to.equal(false);
				    	expect(r.name).to.equal('Patom');
				    	dbmanager.Device.remove({ hash: hash }).exec(function(err) {
					    	done();
				    	});
			    	});
		    	});
		   	});
		});
		describe(".update", function() {
		    it("merge fields", function(done) {
		    	var hash = '00001111';
		    	d = new dbmanager.Device();
		    	d.hash = hash;
		    	d.name = 'Patom';
		    	d.intact = 'Intact';
		    	d.save(function(err) {
		    		var fields = {
		    			name: "Tadaa",
		    			version: "7.77",
		    		}
			    	d.update(fields, function(err, r) {
				    	expect(r.hash).to.equal(hash);
				    	expect(r.name).to.equal('Tadaa');
				    	expect(r.intact).to.equal('Intact');
				    	expect(r.version).to.equal('7.77');
				    	dbmanager.Device.remove({ hash: hash }).exec(function(err) {
					    	done();
				    	});
					});
				});
		   	});
		});
	});

	describe(".User", function() {
	    it("should exist", function() {
	    	expect(dbmanager).to.have.property('User');
	   	});
	});



});
#!/usr/bin/env node

var User    = require('../models/user.model');
var rabbit  = require('wascally');
var forEach = require('async-foreach').forEach;

require('../worker')();
User.sync();

function publishMessage(id) {
  rabbit.publish('ampq-messages-exchange', {
    type: 'publisher.message',
    body: { id: id }
  });
}

function csvToArray(file, cb) {
  require('csv-to-array')({
    file: file,
    columns: ['no', 'name', 'email']
  }, function(err, array) {
    cb(err, array);
  });
};

function iterateThroughArrayAndSaveToDB(csvArray, res) {
  forEach(csvArray, function(csv, index) {
    var done = this.async();

    User.create({
      name: csv.name,
      email: csv.email
    })
    .then(function(doc) {
      publishMessage(doc.id);
      done();
    })
    .catch(function(err) { 
      console.log('---ERROR-----', err);
      res.status(400).send('Error occurred while creating a user');
      done(false);
    });
  }, function(notAborted) { 
    if(notAborted) {
      res.sendStatus(200);
    }
  });
}


module.exports = function(app) {

  app.post('/import_to_database', function(req, res) {

    // This code actions for loadtest script
    if(req.body.csvFile && typeof req.body.csvFile === 'string') {
      csvToArray(req.body.csvFile, function(err, array) {
        if(err) {
          return console.log('Error occurred: ' + err);
        }

        iterateThroughArrayAndSaveToDB(array, res);
      });
    }
    else if(req.body.csvArray) {
      iterateThroughArrayAndSaveToDB(req.body.csvArray, res);
    }
    else {
      var message = 'You need to pass array to this end point or a csv file path if running loadtest script';
      res.status(400).send(message);
    }
  });

  app.get('/*', function(req, res) {
    res.sendFile('index.html', {root:'./public'});
  });
};
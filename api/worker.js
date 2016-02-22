#!/usr/bin/env node

var User   = require('./models/user.model');
var rabbit = require('wascally');

require('./topology.js')(rabbit, 'messages');


module.exports = function() { 

  rabbit.handle('publisher.message', function(msg) {
    console.log('Received:', JSON.stringify(msg.body));
    msg.ack();

    User.find({
      where: { id: parseInt(msg.body.id) }
    }).then(function(user) {
      console.log('-------READ USER-------', user.name);
    }).catch(function(err) {
      console.log('-----WORKER ERROR', err);
    });
  });
};
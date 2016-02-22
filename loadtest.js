var loadtest = require('loadtest');
  

module.exports = function(csv) {
  var options = {
    url: 'http://localhost:7000/import_to_database',
    method: 'POST',
    requestsPerSecond: 25,
    maxRequests: 25,
    concurrency: 25,
    timeout: 0,
    agentKeepAlive: true,
    requestGenerator: function(params, options, client, callback) {
      var message = JSON.stringify({csvFile: csv});
      options.headers['Content-Length'] = message.length;
      options.headers['Content-Type'] = 'application/json';

      var request = client(options, callback);
      request.write(message);

      return request;
    },
  };

  loadtest.loadTest(options, function(error, result) {
    if(error) {
      console.log('Error occurred: ' + error);
      return ;
    }
    console.log('requestGenerator succeeded: ' + JSON.stringify(result, null, 2));
  });
};


/*
 var a = [{name: 'sanni', email: 'sanni@yahoo.com'}, name: 'mayor', email: 'mayor@yahoo.com'}];
require('./loadtest')('/src/SampleCSVFile_1109kbd.csv'); */
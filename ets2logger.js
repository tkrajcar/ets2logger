var fs = require('fs');
var ETCarsClient = require('etcars-node-client');

var etcars = new ETCarsClient();
// to enable debug console.log and console.error
etcars.enableDebug = true;

etcars.on('data', function(data) {
  console.log('got data: ' + data["status"]);
  if(data["status"] == "JOB STARTED" || data["status"] == "JOB FINISH") {
    fs.appendFileSync('data.json', JSON.stringify(data));
  }
});

etcars.on('connect', function(data) {
    console.log('connected');
});

etcars.on('error', function(data) {
    console.log('etcars error');
});

etcars.connect();

var fs = require('fs');
var ETCarsClient = require('etcars-node-client');
var strftime = require('strftime');

var etcars = new ETCarsClient();
// to enable debug console.log and console.error
etcars.enableDebug = true;

var filename = strftime("data-%F-%H%M%S.json");
console.log(strftime("%F-%T") + " writing to: " + filename);

etcars.on('data', function(data) {
  console.log(strftime("%F-%T") + ' got data: ' + data["status"]);
  var keep = true;
  if(data["status"] == "TELEMETRY") {
    // telemetry events are fired every second. We only need every 15 seconds.
    const now = new Date();
    const secondsSinceEpoch = Math.round(now.getTime() / 1000);
    if(secondsSinceEpoch % 15 != 0) {
      keep = false;
    }
  }
  if(keep) {
    console.log(strftime("%F-%T") + " Keeping.");
    fs.appendFileSync(filename, JSON.stringify(data) + "\r");
  }
});

etcars.on('connect', function(data) {
    console.log(strftime("%F-%T") + ' connected');
});

etcars.on('error', function(data) {
    console.log(strftime("%F-%T") + ' etcars error');
});

etcars.connect();

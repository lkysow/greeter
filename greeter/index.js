var request = require('request-promise-native');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const GREETING_URL = process.env.GREETING_URL;
const NAME_URL = process.env.NAME_URL;

const os = require('os');
const hostname = os.hostname();

if (!GREETING_URL) {
  throw new Error('Process requires that environment variable GREETING_URL be passed');
}

if (!NAME_URL) {
  throw new Error('Process requires that environment variable NAME_URL be passed');
}

app.get('*', async function(req, res) {
  var greetingOpts = {
    timeout: 2000,
    uri: GREETING_URL
  }
  var nameOpts = {
    timeout: 2000,
    uri: NAME_URL
  }
  request(greetingOpts).then(function(greetingResponse) {
    request(nameOpts).then(function(nameResponse) {
      res.send(`From ${hostname}: ${greetingResponse} ${nameResponse}`);
    }).catch(function(err){
      res.send(`From ${hostname}: error making request to name service: ${err}`)
    })
  }).catch(function(err){
    res.send(`From ${hostname}: error making request to greeting service: ${err}`)
  })
});

app.listen(port, () => console.log(`Listening on port ${port}!`));

// This causes the process to respond to "docker stop" faster
process.on('SIGTERM', function() {
  console.log('Received SIGTERM, shutting down');
  app.close();
});

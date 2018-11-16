//Import local environment config
require("dotenv").config();

//Imports the tracing library and starts it
if (process.env.NODE_ENV === 'production') {
  require('@google-cloud/trace-agent').start({ enhancedDatabaseReporting: true});
}

//We add this and that's it
//It's that simple
require('@google-cloud/debug-agent').start();

const app = require('express')();
const http = require('http').Server(app);
const got = require('got');

// Imports the Google Cloud client library
const {ErrorReporting} = require('@google-cloud/error-reporting');

// With ES6 style imports via TypeScript or Babel, the following
// syntax can be used instead:
// import {ErrorReporting} from '@google-cloud/error-reporting';

const port = process.env.PORT || 3000;
const randomNumber = Math.floor(Math.random() * 255);
let requestRandomNumber = null;

// Instantiates a client
const errors = new ErrorReporting();

// Here's where all the logging stuff goes
const bunyan = require('bunyan');

// Imports the Google Cloud client library for Bunyan
const {LoggingBunyan} = require('@google-cloud/logging-bunyan');
const loggingBunyan = new LoggingBunyan();

// Create a Bunyan logger that streams to Stackdriver Logging
// Logs will be written to: "projects/YOUR_PROJECT_ID/logs/bunyan_log"
const logger = bunyan.createLogger({
  // The JSON payload of the log as it appears in Stackdriver Logging
  // will contain "name": "my-service"
  name: 'default-service-stackdriver-node-demo',
  streams: [
    // Log to the console at 'info' and above
    {stream: process.stdout, level: 'debug'},
    // And log to Stackdriver Logging, logging at 'info' and above
    loggingBunyan.stream('info'),
  ],
});



app.get('/', function (req, res, next) {
  requestRandomNumber = Math.floor(Math.random() * 255);
  logger.info(`/ route called and requestRandomNumber has value: ${requestRandomNumber}`);
  if (requestRandomNumber > 150) {
    //Let's purposefully break our app
    const status = Math.floor(Math.random() * (500 - 400)) + 400;
    res.send({ error: true, random: randomNumber }).status(status);
    next(new Error(`Error was caused by a random number greater than 150 with  value ${requestRandomNumber} and status ${status}`));

  } else {
    res.send(`
    Random number for this pod is: + ${randomNumber}. 
    <br \>
    You env variable with property key is: ${process.env.KEY}
    `).status(200);
  }
});



// This incoming HTTP request should be captured by Trace
app.get('/trace', (req, res) => {
  const DISCOVERY_URL = 'https://www.googleapis.com/discovery/v1/apis';
  
  // This outgoing HTTP request should be captured by Trace
  got(DISCOVERY_URL, { json: true })
    .then((response) => {
      const names = response.body.items.map((item) => item.name);

      res
        .status(200)
        .send(names.join('\n'))
        .end();
    })
    .catch((err) => {
      logger.error(err);
      res
        .status(500)
        .end();
    });
});


app.get('/ready', function (req, res) {
  res.send({ success: true, data: process.env }).status(200);
});

app.get('/logs', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});


// Note that express error handling middleware should be attached after all
// the other routes and use() calls. See the Express.js docs.
app.use(errors.express);


http.listen(port, function () {
  logger.info('listening on *:' + port);
});



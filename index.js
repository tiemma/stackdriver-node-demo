//Import local environment config
require("dotenv").config();

//Imports the tracing library and starts it
if (process.env.NODE_ENV === 'production') {
  require('@google-cloud/trace-agent').start({ enhancedDatabaseReporting: true});
}


const app = require('express')();
const http = require('http').Server(app);
const got = require('got');

// Imports the Google Cloud client library
const ErrorReporting = require('@google-cloud/error-reporting').ErrorReporting;

// With ES6 style imports via TypeScript or Babel, the following
// syntax can be used instead:
// import {ErrorReporting} from '@google-cloud/error-reporting';

const port = process.env.PORT || 3000;
const randomNumber = Math.floor(Math.random() * 255);
let requestRandomNumber = null;

// Instantiates a client
const errors = new ErrorReporting();

app.get('/', function (req, res, next) {
  requestRandomNumber = Math.floor(Math.random() * 255);
  if (requestRandomNumber > 150) {
    //Let's purposefully break our app
    const status = Math.floor(Math.random() * (500 - 400)) + 400;
    res.send({ error: true, random: randomNumber }).status(status);
    next(new Error(`Error was caused by a random number greater than 150 with 
    value ${requestRandomNumber} 
    and status ${status}`));

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
      console.error(err);
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
  console.log('listening on *:' + port);
});



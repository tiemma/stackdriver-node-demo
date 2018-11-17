# StackDriver
Contains codebase using Stackdriver for metrics gathering and error reporting

Stackdriver is a tool for metrics gathering, error reporting, tracing requests, profiling code to see how well its performance is and many other features.

Stackdriver holds the following features on its dashboard:

- Tracing
- Cloud Debugging
- Error Reporting
- Logging 
- Profiling
- Monitoring

All the features outlined here are explained in the documentation outlined [here](https://cloud.google.com/stackdriver/docs/?authuser=1)


## Tracing

Like it says, it shares similar processes with trace routing which is where it gets the name.

It basically tells you how your request went through the internet and back to you.

![Here's an image of a traceroute on Windows](https://kb.intermedia.net/Contents/682/682_2.png)

So Tracing in this case does the same thing but for enterprise applications. Sometimes, we might have a part of the hop in our system [e.g A database call that takes a long time to run] and we might have no way of finding it. 

That's where Stackdriver Tracing comes to the rescue. It allows us see where the issues in our applications are and allows us resolve the entire flow processes automatically.

From the image below, you'd see that we see all the various places our request went to before it came back and which part took the longest to finish.

![Image of a trace on Google StackDriver](https://lh3.googleusercontent.com/gKoF8p2Xw5K7kWYYWwmKixnsyKuI7LCxPI-jATsQfgs6YqJM7ckalGCQGyzhB8-I23I7byB6ZwjJDHdwm-0f8iurKdXdAntpKqKNPxyr5X0Bhziws0G4fQLC18q4pSEtIPhHPzlZlAi0io1UUb8vkiOJ_HsFI2ZWnyYDFLAoaHVxHQjM1inrQep5lYBMz1Ola7k4bOFMf1SEPcrcqlWom-w3WPPVMCqUuD_VBzLxbTdFjW7yA1SFNDaFquKeV4cFHrRc2CIVyW1_z4cVjHzITk1KTWDHFdLABd2HTHCrIH8KIO9bcnCY1mBR4nE5HX186j2GbOEhEea33J2GH6KOx67-Gg3VjYJKT37khG_fzJ-kh66CKPWE_Hcz4MZWR40dZvRl5ViyltpWYFuWIY3nTGRqObzveCWi9nDvwwRcMG6ZnioiVD3StimFngDdHr730tuOor6gGxenSU5KS-D8052MoMUASq1bYXtE5dwboS_lxJOKakKBxV6_95Srbc0WcEYcyTabR1puw0t2ZsptG5nEjP2GCDe8w3ApsvFP6IOfhzREKS7YAMBMO5av54ycsAPVMqwY4dMHQZLNAJP6bCHIX0vDZCbOLnalPzA9GGO-ncAsqOyzhzxYhMb14P-TmoW-FZSdjXr-Lb4rPJWIAlg48A=w1154-h475-no)

Tracing offers us the best means to see the performance bottlenecks in our web applications for now just this but all requests.

### How do we setup tracing

Stackdriver Tracing has an SDK available in other languages accessible [here](https://cloud.google.com/trace/docs/client-libraries)

For this, to set it up in Node which was my own framework of choice

```javascript
//…Left out other dependencies
// But all we need to do is just include it and start it, it’ll collect the traces automatically
 require('@google-cloud/trace-agent').start({ enhancedDatabaseReporting: true});
```

That's it. Once we add the dependency to our application, we can automatically use tracing. 

Do be sure to authenticate if you're using this outside any Google Cloud deployment service (App Engine, Compute Enigne, Kubernetes Engine). 

More docs [here](https://cloud.google.com/iam/docs/creating-managing-service-accounts), then continue to [here](https://cloud.google.com/trace/docs/setup/nodejs#running_locally_and_elsewhere) for authenticating properly in the SDK.



## Error Reporting

We call get bugs in our program but how do we manage bugs if we're running a couple thousand services and can't manage to look at them all.

That's what Stackdriver Error Reporting solves, we can then proceed to see all the errors in all our applications without suffering to scroll through logs. 

Like the previous tracing example, we can configure this using the SDK in any supported language of our choice.

More docs [here](https://cloud.google.com/error-reporting/docs/setup/nodejs)

As before, in Node, the setup is as easy as importing the dependency and using its middleware. It supports a couple of applications but I'd be using node in this one.

```javascript

// Imports the Google Cloud client library
const {ErrorReporting} = require('@google-cloud/error-reporting');

//...Left out other setups


// Instantiates a client
const errors = new ErrorReporting();

app.get('/', function (req, res, next) {

    const requestRandomNumber = Math.floor(Math.random() * 255);  

    if (requestRandomNumber > 150) {    

    //Let's purposefully break our app  and add a weird status alongside

    const status = Math.floor(Math.random() * (500 - 400)) + 400;

    res.send({ error: true, random: randomNumber }).status(status);    

    // Forward middleware request back and this reports our error and also logs it to the console
    // It's that easy!
    next(new Error(`Error caused by  random number >150 with value ${requestRandomNumber}  and returned status ${status}`));
     }

}

// Note that express error handling middleware should be attached after all
// the other routes and use() calls. See the Express.js docs.
app.use(errors.express);

```

There are a lot of supported servers and applications in the SDK of your choice. More docs about that can be referenced from above.


## Debugging

Stackdriver can also allow us debug our code on the deployment engine of our choice using the Stackdriver debugger tool.


### How does that work

Similar to using a debugger in your IDE, you can easily set snapshots and breakpoints in your code running on those instances automatically and it'll be setup for you.

To allow you debug your running instances, you'd need to add the agent to your code for this to work

Here's a code sample in the Node SDK

```javascript
//We add this and that's it
//It's that simple
require('@google-cloud/debug-agent').start();


// No need for extra configurations, it’s that easy
// Once this dependency is in your application, you can easily head to the 
// dashboard and begin  testing your application

```

It's that easy, you can then go the debugger dashboard setup here and easily connect to your deployment instance to debug your production code and see all the details at certain lines automatically.

You can access the dashboard here and see these things in practice [here](https://console.cloud.google.com/debug)


## Logging

This is what Stackdriver does by default but we can't just ingest all our print lines to the console and call that logs.

Logging has a format to make sure you can easily search through them when Stackdriver Logging takes them. There are a lot of logging libraries in your language of choice and Stackdrive has added adapters to help you automatically stream your logs to Stackdriver logging automatically.

Since I'm using Node, I'd be taking Bunyan as my logging library. Need to see the code?


```javascript
// Imports the Google Cloud client library for Bunyan
const {LoggingBunyan} = require('@google-cloud/logging-bunyan’);
const loggingBunyan = new LoggingBunyan();

// Create a Bunyan logger that streams to Stackdriver Logging
// Logs will be written to: "projects/YOUR_PROJECT_ID/logs/bunyan_log“
const logger = bunyan.createLogger({  

     // The JSON payload of the log as it appears in Stackdriver Logging 
    // will contain "name": "my-service"  
    name: 'default-service-stackdriver-node-demo’,  
    streams: [   
         // Log to the console at 'info' and above    
        {stream: process.stdout, level: 'debug'},  
 
        // And log to Stackdriver Logging, logging at 'info' and above    
       loggingBunyan.stream('info'),  
    ],
});


//  A simple example
logger.error("An error occurred");

```

Once we connect the stackdriver logging library to our own application logging library, we can then easily stream our logs as easily as it is to print. 



## Other features

Various services can be monitored by Stackdriver and we can also set alerts and notifications to send emails for various metrics.
A couple of them are:

 - Response code status occurrences over a timeline
 - Downtime of our server 
 - Load threshold
 - Request threshold
 
 And a lot of other standard metrics you'd be interested in setting up.
 
 You can check out Google cloud, new signups get 300$ to use the platform and you can head down to [Stackdriver](https://app.google.stackdriver.com) and setup a couple checks for your server and instances managing your applications.
 
 
 For more practical sessions on setting up uptime checks, kindly move on to doing this [quickstart codelab here](https://cloud.google.com/monitoring/quickstart-lamp) to get a better intro as to how this monitoring thing works for real.
 
 
Thanks for reading

DevFest Ajah, 2018.
















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

That's it. Once we add the dependency to our application, we can automatically use tracing. Do be sure to authenticate if you're using this outside any Google Cloud deployment service (App Engine, Compute Enigne, Kubernetes Engine). More docs [here](https://cloud.google.com/iam/docs/creating-managing-service-accounts), then continue to [here](https://cloud.google.com/trace/docs/setup/nodejs#running_locally_and_elsewhere) for setting up in another language.











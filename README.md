
This project demonstrates how to develop an offline capable [OpenUI5](http://openui5.org/) application using the new [ServiceWorker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API).

You can try it out in current Chrome, Opera or Android browsers: 
https://pensoffsky.github.io/OpenUI5-ServiceWorker/index.html

## Disclaimer
- this concept does unfortunately not work with "normal" UI5 resources because they use sync XMLHttpRequests which are not supported by the ServiceWorker API. The project uses [modified UI5 resources](https://gist.github.com/matz3/521ab104c48ca24c389d) created by [matz3](https://github.com/matz3) that load async. 
- only https is supported by ServiceWorker because of security reasons
- the ServiceWorker API is not yet supported in all browsers. You can check the availability [here](http://caniuse.com/#feat=serviceworkers)
- the delayed loading of the UI5 resources was adapted from this concept:
[Asynchronous load of SAPUI5](http://scn.sap.com/community/developer-center/front-end/blog/2013/12/21/asynchronous-load-of-sapui5)

## Features
- Graceful degradation
    - if the ServiceWorker API is not available in the browser than the feature is ignored and it works as a normal online application
- Start of app
    - the first time you open the application all needed resources are loaded from the server and cached in the browser. After this the next time you open the application it is served directly from the ServiceWorker cache. This means you can disconnect your internet connection and still open the app in the browser just by navigating to the URL.
- Querying of stock price
    - if you have an internet connection then the http request goes directly to the yahoo webservice. The result is then written to the ServiceWorker cache and displayed in the app. (the timestamp in the response changes)
    - if you are offline then the request is answered from the cache. The last successful cached request is returned.

Files
- index.html
    - main entry file. Installs the ServiceWorker, loads OpenUI5 resources and instantiates the app.
- sw.js
    - contains the ServiceWorker definitions 
    - the new [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) is used extensively
- dist/
    - location of the OpenUI5 resources

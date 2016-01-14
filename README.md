
Try it out in Chrome, Opera or Android: 
https://pensoffsky.github.io/OpenUI5-ServiceWorker/index.html


The loading of the UI5 resources was adapted from this concept:
[Asynchronous load of SAPUI5](http://scn.sap.com/community/developer-center/front-end/blog/2013/12/21/asynchronous-load-of-sapui5)


- Graceful Degradation
    - If the ServiceWoker API is not supported by the browser then the app will still be loaded normally: `if ('serviceWorker' in navigator) {`
- App is available offline directly in browser


http://caniuse.com/#feat=serviceworkers
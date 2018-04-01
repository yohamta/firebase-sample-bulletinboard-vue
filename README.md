# Bulletin Board Sample Application Built With Firebase And Vue.js

## Demo
https://fir-sample-e480e.firebaseapp.com/#/

## Screenshots
![alt text](https://raw.githubusercontent.com/yotahamadaz/firebase-sample-bulletinboard-vue/master/screenshot1.png)
![alt text](https://raw.githubusercontent.com/yotahamadaz/firebase-sample-bulletinboard-vue/master/screenshot2.png)

## Build Setup

### npm install
``` bash
# install dependencies
npm install
```

### deploy firebase function
``` bash
cd functions

# install dependencies
npm install

# deploy functions
firebase login
firebase deploy --only functions
```

### Change Config
Open src/config/dev.config.js and change '*****' information for your App.
``` js
export default {
  firebase: {
    apiKey: '*****',
    authDomain: '*****',
    databaseURL: '*****',
    projectId: '*****',
    storageBucket: '*****',
    messagingSenderId: '*****',
  },
  endpoints: {
    createThread: 'https://*****/CreateThread',
    addComment: 'https://*****/AddComment',
  },
}
```

### Run on Local PC

``` bash
# serve with hot reload at localhost:8080
npm run dev
```

### Deploy
``` bash

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# deploy
firebase login
firebase deploy
```

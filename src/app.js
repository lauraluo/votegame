import Vue from 'vue'
import VueFire from 'vuefire'
import Firebase from 'firebase'

var initFBConfig = {
    apiKey: "AIzaSyDMY4iAWlqS5Qv1UklqR5b3nxYKdiISMgo",
    authDomain: "voteconfig.firebaseapp.com",
    databaseURL: "https://voteconfig.firebaseio.com",
    storageBucket: "voteconfig.appspot.com",
    messagingSenderId: "585262339108"
};

var initFBGame = {
    apiKey: "AIzaSyBZAcj5qF4NqnN7BOEcbnqNGIh6lJsQPT8",
    authDomain: "voterdemo-7aee9.firebaseapp.com",
    databaseURL: "https://voterdemo-7aee9.firebaseio.com",
    storageBucket: "voterdemo-7aee9.appspot.com",
    messagingSenderId: "164280679850"
};
var config = {
    apiKey: "AIzaSyDeKIutwIDgLhXlPRH3a0jmXKsnGXVVGwU",
    authDomain: "vuedemo-669fb.firebaseapp.com",
    databaseURL: "https://vuedemo-669fb.firebaseio.com",
    storageBucket: "vuedemo-669fb.appspot.com",
};

Firebase.initializeApp(initFBGame);
var dbGame = Firebase.database().ref('/voters');

// Firebase.initializeApp(initFBGame);
// var fbConfig = Firebase.initializeApp(initFBConfig, "fbConfig");

// var dbGame = Firebase.database();
// var dbConfig = fbConfig.database();

// console.log(Firebase.app().name); // "[DEFAULT]"
// console.log(fbConfig.name); // "other"

Vue.use(VueFire);
Vue.component('com1', require('./components/text.vue'))
    //投票按鈕
    //是不是暫停 是不是超過了活動時間
    //輸入資料的視窗
    //已經投過的視窗

dbGame.on('value', function(snapshot) {
        console.log(snapshot.val());
    })
    // dbGame.ref("/voters").push({})
const app = new Vue({
    // delimiters: ['[', ']'],
    el: '#rootApp',
    data: {
        msg: 'Hello lauraadfadf',
        vote: []
    },
    firebase: {
        // simple syntax, bind as an array by default
        vote: dbGame
            // questions: dbConfig.ref("gammers").limitToLast(25)
            // can also bind to a query
            // anArray: db.ref('url/to/my/collection').limitToLast(25)
            // full syntax
            // anObject: {
            //     source: db.ref('url/to/my/object'),
            //     // optionally bind as an object
            //     asObject: true,
            //     // optionally provide the cancelCallback
            //     cancelCallback: function() {}
            // }
    },
    methods: {
        clickButton() {
            console.log("click");
            this.msg = 'page 1'
        }
    }
})
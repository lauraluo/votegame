import Vue from 'vue'
import VueFire from 'vuefire'
import Firebase from 'firebase'

//====================
//firebase init 
//====================

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

var Firebase_config = Firebase.initializeApp(initFBConfig);
var Firebase_game = Firebase.initializeApp(initFBGame, 'Firebase_game');

// var fbConfigRef = Firebase_config.database().ref();//root
// var fbGamersRef = Firebase_config.database().ref('gamers');
// var fbGameResusltRef = Firebase_game.database().ref('statistics');


//====================
// vue init 
//====================

Vue.use(VueFire);
// Vue.component('com', require('./components/Text.vue'));
// Vue.component('popup', require('./component/Popup.vue'));
// Vue.component('popup', require('./components/vDialog.vue'));

// fbGamersRef.on('value', function(snapshot) {
//     // console.log(snapshot.val());
//     console.log(snapshot);
//     console.log("There are " + snapshot.numChildren() + " messages");
// });

const app = new Vue({
    // delimiters: ['[', ']'],
    el: '#rootApp',
    mounted: function(){
        var _this = this;
        
        //只取一次
        Firebase_config.database().ref().once('value', function(snapshot) {
            this.endDate = snapshot.child('endDate').val();
            this.stage = snapshot.child('stage').val();
            this.gamers =  snapshot.child('gamers').val();
            this.isPaused =  snapshot.child('isPaused').val();
        }.bind(this));

        //參賽者數量初始化
        Firebase_game.database().ref('statistics').on('value', function(snapshot) {
            snapshot.forEach(function(snap){
                console.log(snap.numChildren());
                console.log(snap.key);
                _this.counts[snap.key] = snap.numChildren();
            });
            console.log(_this.counts);
        }.bind(this));


    
    },
    data: {
        startDate: "",
        endDate: "",
        isPaused: false,
        stage: -1,
        gamers: [],
        results: [],
        shareUrl: "",
        counts:{} //裝計數的容器
    },
    //動態綁定
    firebase: {
        results: Firebase_game.database().ref('statistics')
    },
    methods: {
        clickButton() {
            console.log("click");
            this.msg = 'page 1';
        }
    }
})

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

window.Firebase_config = Firebase.initializeApp(initFBConfig,'Firebase_config');
window.Firebase_game = Firebase.initializeApp(initFBGame, 'Firebase_game');
window.Firebase_gameStatisticsRef = Firebase_game.database().ref('statistics');
window.Firebase_gameVotersRef = Firebase_game.database().ref('voters');

//====================
// vue init 
//====================

var eventCtrls = new Vue();

window.mixins = {
    enCode: function(str) {
        return str;
    },
    deCode: function(str) {
        return str;
    }
};


Vue.use(VueFire);
Vue.component('lightbox', require('./components/Lightbox.vue'));
Vue.component('trems', require('./components/trems.vue'));
Vue.component('forms', require('./components/forms.vue'));
// Vue.component('trems', require('./components/alert.vue'));

const app = new Vue({
    // delimiters: ['[', ']'],
    el: '#rootApp',
    mixins: [mixins],
    mounted: function() {
        var _this = this;

        //只取一次
        Firebase_config.database().ref().once('value', function(snapshot) {
            var startDate = snapshot.child('startDate').val();
            var endDate = snapshot.child('endDate').val();

            this.startDate = new Date(startDate);
            this.endDate = new Date(endDate);

            this.stage = snapshot.child('stage').val();
            this.gamers = snapshot.child('gamers').val();
            this.isPaused = snapshot.child('isPaused').val();
        }.bind(this));

        //參賽者數量初始化
        Firebase_gameStatisticsRef .on('value', function(snapshot) {
            snapshot.forEach(function(snap) {
                Vue.set(_this.counts, snap.key, snap.numChildren())
            });
        }.bind(this));

        //從cookie初始化每一位的投票timemap




    },
    watch: {
        'showModal': function(newVal, oldVal) {}
    },
    data: {
        startDate: '0000/00/00',
        endDate: '0000/00/00',
        isPaused: false,
        stage: -1,
        gamers: [],
        results: [],
        shareUrl: "",
        submitKey: "",
        modalConfig: {
            isShow: false,
            currentView: 'trems'
        },
        member: {
            isVoted: false,
            name: "",
            phone: "",
            timestamps: {
                //從 cookie 初始化
                // 'g1': 'date',
                // 'g2': 'date'
            }
        },
        cookieConfig: {
            trems: {
                name: 'argeTrems'
            },
            localTimestamp: {
                name: 'localTimestamp'
            }
        },
        counts: {} //裝計數的容器
    },
    //動態綁定
    firebase: {
        // results: Firebase_game.database().ref('statistics')
    },
    methods: {
        openModal: function(currentView, callback) {
            console.log(currentView);
            if (currentView && typeof currentView == 'string') {
                this.modalConfig.currentView = currentView
                this.modalConfig.isShow = true;
            }

            if (callback && typeof callback == 'function') {
                callback();
            }

        },
        closeModal: function(callback) {
            this.modalConfig.isShow = false;

            if (callback && typeof callback == 'function') {
                callback();
            }

        },
        isGameActive: function() {
            var _this = this;
            var result = false;
            var now = new Date((new Date).format('YYYY/MM/DD'));

            if (!_this.isPaused) {
                if (now <= _this.endDate && now >= _this.startDate) {
                    result = true;
                }
            } 

            return result;

        },
        isGamerActive: function(key) {
            return true;
        },
        handleClickVoteBtn: function($event, key) {
            var _this = this;
            _this.submitKey = key;

            if (!_this.isGameActive()) {
                alert('活動目前停止中');
                return false;
            }

            if (!_this.isGamerActive()) {
                alert('一天只能投一次票');
                return false;
            }

            _this.openModal('trems', function() {
                console.log('setcookie');
                utilityJS.cookie(_this.cookieConfig.trems.name,true, { expires: 1 });
            });

        }
    }
})

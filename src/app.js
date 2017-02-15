﻿import Vue from 'vue'
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

window.Firebase_config = Firebase.initializeApp(initFBConfig, 'Firebase_config');
window.Firebase_game = Firebase.initializeApp(initFBGame, 'Firebase_game');
window.Firebase_gameStatisticsRef = Firebase_game.database().ref('statistics');
window.Firebase_gameVotersRef = Firebase_game.database().ref('voters');

//====================
// vue init 
//====================

var eventCtrls = new Vue();

var cookieConfig = {

};
// window.mixins = {
//     enCode: function(str) {
//         return str;
//     },
//     deCode: function(str) {
//         return str;
//     }
// };

//gobal mixins
Vue.mixin({
    created: function() {
        var _this = this;
        var CryptographerManager = function() {

            var that = this, // Public methods
                mgr = {}; // Privat methods

            /** 
             * 取得加解密規則
             * @returns {binary[]} 加解密規則
             */
            mgr['CUSTOM_HASH_VALUE'] = function() {
                return [7, -1, -4, 9, 8, 1, 3, 2, -6, 5, -4, -2, 1, 1, 9, -1];
            };

            /** 
             * 取得自訂加密或解密結果
             * @param {bool} isEncrypt true:加密 / false:解密
             * @param {binary[]} source 需加解密二位元文字
             * @returns {binary[]} 加解密處理後二位元文字
             */
            mgr['getCustomHash'] = function(isEncrypt, source) {
                var count = 0,
                    customHash = mgr.CUSTOM_HASH_VALUE(),
                    customHashLength = customHash.length,
                    size = source.length,
                    result = [];

                for (var i = 0; i < size; i++) {
                    var sourceChar = parseInt(source[i], 2);
                    result[i] = sourceChar + (isEncrypt ? customHash[count] : -customHash[count]);
                    result[i] = result[i].toString(2);

                    count++;
                    count = count % customHashLength;
                }
                return result;
            }

            /** 
             * 加密字串
             * @param {string} source 欲加密的字串
             * @returns {string} 加密後的字串
             */
            that.encrypt = function(source) {
                var toEncryptSource = utilityJS.stringToBinaryArray(source);
                toEncryptSource = mgr.getCustomHash(true, toEncryptSource);
                var result = utilityJS.binaryArrayToString(toEncryptSource);

                return result;
            };

            /** 
             * 解密字串
             * @param {string} source 欲解密字串
             * @returns {string} 解密後的字串
             */
            that.decrypt = function(source) {
                var toDecryptSource = utilityJS.stringToBinaryArray(source);
                toDecryptSource = mgr.getCustomHash(false, toDecryptSource);
                var result = utilityJS.binaryArrayToString(toDecryptSource);

                return result;
            };

        };

        _this.cryptographer = new CryptographerManager();
    }
});


Vue.use(VueFire);
Vue.component('lightbox', require('./components/Lightbox.vue'));
Vue.component('trems', require('./components/trems.vue'));
Vue.component('forms', require('./components/forms.vue'));
Vue.component('success', require('./components/Success.vue'));

const app = new Vue({
    el: '#rootApp',
    mounted: function() {
        var _this = this;
        var localTimestampCookie = utilityJS.cookie(_this.cookieConfig.localTimestamp.name);

        if (utilityJS.cookie(_this.cookieConfig.trems.name) == null) {
            utilityJS.cookie(_this.cookieConfig.trems.name, false, { expires: 1 });
        }

        if (utilityJS.cookie(_this.cookieConfig.localTimestamp.name) == null) {
            utilityJS.cookie(_this.cookieConfig.localTimestamp.name, "{}", { expires: 99 });
            // Vue.delete( object, key )

        }

        _this.member.timestamps = JSON.parse(utilityJS.cookie(_this.cookieConfig.localTimestamp.name));


        //只取一次
        Firebase_config.database().ref().on('value', function(snapshot) {
            var startDate = snapshot.child('startDate').val();
            var endDate = snapshot.child('endDate').val();

            this.startDate = new Date(startDate);
            this.endDate = new Date(endDate);

            this.stage = snapshot.child('stage').val();
            this.gamers = snapshot.child('gamers').val();
            this.isPaused = snapshot.child('isPaused').val();
        }.bind(this));

        //參賽者數量初始化
        Firebase_gameStatisticsRef.on('value', function(snapshot) {
            snapshot.forEach(function(snap) {
                var timestampString = _this.member.timestamps[snap.key] || '0';
                Vue.set(_this.counts, snap.key, snap.numChildren());
                Vue.set(_this.member.timesExpired, snap.key, (_this.getNowDate() > new Date(timestampString)))
            });
        }.bind(this));
        
    },
    watch: {
        'showModal': function(newVal, oldVal) {}
    },
    data: {
        startDate: '0',
        endDate: '0',
        isPaused: false,
        getNowDate: function() {
            return new Date((new Date).format('YYYY/MM/DD'));
        },
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
                // 'g1': 'Date object',
                // 'g2': 'Date object'
            },
            timesExpired: {
                // 'g1': true,
                // 'g2': false               
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
        counts: {

        }, //裝計數的容器
    },
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
        isVoteBtnActive: function(key) {
            var _this = this;
            var result = true;

            if (_this.member.timesExpired[key] !== undefined) {
                result = _this.member.timesExpired[key];
            }

            return result;
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
        handelCookieChange: function(name, value) {
            //when cookie change reset data
        },
        handleClickVoteBtn: function($event, key) {
            var _this = this;
            _this.submitKey = key;

            $event.preventDefault();

            if (!_this.isGameActive()) {
                alert('活動目前停止中');
                return false;
            }

            if (!_this.isVoteBtnActive(key)) {
                alert('一天只能投一次票');
                return false;
            }

            if (JSON.parse(utilityJS.cookie('argeTrems')) == true) {
                _this.openModal('forms', function() {});
                return false;
            }

            _this.openModal('trems', function() {});

        }
    }
})

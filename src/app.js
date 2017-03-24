// import Vue from 'vue'
// import Firebase from 'firebase'
// import $ from 'jquery'

// var Vue = require('vue');
// var Firebase = require('firebase');
// var $ = require('jquery');

//====================
//firebase init 
//====================

// var Firebase = firebase;
var initFBConfig = {
    apiKey: "AIzaSyDMY4iAWlqS5Qv1UklqR5b3nxYKdiISMgo",
    authDomain: "voteconfig.firebaseapp.com",
    databaseURL: "https://voteconfig.firebaseio.com",
    storageBucket: "voteconfig.appspot.com",
    messagingSenderId: "585262339108"
};

//正式機
var initFBGame = {
    apiKey: "AIzaSyBZAcj5qF4NqnN7BOEcbnqNGIh6lJsQPT8",
    authDomain: "voterdemo-7aee9.firebaseapp.com",
    databaseURL: "https://voterdemo-7aee9.firebaseio.com",
    storageBucket: "voterdemo-7aee9.appspot.com",
    messagingSenderId: "164280679850"
};

//test data base
// var initFBGame = {
//     apiKey: "AIzaSyDr2KVsxSxxYkpO0-VqNV9bzUuXFJNz0Mg",
//     authDomain: "lalasproject-90237.firebaseapp.com",
//     databaseURL: "https://lalasproject-90237.firebaseio.com",
//     storageBucket: "lalasproject-90237.appspot.com",
//     messagingSenderId: "50410735864"
// };

window.Firebase_config = firebase.initializeApp(initFBConfig, 'Firebase_config');
window.Firebase_game = firebase.initializeApp(initFBGame, 'Firebase_game');
window.Firebase_gameStatisticsRef = Firebase_game.database().ref('statistics');
window.Firebase_gameOrderlistRef = Firebase_game.database().ref('orderlist');
window.Firebase_gameVotersRef = Firebase_game.database().ref('voters');

//====================
// vue init 
//====================




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

                result = result.replace(/\./g, "．");
                result = result.replace(/\#/g, "＃");
                result = result.replace(/\$/g, "＄");
                result = result.replace(/\[/g, "〔");
                result = result.replace(/\]/g, "〕");
                result = result.replace(/\//g, "／");


                return encodeURI(result);
            };

            /** 
             * 解密字串
             * @param {string} source 欲解密字串
             * @returns {string} 解密後的字串
             */
            that.decrypt = function(source) {
                source = decodeURI(source)

                source = source.replace(/\．/g, ".");
                source = source.replace(/\＃/g, "#");
                source = source.replace(/\＄/g, "$");
                source = source.replace(/\〔/g, "[");
                source = source.replace(/\〕/g, "]");
                source = source.replace(/\／/g, "/");


                var toDecryptSource = utilityJS.stringToBinaryArray(source);
                toDecryptSource = mgr.getCustomHash(false, toDecryptSource);
                var result = utilityJS.binaryArrayToString(toDecryptSource);


                return result;
            };


        };

        _this.cryptographer = new CryptographerManager();

        _this.getToken = function() {
            
            var token = utilityJS.cookie('token');

            return token;
        };


        _this.getNowFormatString = function(){
            return  (new Date).format('YYYY-MM-DD');
        }
    }
});


// Vue.use(VueFire);
Vue.component('lightbox', require('./components/Lightbox.vue'));
Vue.component('trems', require('./components/trems.vue'));
Vue.component('forms', require('./components/forms.vue'));
Vue.component('success', require('./components/Success.vue'));
Vue.component('vote', require('./components/Vote.vue'));
Vue.component('subApp', require('./components/SubApp.vue'));

if($('#rootApp').length > 0){
    const app = new Vue({
        el: '#rootApp',
        template: '<vote></vote>'
    });
}


if($('#subApp').length > 0){
    const subapp = new Vue({
        el: '#subApp',
        template: '<subApp></subApp>'
    });
}
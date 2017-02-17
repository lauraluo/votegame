<template lang="pug">
    div#root-inner
        div.l-container
            section.vote
                div.vote__hd
                    div.vote__cover
                        h1.hide-text 蜜糖甜心就是你，尋找BUTY，品牌大使
                        a.vote__share.hide-text(href="https://www.facebook.com/sharer/sharer.php?u=http://www.butybaby.com/m/index.php" title="Buty Baby 蜜糖甜心" target="_blank") 
                div.vote__bd
                    div.vote__content
                        ul.vote__items.clearfix
                            //- for(n=0;n<8;n++)
                            li.vote__item(v-for="gamer in gamersSort" v-show="gamer.stage == stage")
                                div.vote__item__wrap
                                    div.vote__item__media
                                        img(:src="gamer.imgUrl")
                                    div.vote__item__content.clearfix
                                        div.vote__item__text
                                            div.name 姓名/暱稱：{{ gamer.name }}
                                            div.count 票數： {{ counts[gamer.key] ? counts[gamer.key] : 0 }}
                                        div.vote__item__ctrl
                                            a.vote__btn.pure-button.pure-button-primary(href="#", title="", v-on:click="handleClickVoteBtn($event, gamer.key)", v-bind:class="{ 'pure-button-disabled': !isVoteBtnActive(gamer.key) }") 投票給我
                div.vote__ft
                    h3.pc-only 東森蝶蒙股份有限公司 235新北市中和市景平路258號 0800-013-058
                    p.mb-only 235新北市中和市景平路258號 0800-013-058

        lightbox(v-on:close="closeModal",v-on:open="openModal", v-bind:show-modal="modalConfig.isShow", v-bind:name="modalConfig.currentView")
            transition(name="modal")
                component(v-bind:is="modalConfig.currentView",v-on:close="closeModal",v-on:open="openModal"  v-on:complete="handleCompletedVote" v-bind:voteid="submitKey", v-bind:member="member") 
</template>

<script>
    export default {
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


            Firebase_config.database().ref().on('value', function(snapshot) {
                var startDate = snapshot.child('startDate').val();
                var endDate = snapshot.child('endDate').val();

                _this.startDate = new Date(startDate);
                _this.endDate = new Date(endDate);

                _this.stage = snapshot.child('stage').val();
                _this.gamers = snapshot.child('gamers').val();
                _this.isPaused = /true/i.test(snapshot.child('isPaused').val());


                Firebase_gameStatisticsRef.on('value', function(snapshot) {
                    snapshot.forEach(function(snap) {
                        var timestampString = _this.member.timestamps[snap.key] || '0';
                        Vue.set(_this.counts, snap.key, snap.numChildren());
                        Vue.set(_this.member.timesExpired, snap.key, (_this.getNowDate() > new Date(timestampString)))
                    });


                    _this.sortGamersOrderByCount();

                });

            });

        },
        data: function(){
            return {
                startDate: '0',
                endDate: '0',
                isPaused: false,
                getNowDate: function() {
                    return new Date((new Date).format('YYYY-MM-DD'));
                },
                stage: -1,
                gamers: {},
                gamersSort: [],
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
                    //"g1": 0
                }
            }
        },
        methods: {
            openModal: function(currentView, callback) {
                if (currentView && typeof currentView == 'string') {
                    this.modalConfig.currentView = currentView;
                    this.modalConfig.isShow = true;
                }

                if (callback && typeof callback == 'function') {
                    callback();
                }

            },
            closeModal: function(callback) {
                this.modalConfig.isShow = false;
                this.modalConfig.currentView = null;
                if (callback && typeof callback == 'function') {
                    callback();
                }

            },
            sortGamersOrderByCount: function() {
                var _this = this;
                var arr = [];

                $.each(_this.gamers, function(key, element) {
                    arr.push({
                        key: key,
                        name: element.name,
                        stage: element.stage,
                        imgUrl: element.imgUrl,
                        count: _this.counts[key] || 0
                    });
                });


                arr.sort(function(a, b) {
                    return b.count - a.count;
                });


                _this.gamersSort = arr;


            },
            handleCompletedVote: function(key) {
                var _this = this;
                var timestampString = "";

                _this.member.timestamps = JSON.parse(utilityJS.cookie(_this.cookieConfig.localTimestamp.name));

                timestampString = _this.member.timestamps[key] || '0';

                Vue.set(_this.member.timesExpired, key, (_this.getNowDate() > new Date(timestampString)))
            },
            isVoteBtnActive: function(key) {
                var _this = this;
                var result = true;

                if (_this.member.timesExpired[key] !== undefined) {
                    result = _this.member.timesExpired[key];
                }

                return result;
            },
            isGameActive: function() {
                var _this = this;
                var result = false;
                var now = _this.getNowDate();

                if (!_this.isPaused) {
                    if (now <= _this.endDate && now >= _this.startDate) {
                        result = true;
                    }
                }

                return true;

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
    }
</script>

<style>

</style>
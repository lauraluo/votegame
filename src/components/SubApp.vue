<template lang="pug">
div.container-fluid
    div.row
        div.col-md-6
            div.subapp-config
                h2 發送設定
                form.form-horizontal.row
                    fieldset
                        .form-group
                            label.col-md-3.control-label(for='selectbasic') 選擇選手
                            .col-md-9
                                select#selectbasic.form-control(name='selectbasic' v-model="voteID" v-bind:disabled='isProcessing')
                                    option(value='g1' v-for="(gamer,key) in gamers" v-bind:value="key" v-show="gamer.stage == 2") {{key}} {{gamer.name}}
                        .form-group.range
                            label.col-md-3.control-label(for='textinput') 名單數量
                            .col-md-9
                                input#textinput.form-control.input-md(name='textinput' type='range' placeholder='請填入整數 1~1000' min="1" max="1000" step="1" v-model.number="voteAmount" v-bind:readonly='isProcessing')
                                span.block-help {{voteAmount}}
                        .form-group.range
                            label.col-md-3.control-label(for='textinput') 投票的區間秒數
                            .col-md-9
                                input#textinput.form-control.input-md(name='textinput', type='range', placeholder='請填入整數 3~100' min="3" max="100" step="1" v-model.number="voteTime" v-bind:readonly='isProcessing')
                                span.block-help {{voteTime}}
                        .form-group.range
                            label.col-md-3.control-label(for='textinput') 手機號碼的啟始值
                            .col-md-9
                                input#textinput.form-control.input-md(name='textinput' type='range' placeholder='輸入啟始號碼的跳號' min="0" max="9000000" step="10000"  v-model.number="phomeRandomBaseAdjustment" v-bind:readonly='isProcessing')
                                span.block-help  號碼由 {{displayPhomeStartBy}}  ~  {{displayPhomeEndBy}} 流水號產生
                        .form-group.ctrls
                                button.btn.btn-info(type='button' @click="getMemberList" v-show="isProcessing == false && memberList.length == 0 ") 產生名單
                                button.btn.btn-primary(type='button' @click="batchProcessing" v-show="isProcessing == false && memberList.length > 0 ") 開始發送
                                button.btn.btn-danger(type='button' @click="cancleProcessing" v-show="isProcessing == true") 取消發送
                h4 注意事項
                ul
                    li 請注意重複的手機號碼不會增加投票數量，票數增加的結果請以最後投票畫面的票數為主
                    li 本應用僅支援新版的chrome瀏覽器

                h4 操作說明
                ol
                    li 請先設定投票需求
                        ul
                            li 選擇選手：選擇欲投票的選手
                            li 名單數量：選擇批次投票的數量
                            li 投票的區間秒數：投票的間隔
                            li 手機號碼的啟始值：手機流水號的區間(注意重複的手機不會增加票數)
                    li 點選產生名單，在右邊可以預覽名單列表
                    li 點選開始發送，可在右邊觀看發送狀態
                    li 點選取消發送，系統會停止投票的發送 

        div.row.col-md-6
            div.subapp-list.row
                h2 發送紀錄
                    span.list-counter {{requestIndex}} / {{memberList.length}}
                table.table.table-striped
                    tbody
                        tr(v-for="(member,index) in memberList")
                            td # {{index}} {{ member.name }}
                            td {{ member.phone }}
                            td 
                                span.text-info(v-if="member.state == 0") Wating...
                                span.text-success(v-if="member.state == 1")  OK
</template>

<script>

    export default {
        created: function () {
            var _this = this;
            //random的base從cookie讀，如果有則取cookie


            Firebase_config.database().ref().on('value', function(snapshot) {
                _this.stage = snapshot.child('stage').val();
                _this.gamers = snapshot.child('gamers').val();
                _this.isPaused = /true/i.test(snapshot.child('isPaused').val());
                
            });

            _this.phomeRandomBaseLog = _this.phomeRandomBase;            
        },
        data: function () {
            return {
                isPaused: false,
                gamers: {},
                stage: 2,
                active: null,
                timeRange: [0, 0],
                memberList: [],
                voteID: "",
                voteAmount: 10,
                voteTime: 3,
                phomeRandomBaseAdjustment: 0,
                phomeRandomBaseLog: 990000000,
                phomeRandomBase: 990000000,
                isProcessing: false,
                requestIndex: 0,
                setTimeout: null
            }
        },
        computed: {
            displayPhomeStartBy: function(){
                return '0' + (this.phomeRandomBase + this.phomeRandomBaseAdjustment).toString();
            },
            displayPhomeEndBy: function(){
                return '0' + (this.phomeRandomBase + this.phomeRandomBaseAdjustment + this.voteAmount).toString();
            }
        },
        methods: {
            getRandomName: function () {

                function random(a, l) {
                    var x = [];
                    x.push(a[Math.ceil(Math.random() * a.length)]);
                    while (l > 1) {
                        x.push(a[Math.ceil(Math.random() * a.length)]);
                        l--;
                    }
                    return x.join("");
                }

                return random("李 王 張 劉 陳 楊 黃 趙 周 吳 徐 孫 朱 馬 胡 郭 林 何 高 梁 鄭 羅 宋 謝 唐 韓 曹 許 鄧 蕭 馮 曾 程 蔡 彭 潘 袁 於 董 餘 蘇 葉 呂 魏 蔣 田 杜 丁 沈 姜 範 江 傅 鐘 盧 汪 戴 崔 任 陸 廖 姚 方 金 邱 夏 譚 韋 賈 鄒 石 熊 孟 秦 閻 薛 侯 雷 白 龍 段 郝 孔 邵 史 毛 常 萬 顧 賴 武 康 賀 嚴 尹 錢 施 牛 洪 龔".split(" ")) + random("世 中 仁 伶 佩 佳 俊 信 倫 偉 傑 儀 元 冠 凱 君 哲 嘉 國 士 如 娟 婷 子 孟 宇 安 宏 宗 宜 家 建 弘 強 彥 彬 德 心 志 忠 怡 惠 慧 慶 憲 成 政 敏 文 昌 明 智 曉 柏 榮 欣 正 民 永 淑 玉 玲 珊 珍 珮 琪 瑋 瑜 瑞 瑩 盈 真 祥 秀 秋 穎 立 維 美 翔 翰 聖 育 良 芬 芳 英 菁 華 萍 蓉 裕 豪 貞 賢 郁 鈴 銘 雅 雯 霖 青 靜 韻 鴻 麗 龍".split(" "), Math.ceil(Math.random() * 2));

            },
            getRandomPhoneNameber: function () {
                //格式化手機號碼
                var _this = this;
                var phone = "";
                phone = '0' + (_this.phomeRandomBaseLog++).toString();
                return phone;
            },
            getMemberList: function () {
                var _this = this;
                var templist =[];

                for (i = 0; i < _this.voteAmount; i++) {
                    var member = {
                        name: _this.getRandomName(),
                        phone:_this.getRandomPhoneNameber(),
                        state: 0
                    }; 
                    templist.push(member);
                }
                _this.memberList = templist;
            },
            cancleProcessing:function(){
                var _this = this;
                clearInterval(_this.setInterval);
                _this.memberList = [];
                _this.voteID = "";
                _this.isProcessing = false;
            },
            batchProcessing: function(){
                var _this = this;

                if(_this.isPaused) {
                    alert("活動目前暫停中");
                    return;
                }


                if( !_this.voteID || _this.voteID == "") {
                    alert("請先選擇選手");
                    return;
                }

                _this.requestIndex= 0;
                _this.isProcessing = true;

                _this.setInterval = setInterval(function () {
                    if (_this.requestIndex >= _this.memberList.length) {
                        clearInterval(_this.setInterval);
                        _this.isProcessing = false;
                    }
                    else {
                        _this.submitMember(_this.memberList[_this.requestIndex],_this.requestIndex);
                        _this.requestIndex++;
                    }
                }, _this.voteTime * 1000);
            },
            submitMember: function(member,requestIndex){
                var _this = this;
                var voteID = _this.voteID;
                var memberKey = _this.cryptographer.encrypt(member.phone);
                var seekingRequest = [$.Deferred(), $.Deferred()];
                var pushMemberObject = {
                    name: member.name,
                    timestamp: _this.getNowFormatString()
                };
                var pushResultObject = {
                    memberkey: memberKey,
                    timestamp: _this.getNowFormatString()
                };

                $.when( seekingRequest[0],seekingRequest[1]).done(function(task1, task2) {
                    _this.memberList[requestIndex].state = 1;
                    console.log(requestIndex + '......OK');
                });


                //雙主key
                Firebase_gameStatisticsRef.child(voteID + '/' + (memberKey+_this.timestamp)).update(pushResultObject, function(error) {
                    seekingRequest[0].resolve(error);
                });

                Firebase_gameVotersRef.child(memberKey).update(pushMemberObject, function(error) {
                    seekingRequest[1].resolve(error);
                });
            }
        }
    }
</script>

<style scoped lang="scss">
h2 {
    border-bottom: 1px solid #d6d6d6;
    padding-bottom: 15px;
    margin-bottom: 40px;

}
.subapp-config {
    margin:0 30px 30px 30px;
    .range {
        input {
            box-shadow: none;
            border: 0;
        }
    }
    .ctrls {
        text-align: right;
        margin-right:0px;
        button {
            margin: 5px;
            min-width: 100px;
        }
    }
    .phonebase {
        .block-help input[type='checkbox'] {
            display: inline-block
            // margin-right: 10px;
        }
        .block-help .info {
            display: inline-block;
            margin-left: 10px;
        }
    }
}

.subapp-list {
    margin:0px 30px 0px 30px;
    padding-top: 100px;
    box-sizing: border-box;
    // height: 100vh;
    position: relative;
    .list-counter  {
        float: right;
    }
    h2 {
        position: absolute;
        z-index: 2;
        width: 100%;
        top: 0px;
        
    }
    table {
        position: relative;
        table-layout: fixed;

    }
    thead {
       

    }
    tbody {
        display: block;
        max-height: 80vh;
        overflow: scroll;
        td {
            width: 16vw;
        }
    }

}


</style>
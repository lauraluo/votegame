<template lang="pug">
div
    h2 請輸入以下的資訊以完成投票並參加抽獎!
    .vote-forms
        form.pure-form.pure-form-stacked(action='vote-done.html')
            fieldset
                ul
                    li
                        label(for='name') 你的名字 (必填)
                        div.vote-froms__input-wrap
                            input#name.pure-input-1(type='text', placeholder='請輸入你的暱稱', v-model="name.value", name="name")
                        span.pure-form-message.pure-form-message--error(v-show="name.isError") 這是必填欄位
                    li
                        label(for='phone') 手機號碼 (必填)
                        div.vote-froms__input-wrap
                            input#phone.pure-input-1(type='tel', placeholder='範例 0912345678', v-model="phone.value", name="phone")
                        span.pure-form-message.pure-form-message--error(v-show="phone.isError") 這是必填欄位，請輸入正確格式的手機號碼，09開頭共10碼
    div.vote-dialog__ctrls
        a.vote-btn.pure-button.pure-button-primary(href='#', title='同意', v-on:click="handleClickSubmitBtn($event)") 投我一票
</template>

<script>
    export default {
        props: ['voteid', 'member'],
        created: function() {
            var _this = this;

            $.when(_this.seekingRequest[0], _this.seekingRequest[1]).done(function(task1, task2) {
                _this.submitSuccess();
            });

            // _this.token = _this.getToken();

            // if(_this.token) {
            //     Firebase_gameStatisticsRef.child(_this.voteid+'/'+ _this.token).once('value',function(snapshot){

            //         var result = snapshot.val();

            //         console.log(result);

            //         if (result){
            //             _this.name.temp = result.name;
            //             _this.phone.temp =  result.phone;
            //         }

            //     });                
            // }


        },
        data: function() {
            return {
                seekingRequest: [$.Deferred(), $.Deferred()],
                disabled: false,
                token: null,
                isChanged: false,
                name: {
                    value: '',
                    temp: '',
                    isError: false
                },
                phone: {
                    value: '',
                    temp: '',
                    isError: false
                },
                timestamp: '0'
            }
        },
        computed: {},
        methods: {
            enCode: function(str) {
                return str;
            },
            deCode: function(str) {
                return str;
            },
            checkResult: function() {
                var _this = this;
                var phoneReg = /^[09]{2}[0-9]{8}$/;
                var result = false;

                if (_this.name.value == null || _this.name.value == '') {
                    _this.name.isError = true;
                }

                if ((_this.phone.value == null || _this.phone.value == '') || _this.phone.value.match(phoneReg) === null) {
                    _this.phone.isError = true;
                }

                return !(_this.name.isError || _this.phone.isError);

            },
            handleTempClick: function($event, inputID) {},
            setVoteStatusCookie: function() {
                var _this = this;
                var voteID = _this.voteid;
                var timestamp = _this.timestamp;
                var cookie = utilityJS.cookie('localTimestamp')
                var oldStatus = JSON.parse(cookie);
                var updateStatus = {};
                updateStatus[voteID] = timestamp;

                utilityJS.cookie('localTimestamp', JSON.stringify($.extend(oldStatus, updateStatus)), {
                    expires: 14
                });

                utilityJS.cookie('token', _this.cryptographer.encrypt(_this.phone.value), {
                    expires: 14
                });



            },
            submitSuccess: function() {
                var _this = this;
                _this.setVoteStatusCookie();
                _this.resetForms();
                _this.$emit('open', 'success', function() {});
                _this.$emit('complete', _this.voteid);
            },
            resetForms: function() {
                var _this = this;
                _this.isDisabed = false;
                _this.name.isError = false;
                _this.phone.isError = false;
            },
            submitData: function() {
                var _this = this;
                var voteID = _this.voteid;
                var memberKey = _this.cryptographer.encrypt(_this.phone.value);

                _this.timestamp = _this.getNowFormatString();

                var pushMemberObject = {
                    name: _this.name.value,
                    timestamp: _this.timestamp
                };

                var pushResultObject = {
                    memberkey: memberKey,
                    timestamp: _this.timestamp
                };

                _this.disabed = true;

                //雙主key
                Firebase_gameStatisticsRef.child(voteID + '/' + (memberKey+_this.timestamp)).update(pushResultObject, function(error) {
                    _this.seekingRequest[0].resolve(error);
                });

                Firebase_gameVotersRef.child(memberKey).update(pushMemberObject, function(error) {
                    _this.seekingRequest[1].resolve(error);
                });
            },
            handleClickSubmitBtn: function(e) {
                var _this = this;
                var voteID = _this.voteid;
                var memberKey = _this.cryptographer.encrypt(_this.phone.value);
                _this.timestamp = _this.getNowFormatString();

                // console.log(memberKey);
                // console.log(_this.cryptographer.decrypt(memberKey));


                e.preventDefault();

                if (_this.disabled) {
                    return false;
                }

                _this.resetForms();

                if (!_this.checkResult()) {
                    return false;
                }

                Firebase_gameStatisticsRef.child(voteID + '/' + (memberKey+_this.timestamp)).once('value', function(snapshot) {

                    var result = snapshot.val();

                    if (!result) {
                        //如果資料庫沒有資料，則繼續儲存
                        _this.submitData();

                    } else  {
                        alert('你已經投過票');
                        _this.setVoteStatusCookie();
                        _this.$emit('complete', _this.voteid);
                        _this.$emit('close');
                    }
                });

            }
        }
    }
</script>

<style>

</style>
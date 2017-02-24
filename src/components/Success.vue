<template lang="pug">
div
    h2 還差一個步驟！抽好獎
    div.vote-dialog__content
        |別忘了至BUTY BABY官方粉絲頁按讚並留言「我的#蜜糖甜心 候選人ＸＸＸ」即可抽大獎喔。
    div.vote-dialog__ctrls
        a.vote-btn.pure-button.pure-button-primary.pure-button-blue(href='https://www.facebook.com/permalink.php?story_fbid=178017672692600&id=136566846837683', target="_blank",title='FB立刻按讚留言') FB立刻按讚留言
</template>

<script>
    export default {
        props:[],
        watch: {
        },
        methods: {
            handeClickBtn: function(e){
                e.preventDefault();
                this.$emit('close',function(){});    
            }
        }
    }
</script>

<style>

</style>
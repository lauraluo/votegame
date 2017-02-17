<template lang="pug">
div
    h2 已完成投票，謝謝你的參與!
    div.vote-dialog__content
        p 投票後，該投票者看到該參賽者的按鈕改為”已投票”，系統限制一天對某參賽者只能投一票，但隔天即可繼續投票，累積票數。
    div.vote-dialog__ctrls
        a.vote-btn.pure-button.pure-button-primary(href='forms.html', title='同意', v-on:click="handeClickBtn($event)") 完成
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
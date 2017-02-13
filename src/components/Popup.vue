<template lang="jade">
    section.vote-dialog(v-show="isShow")
        div.vote-dialog__box
            a.vote-dialog__close(href="#")
</template>

<script>
    export default {
        props:{
            isShow: {
                type: Boolean,
                default: true 
            }
        },
        watch: {
            'isShow':function(vcal, oldVal){
                if(val){
                    $('body').css('overflow','hidden');
                }else {
                    $('body').css('overflow','auto');
                }
            }
        },
        methods: {
            open: function () {
                this.onOpen();
            },
            close: function () {
                this.onOpen();
            }  
        }
    }
</script>

<style lang="stylus" scoped>
</style>
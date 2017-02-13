<template lang="jade">
    transition(name="modal")
        section.vote-dialog(v-show="showModal")
            div.vote-dialog__box
                a.vote-dialog__close(href="#", v-on:click="close($event)")
                slot
</template>

<script>
    export default {
        props:['showModal','name'],
        watch: {
            'showModal':function(newVal, oldVal){
                // if(val){
                //     $('body').css('overflow','hidden');
                // }else {
                //     $('body').css('overflow','auto');
                // }
            }
        },
        methods: {
            open: function ($event) {
                var _this = this;
                eventCtrls.$emit('open', _this.name);

            },
            close: function ($event) {
                var _this = this;
                this.$emit('close', _this.name);
            }  
        }
    }
</script>

<style>

</style>
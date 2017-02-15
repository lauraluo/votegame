<template lang="pug">
    transition(name="modal")
        section.vote-dialog(v-show="showModal")
            div.vote-dialog__box
                a.vote-dialog__close(href="#", v-on:click="closeModal($event)")
                slot
</template>

<script>
    export default {
        props:['showModal'],
        watch: {
            'showModal':function(newVal, oldVal){
                if(newVal){
                    $('body').css('overflow','hidden');
                }else {
                    $('body').css('overflow','auto');
                }
            }
        },
        methods: {
            openModal: function ($event) {
                var _this = this;
                this.$emit('open');
            },
            closeModal: function ($event) {
                var _this = this;
                this.$emit('close');
            }  
        }
    }
</script>

<style>

</style>
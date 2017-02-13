<template lang="jade">
    transition(name="modal")
        section.vote-dialog(v-show="showModal")
            div.vote-dialog__box
                a.vote-dialog__close(href="#", v-on:click="close($event)")
                slot
</template>

<script>
    export default {
        props:['showModal'],
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
                // this.$emit('input', true);
                this.$emit('open');

            },
            close: function ($even) {
                this.$emit('close');
            }  
        }
    }
</script>

<style>

</style>
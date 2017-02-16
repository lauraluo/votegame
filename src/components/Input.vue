<template lang="pug">
div
    input.pure-input-1( type='{type}', placeholder='請輸入你的暱稱', v-bind:value="temp||value")
   
</template>

<script>
    export default {
        props:['type','placeholder','temp','value'],
        created: function(){
            if(temp) {
                isTemp: true
            }

        },
        data:function(){
            return {
                isTemp: false   
            }
        },
        computed: {

        },
        methods: {
            onInput: function (event) {
                this.$emit('input', isUseTemp,event.target.value)
            }
        }
    }
</script>

<style>

</style>
import Vue from 'vue'

Vue.component('com1', require('./components/text.vue'))

const app = new Vue({
    delimiters: ['[', ']'],
    el: '#app',
    data: {
        message: 'Hello laura'
    },
    methods: {
        clickButton() {
            console.log("click");
            this.message = 'page 1'
        }
    }
})
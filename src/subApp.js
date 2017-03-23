Vue.component('subApp', require('./components/SubApp.vue'));


if($('#subApp').length > 0){
    const subapp = new Vue({
        el: '#subApp',
        template: '<subApp></subApp>'
    });
}
var Vue = require('vue'); 
var DatePicker = require('./vue-datepicker.vue');
new Vue({
  el:'body',
  data: {
    date: "2016-04-15",
    disabledDate: function(current){
      return current && current.getTime() > Date.now();
    }
  },
  methods:{
    getDate: function(day){
      console.log(day);
    }
  },  
  components:{
    DatePicker: DatePicker
  }
});

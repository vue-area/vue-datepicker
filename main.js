Vue.config.debug = true;
var app = new Vue({
  el: 'body',
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
  }
})

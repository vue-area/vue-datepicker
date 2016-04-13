# vue-datepicker

a datepicker component for vue.js, online http://vue-area.github.io/vue-datepicker/ 

## uses

** simple **

```
<date-picker> </date-picker>

```

** set default date **

```
<date-picker value="1988-06-09" > </date-picker>

```

** disable use **

```
<date-picker :disabled="false" > </date-picker>

```

** disable range **

```html
<date-picker :disabled-date="disabledDate" > </date-picker>

```

```js
new Vue({
  el: 'body',
  data: {
    disabledDate: function(current){
      return current && current.getTime() > Date.now();
    }
  }
})

```

** method ** 

```html
<date-picker @change="getDate"> </date-picker>

```

```js
new Vue({
  el: 'body',
  methods:{
    getDate: function(day){
      console.log(day);
    }
  }
})
```
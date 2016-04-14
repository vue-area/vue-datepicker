<template>
  <div class="datepicker-container" v-cloak>
    <div class="datepicker-input">
      <input type="text" 
            v-model="value"
            @focus="inputFocus"
            :disabled="disabled"
            >
    </div>
    <div class="datepicker-panel" v-show="show">
      <div class="calendar-header">
        <a href="javascript:;" class="prev" @click="prevYear($event)">《</a>
        <a href="javascript:;" class="prev" @click="prevMonth($event)"><</a>
        <span class="title">{{currentYear + ' - ' + (currentMonth + 1) }}</span>
        <a href="javascript:;" class="next" @click="nextYear($event)">》</a>
        <a href="javascript:;" class="next" @click="nextMonth($event)">></a>
      </div>
      <div class="calendar-body">
        <table>
          <thead>
            <tr><td v-for="week in weeks">{{week}}</td></tr>
          </thead>
          <tbody>
          <tr v-for="i in 6">
            <td 
              v-for="j in 7" 
              :class="{'active': days[i * 7 + j].isSameDay,
                       'disabled': days[i * 7 + j].isDisabled, 
                       'current': days[i * 7 + j].isSameMonth}" 
              @click="getSeletedDay($event, days[i * 7 + j])">
              {{days[i * 7 + j].text}}
            </td>
          </tr>        
          </tbody>
        </table>      
      </div>      
    </div>
  </div>  
</template>
<style>
.datepicker-container {
  display: inline-block;
  position: relative;
}
.datepicker-container a{
  color: #666;
  text-decoration: none;
}
.datepicker-container a:hover{
  color: #666;
  text-decoration: none;
}
.datepicker-container [disabled] {
  cursor: not-allowed;
  opacity: 1;  
}
.datepicker-panel {
  position: absolute;
  top: 100%; 
  left: 0; 
  margin-top: 2px;
  width: 200px;
  border: 1px solid #ccc;
  padding: 5px;
  color: #666;
  box-shadow: 1px 0px 6px rgba(0,0,0,0.2);
}
.calendar-header{
  padding:5px 0;
  line-height: 1.5;
  text-align: center;
}
.calendar-header .title{
  font-weight: bold;
}
.calendar-header .prev{
  float: left; 
}
.calendar-header .next{
  float: right;
}
.calendar-header .next,
.calendar-header .prev{
  padding-left: 5px;
  padding-right: 5px;  
}
.calendar-header .next:hover,
.calendar-header .prev:hover{
  background: #eaf8fe;
}
.calendar-body table {
  border-collapse: collapse;
  max-width: 100%;
  background-color: transparent;
  width: 100%
}  
.calendar-body th, .calendar-body td {
  text-align: center;
}
.calendar-body td {
  color: #999;
  cursor: pointer;
  border-radius: 5px;
  line-height: 1.5;  
}
.calendar-body td.current{
  color: #333;
}
.calendar-body td:hover{
  background: #eaf8fe;
  cursor: pointer;  
}
.calendar-body td.active{
  background: #2db7f5;
  color: #fff;
  border: 1px solid transparent;
}
.calendar-body td.disabled{
  cursor: not-allowed;
  color: #bcbcbc;
  background: #f3f3f3;
}  
</style>
<script>
var isSameDay = function(a, b) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}
var isSameMonth = function(a, b) {
  return a.getMonth() === currentMonth;
}
var getOffsetDay = function(today, num) {
  return new Date(today.valueOf() + num * 86400000);
}
var zeroPadding = function(num) {
  var num = Number(num);
  return num < 10 ? '0' + num : num;
}
var getFormatDate = function(day, format) {
  var tmp = {};
  tmp.YYYY = day.getFullYear().toString();
  tmp.MM = zeroPadding((day.getMonth() + 1));
  tmp.DD = zeroPadding(day.getDate());
  return format.replace(/([^-]+)/g, function(match) {
    return tmp[match];
  });
}
module.exports = {
  props: {
    value: {
      type: String,
      required: false
    },
    show: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    disabledDate: {
      type: Function,
      required: false
    }
  },
  data: function() {
    return {
      currentDay: null,
      currentYear: null,
      currentMonth: null,
      currentDate: null,
      formater: 'YYYY-MM-DD',
      weeks: ['日', '一', '二', '三', '四', '五', '六']
    }
  },
  created: function() {
    if (this.value) {
      this.currentDay = new Date(this.value);
    } else {
      this.currentDay = new Date();
    };
    this.currentYear = this.currentDay.getFullYear();
    this.currentMonth = this.currentDay.getMonth();
    this.currentDate = this.currentDay.getDate();
  },
  computed: {
    days: function() {
      var days = [];
      var firstDay = new Date(this.currentYear, this.currentMonth, 1);
      var startDay = getOffsetDay(firstDay, -1 * firstDay.getDay());
      for (var i = 0; i < 42; i++) {
        var day = getOffsetDay(startDay, i);
        days.push({
          day: day,
          text: day.getDate(),
          isDisabled: this.disabledDate(day),
          isSameDay: isSameDay(day, this.currentDay),
          isSameMonth: day.getMonth() === this.currentMonth
        });
      }
      return days;
    }
  },
  methods: {
    prevMonth: function(e) {
      if (this.currentMonth === 1) {
        this.currentMonth = 12;
        this.prevYear();
      } else {
        this.currentMonth -= 1;
      }
      e.stopPropagation();
    },
    nextMonth: function(e) {
      if (this.currentMonth === 12) {
        this.currentMonth = 1;
        this.nextYear();
      } else {
        this.currentMonth += 1;
      }
      e.stopPropagation();
    },
    prevYear: function(e) {
      e.stopPropagation();
      this.currentYear -= 1;
    },
    nextYear: function(e) {
      e.stopPropagation();
      this.currentYear += 1;
    },
    getSeletedDay: function(e, data) {
      if (data.isDisabled) {
        e.stopPropagation();
        return;
      }
      this.value = getFormatDate(data.day, this.formater);
      this.$dispatch('change', data.day)
    },
    inputFocus: function() {
      if (this.disabled) return;
      this.show = true;
      this.bindClose();
    },
    bindClose: function() {
      var self = this;
      var bindHide = function(e) {
        e.stopPropagation();
        self.show = false;
        document.removeEventListener('click', bindHide, false);
      };
      setTimeout(function() {
        document.addEventListener('click', bindHide, false);
      }, 500)
    }
  }
}
</script>
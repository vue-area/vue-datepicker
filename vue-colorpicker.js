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

Vue.component('date-picker', {
  template: '#datepicker',
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
});

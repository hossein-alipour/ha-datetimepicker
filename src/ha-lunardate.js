 /*HA-LunarDate v1.0 � 2016 by Hossein Alipour http://hosseinalipour.ir*/

 function HaLunarDate(year, month, day, hour, minute, second) {
     if ((year instanceof String || typeof year === 'string') && year.indexOf("/") > -1) {
         var datetime = year.split(" ");
         var date, time, ampm;
         for (var d = 0; d < datetime.length; d++) {
             if (datetime[d].indexOf("/") > -1)
                 date = datetime[d];
             else if (datetime[d].indexOf(":") > -1)
                 time = datetime[d];
             else if (datetime[d].toLowerCase().indexOf("am") > -1 || datetime[d].toLowerCase().indexOf("pm") > -1)
                 ampm = datetime[d];
         }

         if (date != null) {
             var dateValues = date.split("/");
             this.month = dateValues[0];
             this.day = dateValues[1];
             this.year = dateValues[2];
         }

         if (time != null) {
             var timeValues = date.split(":");
             this.hour = values[0];
             this.minute = values[1];
             if (ampm != null) {
                 if (ampm.toLowerCase() == "pm")
                     this.hour += 12;
             }
         } else {
             this.hour = 0;
             this.minute = 0;
         }
     } else if (year instanceof HaLunarDate) {
         this.year = year.getFullYear();
         this.month = year.getMonth();
         this.day = year.getDate();
         this.hour = year.getHours();
         this.minute = year.getMinutes();
         this.second = year.getSeconds();

     } else if (year instanceof Date) {
         var d = this.convertFromGregorian(year);
         this.year = d.getFullYear();
         this.month = d.getMonth();
         this.day = d.getDate();
         this.hour = d.getHours();
         this.minute = d.getMinutes();
         this.second = d.getSeconds();
     } else {
         if (year == null && month == null && day == null) {
             var d = new Date();
             var sd = this.convertFromGregorian(d);
             this.year = sd.getFullYear();
             this.month = sd.getMonth();
             this.day = sd.getDate();
         } else {
             this.year = year;
             this.month = month;
             this.day = day;
         }

         this.hour = hour || 0;
         this.minute = minute || 0;
         this.second = second || 0;
     }

     this.year = Number(this.year);
     this.month = Number(this.month);
     this.day = Number(this.day);

     this.hour = Number(this.hour);
     this.minute = Number(this.minute);
 }

 HaLunarDate.prototype.monthNames = [
     "محرم",
     "صفر",
     "ربیع الاول",
     "ربیع الثانی",
     "جمادی الاول",
     "جمادی الثانی",
     "رجب",
     "شعبان",
     "رمضان",
     "شوال",
     "ذیقعده",
     "ذیحجه"
 ];

 HaLunarDate.prototype.dayNames = [
     "السبت",
     "الأحد",
     "الاثنین",
     "الثلاثاء",
     "الأربعاء",
     "الخمیس",
     "الجمعة"
 ];

 HaLunarDate.prototype.tableYearDays = [
     0, 354, 708, 1063, 1417, 1771, 2126, 2480, 2835, 3189,
     3543, 3898, 4252, 4606, 4961, 5315, 5669, 6024, 6378, 6733, 7087,
     7441, 7796, 8150, 8504, 8859, 9213, 9568, 9922, 10276, 10631
 ]
 HaLunarDate.prototype.tableMonthDays = [
     0, 30, 59, 89, 118, 148, 177, 207, 236, 266, 295, 325
 ]

 HaLunarDate.prototype.getFullYear = function() {
     return this.year;
 }

 HaLunarDate.prototype.getMonth = function() {
     return this.month;
 }

 HaLunarDate.prototype.getDate = function() {
     return this.day;
 }

 HaLunarDate.prototype.getHours = function() {
     return this.hour;
 }

 HaLunarDate.prototype.getMinutes = function() {
     return this.minute;
 }

 HaLunarDate.prototype.getSeconds = function() {
     return this.second;
 }

 HaLunarDate.prototype.setHours = function(newHours) {
     this.hour = newHours;
 }

 HaLunarDate.prototype.setMinutes = function(newMinutes) {
     this.minute = newMinutes;
 }

 HaLunarDate.prototype.setSeconds = function(newSeconds) {
     this.second = newSeconds;
 }

 HaLunarDate.prototype.toString = function() {
     return this.dayNames[this.getDay()] + " " + this.getDate() + " " + this.monthNames[this.getMonth()] + " " + this.getFullYear() + " " + this.getHours() + ":" + this.getMinutes();
 }

 HaLunarDate.prototype.getDayOfWeekName = function(day) {
     return this.dayNames[day];
 }

 HaLunarDate.prototype.compare = function(date1, date2) {
     if (date1 == null)
         return 0;
     if (date2 == null) {
         date2 = date1;
         date1 = this;
     }

     if (date1.getFullYear() > date2.getFullYear())
         return -1;
     else {
         if (date1.getFullYear() < date2.getFullYear())
             return 1;
         else {
             if (date1.getMonth() > date2.getMonth())
                 return -1;
             else {
                 if (date1.getMonth() < date2.getMonth())
                     return 1;
                 else {
                     if (date1.getDate() > date2.getDate())
                         return -1;
                     else {
                         if (date1.getDate() < date2.getDate())
                             return 1;
                         else
                             return 0;
                     }
                 }
             }
         }
     }
 }

 HaLunarDate.prototype.getMonthName = function(month) {
     return this.monthNames[month];
 }

 HaLunarDate.prototype.convertToGregorian = function(lunarDate) {
     if (lunarDate == null)
         lunarDate = this;

     var year = Number(lunarDate.getFullYear());
     var day = Math.floor(year / 30);
     day *= 10631;
     day += Number(this.tableYearDays[(year % 30)]);
     day += Number(this.tableMonthDays[lunarDate.getMonth()])
     day += Number(lunarDate.getDate());
     day += 1948085;
     var offset = 2415021;
     day -= offset;
     var g = new Date(0, 0, 1);
     g.setDate(day);
     return g;
 }

 HaLunarDate.prototype.convertFromGregorian = function(gregorianDate) {
     var gDate = new Date(gregorianDate);
     var hour = gDate.getHours();
     var minute = gDate.getMinutes();
     var second = gDate.getSeconds();
     gDate.setHours(0);
     var oneDay = 1000 * 60 * 60 * 24;
     var days = Math.floor(gDate / oneDay);
     var offset = 2440590;
     days += offset;
     days -= 1948085;
     days1 = Math.floor(days / 10631);
     var tempYear = Math.floor(days % 10631);
     var i;
     for (i = 0; i < this.tableYearDays.length; i++)
         if (this.tableYearDays[i] > tempYear) {
             if (i > 0) i--;
             break;
         }
     if (i > 29) i = 29;

     var year = (days1 * 30) + i;

     var tempMonth = tempYear - this.tableYearDays[i];
     var m;
     for (m = 0; m < this.tableMonthDays.length; m++)
         if (this.tableMonthDays[m] > tempMonth) {
             if (m > 0) m--;
             break;
         }

     if (m > 11) m = 11;
     var month = m;
     var day = tempMonth - this.tableMonthDays[m];
     if (day == 0) {
         if (month == 0)
             year--;
         month = month == 0 ? 11 : month - 1;
         day = this.getMonthTotalDays(month);
     }
     var date = new HaLunarDate(year, month, day);
     date.setHours(hour);
     date.setMinutes(minute);
     date.setSeconds(second);
     return date;
 }

 HaLunarDate.prototype.setDate = function(newDate) {
     var date = new HaLunarDate(this.year, this.month, 0).getDayOfYear() + newDate;
     var tempMonth = date;
     var m;
     for (m = 0; m < this.tableMonthDays.length; m++)
         if (this.tableMonthDays[m] > tempMonth) {
             if (m > 0) m--;
             break;
         }

     if (m > 11) m = 11;
     this.month = m;
     this.day = tempMonth - this.tableMonthDays[m];
 }



 HaLunarDate.prototype.getDay = function() {
     return this.getWeekDay(this);
 }

 HaLunarDate.prototype.getWeekDay = function(lunarDate) {
     if (lunarDate == null)
         lunarDate = this;

     var temp = lunarDate.convertToGregorian();

     var dayOfWeek = temp.getDay() + 1;
     if (dayOfWeek == 7)
         dayOfWeek = 0;
     return dayOfWeek;
 }

 //۲، ۵، ۷، ۱۰، ۱۳، ۱۶، ۱۸، ۲۱، ۲۴، ۲۶ و ۲۹
 HaLunarDate.prototype.isLeapYear = function(year) {
     year = year || this.getFullYear();
     if (year % 30 == 2 ||
         year % 30 == 5 ||
         year % 30 == 7 ||
         year % 30 == 10 ||
         year % 30 == 13 ||
         year % 30 == 16 ||
         year % 30 == 18 ||
         year % 30 == 18 ||
         year % 30 == 21 ||
         year % 30 == 24 ||
         year % 30 == 26 ||
         year % 30 == 29)
         return true;
     return false;

     //  var a = 0.025
     //  var b = 266
     //  var leapDays0;
     //  var leapDays1;
     //  if (year > 0) {
     //      leapDays0 = ((year + 38) % 2820) * 0.24219 + a; // # 0.24219 ~ extra days of one year
     //      leapDays1 = ((year + 39) % 2820) * 0.24219 + a; //# 38 days is the difference of epoch to 2820-year cycle
     //  } else if (year < 0) {
     //      leapDays0 = ((year + 39) % 2820) * 0.24219 + a;
     //      leapDays1 = ((year + 40) % 2820) * 0.24219 + a;
     //  } else
     //      return false;

     //  var frac0 = Math.floor((leapDays0 - Math.floor(leapDays0)) * 1000);
     //  var frac1 = Math.floor((leapDays1 - Math.floor(leapDays1)) * 1000);

     //  if (frac0 <= b && frac1 > b)
     //      return true;
     //  else
     //      return false;
 }

 HaLunarDate.prototype.getDayOfYear = function(lunarDate) {
     if (lunarDate == null)
         lunarDate = this;

     return this.tableMonthDays[lunarDate.getMonth()] + lunarDate.getDate();
 }

 HaLunarDate.prototype.getYearTotalDays = function(year) {
     if (year == null)
         year = this.getFullYear();

     if (this.isLeapYear(year))
         return 366;

     return 365;
 }
 HaLunarDate.prototype.getMonthTotalDays = function(monthNumber, year) {
     if (monthNumber < 0) {
         year -= Math.floor(Math.abs(monthNumber / 12)) + 1;
         monthNumber = 11 + (monthNumber % 12);
     } else
     if (monthNumber > 11) {
         year += Math.floor(monthNumber / 12);
         monthNumber = monthNumber % 12;
     }
     if (monthNumber != 11)
         return this.tableMonthDays[monthNumber + 1] - this.tableMonthDays[monthNumber];

     return this.isLeapYear(year) ? 30 : 29;
 }

 Date.isLeapYear = function(year) {
     return new Date(year, 1, 29).getMonth() == 1;
 }
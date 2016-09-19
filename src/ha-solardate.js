 /*HA-SolarDate v1.2 � 2016 by Hossein Alipour http://hosseinalipour.ir*/

 function HaSolarDate(year, month, day, hour, minute, second) {
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
             this.month = Number(dateValues[0]) - 1;
             this.day = dateValues[1];
             this.year = dateValues[2];
         }

         if (time != null) {
             var timeValues = time.split(":");
             this.hour = timeValues[0];
             this.minute = timeValues[1];

             if (ampm != null) {
                 if (ampm.toLowerCase() == "pm")
                     this.hour += 12;
             }
         } else {
             this.hour = 0;
             this.minute = 0;
         }
     } else if (year instanceof HaSolarDate) {
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

 HaSolarDate.prototype.monthNames = [
     "فروردین",
     "اردیبهشت",
     "خرداد",
     "تیر",
     "مرداد",
     "شهریور",
     "مهر",
     "آبان",
     "آذر",
     "دی",
     "بهمن",
     "اسفند"
 ];

 HaSolarDate.prototype.dayNames = [
     "شنبه",
     "یکشنبه",
     "دوشنبه",
     "سشنبه",
     "چهارشنبه",
     "پنجشنبه",
     "جمعه"
 ];

 HaSolarDate.prototype.getFullYear = function() {
     return this.year;
 }

 HaSolarDate.prototype.getMonth = function() {
     return this.month;
 }

 HaSolarDate.prototype.getDate = function() {
     return this.day;
 }

 HaSolarDate.prototype.getHours = function() {
     return this.hour;
 }

 HaSolarDate.prototype.getMinutes = function() {
     return this.minute;
 }

 HaSolarDate.prototype.getSeconds = function() {
     return this.second;
 }

 HaSolarDate.prototype.setHours = function(newHours) {
     this.hour = newHours;
 }

 HaSolarDate.prototype.setMinutes = function(newMinutes) {
     this.minute = newMinutes;
 }

 HaSolarDate.prototype.setSeconds = function(newSeconds) {
     this.second = newSeconds;
 }

 HaSolarDate.prototype.toString = function() {
     return this.dayNames[this.getDay()] + " " + this.getDate() + " " + this.monthNames[this.getMonth()] + " " + this.getFullYear() + " " + this.getHours() + ":" + this.getMinutes();
 }

 HaSolarDate.prototype.getDayOfWeekName = function(day) {
     return this.dayNames[day];
 }

 HaSolarDate.prototype.compare = function(date1, date2) {
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

 HaSolarDate.prototype.getMonthName = function(month) {
     return this.monthNames[month];
 }

 HaSolarDate.prototype.convertToGregorian = function(solarDate) {
     if (solarDate == null)
         solarDate = this;

     var year;
     var dayOfYear = solarDate.getDayOfYear();
     year = solarDate.getFullYear() + 621;

     var gregorianDayOfYear = dayOfYear + 79;
     var yearDate = new Date(year, 0, 0);
     yearDate.setDate(yearDate.getDate() + gregorianDayOfYear);
     return yearDate;
 }

 HaSolarDate.prototype.convertFromGregorian = function(gregorianDate) {
     var gDate = new Date(gregorianDate);
     var hour = gDate.getHours();
     var minute = gDate.getMinutes();
     var second = gDate.getSeconds();
     gDate.setHours(0);
     var start = new Date(gDate.getFullYear(), 0, 0);
     var diff = gDate - start;
     var oneDay = 1000 * 60 * 60 * 24;
     var dayOfYear = Math.round(diff / oneDay);
     var solarDayOfYear = dayOfYear - 79;
     var year = 0;
     if (solarDayOfYear <= 0) {
         solarDayOfYear = this.getYearTotalDays(gDate.getFullYear() - 622) + solarDayOfYear;
         year = -1;
     }
     var date = new HaSolarDate(gDate.getFullYear() - 621 + year, 0, 0);
     date.setDate(solarDayOfYear);
     date.setHours(hour);
     date.setMinutes(minute);
     date.setSeconds(second);
     return date;
 }

 HaSolarDate.prototype.setDate = function(newDate) {
     var date = new HaSolarDate(this.year, this.month, 0).getDayOfYear() + newDate;
     if (date <= 186) {
         this.month = Math.floor(date / 31);
         this.day = (date - (this.month * 31)) % 31;
         if (this.day == 0) {
             this.day = 31;
             this.month--;
         }
     } else {
         date -= 186;
         this.month = 6 + Math.floor(date / 30);
         this.day = (date - ((this.month - 6) * 30)) % 30;
         if (this.day == 0) {
             this.day = 30;
             this.month--;
         }
     }
 }



 HaSolarDate.prototype.getDay = function() {
     return this.getWeekDay(this);
 }

 HaSolarDate.prototype.getWeekDay = function(solarDate) {
     if (solarDate == null)
         solarDate = this;

     var month = solarDate.getMonth() + 1;
     var year = solarDate.getFullYear();
     var day = solarDate.getDate();

     if (Number(day) == "NaN" || Number(month) == "NaN" || Number(year) == "NaN")
         return "Wrong Date!";

     var firstDayOfYear95 = 1;

     var step = year < 1395 ? 1 : -1;
     var i = year;
     var leapCount = 0;
     while (i != 1395) {
         if (this.isLeapYear(i))
             leapCount++;

         i += step;
     }

     if (year > 1395)
         leapCount++;

     var offset = (firstDayOfYear95 + (leapCount * -step)) % 7;
     var firstDayOfYear = (((year - 1395) % 7) + offset) % 7;
     if (firstDayOfYear < 0)
         firstDayOfYear = 7 + firstDayOfYear;
     if (month <= 6) {
         var dayOfWeek = ((((month - 1) * 3) - 1) + day + firstDayOfYear) % 7;
     } else {
         var dayOfWeek = ((((month - 1) * 2) - 2) + day + firstDayOfYear) % 7;
     }

     dayOfWeek = Math.floor(dayOfWeek);
     if (dayOfWeek == 7)
         dayOfWeek = 0;
     return dayOfWeek;
 }

 //6، 22، 17، 13، 9، 5، 1 و 30
 //1, 5, 9, 13, 17, 22, 26, 30
 HaSolarDate.prototype.isLeapYear = function(year) {
     year = year || this.getFullYear();
     if (year % 33 == 26 ||
         year % 33 == 22 ||
         year % 33 == 17 ||
         year % 33 == 13 ||
         year % 33 == 9 ||
         year % 33 == 5 ||
         year % 33 == 1 ||
         year % 33 == 30)
         return true;

     return false;
 }

 HaSolarDate.prototype.getDayOfYear = function(solarDate) {
     if (solarDate == null)
         solarDate = this;

     var day = 0;
     if (solarDate.getMonth() < 6) {
         day = solarDate.getMonth() * 31 + solarDate.getDate();
     } else {
         day = 186 + ((solarDate.getMonth() - 6) * 30) + solarDate.getDate();
     }

     return day;
 }

 HaSolarDate.prototype.getYearTotalDays = function(year) {
     if (year == null)
         year = this.getFullYear();

     if (this.isLeapYear(year))
         return 366;

     return 365;
 }

 HaSolarDate.prototype.getMonthTotalDays = function(monthNumber, year) {
     if (monthNumber < 0) {
         year -= Math.floor(Math.abs(monthNumber / 12)) + 1;
         monthNumber = 11 + (monthNumber % 12);
     } else
     if (monthNumber > 11) {
         year += Math.floor(monthNumber / 12);
         monthNumber = monthNumber % 12;
     }
     if (monthNumber < 6)
         return 31;

     if (monthNumber == 11)
         return this.isLeapYear(year) ? 30 : 29;

     return 30;
 }

 Date.isLeapYear = function(year) {
     return new Date(year, 1, 29).getMonth() == 1;
 }
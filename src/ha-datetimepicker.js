 /*HA-DateTimePicker v1.3 � 2016 by Hossein Alipour http://hosseinalipour.ir*/

 function HaDateTimePicker(selector, options) {
     this.target = selector;
     options = options || {};
     var is24 = options.is24 ? options.is24.toString().toLowerCase() === "true" ? true : false : false;
     var isSolar = options.isSolar ? options.isSolar.toString().toLowerCase() === "true" ? true : false : false;
     var isLunar = options.isLunar ? options.isLunar.toString().toLowerCase() === "true" ? true : false : false;
     this.dpDOM = null;
     this.eventHandler = document.createElement("DIV");
     this.uId = "hadp" + Math.floor((1 + Math.random()) * 0x10000)
         .toString(16)
         .substring(1) + new Date().getSeconds();
     var timePickerOnly = options.timePickerOnly ? options.timePickerOnly.toString().toLowerCase() === "true" ? true : false : false;
     if (typeof options.selectedDate === 'string' || options.selectedDate instanceof String) {
         options.selectedDate = Date.parse(options.selectedDate).toString() !== "NaN" ? options.resultInSolar === "true" ? new HaSolarDate(options.selectedDate) : new Date(options.selectedDate) : null;
     }

     this.options = {
         date: options.date || new Date(),
         is24: is24,
         isSolar: isSolar,
         isLunar: isLunar,
         maxYear: options.maxYear || (isSolar === true ? 1450 : isLunar === true ? 1480 : 2050),
         minYear: options.minYear || (isSolar === true ? 1350 : isLunar === true ? 1380 : 1950),
         pagingDuration: options.pagingDuration || 600,
         selectedDate: options.selectedDate || null,
         extraTargets: options.extraTargets || null,
         extraLunarTargets: options.extraLunarTargets || null,
         extraSolarTargets: options.extraSolarTargets || null,
         minAllowedDate: options.minAllowedDate || null,
         maxAllowedDate: options.maxAllowedDate || null,
         forceSetTime: options.forceSetTime ? options.forceSetTime.toString().toLowerCase() === "true" ? true : false : false,
         resultInSolar: options.resultInSolar ? options.resultInSolar.toString().toLowerCase() === "true" ? true : false : false,
         resultInLunar: options.resultInLunar ? options.resultInLunar.toString().toLowerCase() === "true" ? true : false : false,
         disableTime: options.disableTime ? options.disableTime.toString().toLowerCase() === "true" ? true : false : false,
         disableAnimations: options.disableAnimations ? options.disableAnimations.toString().toLowerCase() === "true" ? true : false : false,
         timePickerOnly: timePickerOnly,
         disableOkButton: options.disableOkButton ? options.disableOkButton.toString().toLowerCase() === "true" ? true : false : false,
         resultFormat: options.is24 ? options.resultFormat || (timePickerOnly ? "{hour}:{minute}" : "{month}/{day}/{year} {t?{hour}:{minute}}") : options.resultFormat || (timePickerOnly ? "{hour}:{minute} {ampm}" : "{month}/{day}/{year} {t?{hour}:{minute} {ampm}}"),
         disabledWeekDays: options.disabledWeekDays || null
     };

     if (this.options.timePickerOnly)
         this.clock = true;
     else
         this.clock = false;

     if (this.options.disabledWeekDays) {
         if (this.options.disabledWeekDays.constructor !== Array || !(this.options.disabledWeekDays instanceof Array) || this)
             this.options.disabledWeekDays = this.options.disabledWeekDays.split(',');

         for (var wd = 0; wd < this.options.disabledWeekDays.length; wd++) {
             this.options.disabledWeekDays[wd] = Number(this.options.disabledWeekDays[wd].toString());
             if (this.options.disabledWeekDays[wd] == 7)
                 this.options.disabledWeekDays.push(0);
         }
     }
     if (typeof HaSolarDate === "undefined") {
         this.options.isSolar = false;
         this.options.resultInSolar = false;
     } else {
         this.solarDate = new HaSolarDate();
     }

     if (typeof HaLunarDate === "undefined") {
         this.options.isLunar = false;
         this.options.resultInLunar = false;
     } else {
         this.lunarDate = new HaLunarDate();
     }

     if (this.options.isSolar)
         window.HaDateSource = HaSolarDate;
     else if (this.options.isLunar)
         window.HaDateSource = HaLunarDate;
     else window.HaDateSource = Date;

     if (this.options.selectedDate != null)
     if (this.options.is24) {
        this.selectedTime = {
            hour: this.options.selectedDate.getHours(),
            minute: this.options.selectedDate.getMinutes(),
            amOrPm: this.options.selectedDate.getHours() >= 12 ? "pm" : "am"
        };
    } else {
        this.selectedTime = {
            hour: this.options.selectedDate.getHours() >= 12 ? this.options.selectedDate.getHours() - 12 : this.options.selectedDate.getHours(),
            minute: this.options.selectedDate.getMinutes(),
            amOrPm: this.options.selectedDate.getHours() >= 12 ? "pm" : "am"
        };
    }
     if (this.options.isLunar === true) {
         this.days = this.lunarDate.dayNames;
         this.monthNames = this.lunarDate.monthNames;
         this.renderedDate = this.lunarDate.convertFromGregorian(this.options.date);
         if (this.options.selectedDate != null)
             this.selectedDate = this.options.resultInLunar === false ? this.lunarDate.convertFromGregorian(this.options.selectedDate) :
             new HaLunarDate(this.options.selectedDate.getFullYear(), this.options.selectedDate.getMonth(), this.options.selectedDate.getDate());
     } else if (this.options.isSolar === true) {
         this.days = this.solarDate.dayNames;
         this.monthNames = this.solarDate.monthNames;
         this.renderedDate = this.solarDate.convertFromGregorian(this.options.date);
         if (this.options.selectedDate != null)
             this.selectedDate = this.options.resultInSolar === false ? this.solarDate.convertFromGregorian(this.options.selectedDate) :
             new HaSolarDate(this.options.selectedDate.getFullYear(), this.options.selectedDate.getMonth(), this.options.selectedDate.getDate());
     } else {
         this.renderedDate = this.options.date;
         if (this.options.selectedDate != null)
             this.selectedDate = this.options.resultInSolar === false ? this.options.selectedDate : this.solarDate.convertToGregorian(new HaSolarDate(this.options.selectedDate.getFullYear(),
                 this.options.selectedDate.getMonth(), this.options.selectedDate.getDate()));

         this.days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
         this.monthNames = ["January", "February", "March", "April", "May", "June",
             "July", "August", "September", "October", "November", "December"
         ];
     }

     if (this.options.maxAllowedDate) {
         this.options.maxAllowedDate = this.options.isSolar ? new HaSolarDate(this.options.maxAllowedDate) : this.options.isLunar ? new HaLunarDate(this.options.maxAllowedDate) : new Date(this.options.maxAllowedDate);
         this.options.maxYear = Math.min(this.options.maxYear, this.options.maxAllowedDate.getFullYear());
         if (this.options.date.compare(this.options.maxAllowedDate, this.renderedDate) > 0)
             this.renderedDate = this.options.maxAllowedDate;
     }

     if (this.options.minAllowedDate) {
         this.options.minAllowedDate = this.options.isSolar ? new HaSolarDate(this.options.minAllowedDate) : this.options.isLunar ? new HaLunarDate(this.options.minAllowedDate) : new Date(this.options.minAllowedDate);
         this.options.minYear = Math.max(this.options.minYear, this.options.minAllowedDate.getFullYear());
         if (this.options.date.compare(this.options.minAllowedDate, this.options.renderedDate) < 0)
             this.renderedDate = this.options.minAllowedDate;
     }

     if (this.options.disableTime === true) {
         this.options.forceSetTime = false;
         this.selectedTime = null;
     }

 }

 HaDateTimePicker.prototype.init = function() {
     if (document.querySelectorAll(".ha-datetimepicker").length > 0) {
         document.body.removeChild(document.querySelector(".ha-datetimepicker"));
     }

     if (this.options.isSolar)
         window.HaDateSource = HaSolarDate;
     else if (this.options.isLunar)
         window.HaDateSource = HaLunarDate;
     else window.HaDateSource = Date;

     function toArabicDigit() {
         return this.replace(/\d+/g, function(digits) {
             var result = "";
             for (var i = 0; i < digits.length; i++) {
                 result += String.fromCharCode(digits.charCodeAt(i) + 1584);
             }
             return result;
         });
     };

     function toPersianDigit() {
         return this.replace(/\d+/g, function(digits) {
             var result = "";
             for (var i = 0; i < digits.length; i++) {
                 result += String.fromCharCode(digits.charCodeAt(i) + 1728);
             }
             return result;
         });
     };

     String.prototype.toLocalDigit = this.options.isSolar ? toPersianDigit : toArabicDigit;

     this.createCalendar();
     this.setupStyles();
     this.createEvents();
     this.renderDate(this.selectedDate || this.renderedDate);
     this.renderClock();
     if (this.selectedTime != null) {
         this.renderHourHand();
         this.renderMinuteHand();
     }
     this.addEvents();
     this.renderResult();
 }

 HaDateTimePicker.prototype.createCalendar = function() {
     var currentYearDisp = this.options.isSolar || this.options.isLunar ? this.renderedDate.getFullYear().toString().toLocalDigit() : this.renderedDate.getFullYear();
     var clock = this.options.timePickerOnly ? "clock timePickerOnly" : "";
     var noAnim = this.options.disableAnimations ? "no-anim" : "";
     if (this.options.disableAnimations)
         this.options.pagingDuration = 0;
     var lang = this.options.isSolar ? "fa" : this.options.isLunar ? "ar" : "en";
     var html = "<div class='ha-datetimepicker " + noAnim + " " + clock + " " + lang + "' id='" + this.uId + "'><div class='ha-dp-dim'></div><div class='ha-datetimepicker-container'>";
     html += "<div class='ha-dp-header'>" +
         "<div class='ha-dp-year'>" +
         "<div class='ha-dp-year-dropdown-container'>" +
         "<button type='button' class='ha-dp-year-btn'>" + currentYearDisp + "</button>" +
         "<ul class='ha-dp-year-dropdown'>";
     for (var y = this.options.minYear; y <= this.options.maxYear; y++) {
         if (y % 10 == 0)
             html += "<hr class='ha-dp-list-separator'/>";
         var yearDisp = this.options.isSolar || this.options.isLunar ? y.toString().toLocalDigit() : y;
         html += "<li class='ha-dp-year-item' data-year='" + y + "'>" + yearDisp + "</li>";
     }
     html += "</ul>" + //end of ul.ha-dp-year-dropdown
         "</div>" + //end of div.ha-dp-year-dropdown-container
         "</div>" + //end of div.ha-dp-year
         "<div class='ha-dp-month'>" +
         "<button type='button' class='ha-dp-prev-btn'><</button>" +
         "<div class='ha-dp-month-dropdown-container'>" +
         "<button type='button' class='ha-dp-month-btn'>" + this.monthNames[this.renderedDate.getMonth()] + "</button>" +
         "<ul class='ha-dp-month-dropdown'>";
     for (var m = 0; m < this.monthNames.length; m++) {
         html += "<li class='ha-dp-month-item'>" + this.monthNames[m] + "</li>";
     }
     html += "</ul>" + //end of ul.ha-dp-month-dropdown
         "</div>" + //end of div.ha-dp-month-dropdown-container
         "<button type='button' class='ha-dp-next-btn'>></button>" +
         "</div>" + //end of dv.ha-dp-month
         "</div>"; // end of header
     html += "<div class='ha-dp-body'>";
     html += "<div>";
     for (var dn = 0; dn < 7; dn++) {
         var d = this.options.isSolar ? this.days[dn][0] : this.days[dn];
         html += "<p class='ha-dp-cell ha-dp-cell-header'>" + d;
     }
     html += "</div>";
     html += "<div class='ha-dp-days-container'></div>";
     html += "</div>"; //end of div.ha-dp-body

     if (this.options.disableTime === false) {
        var type = '';
        if (this.options.is24)
            type = ' ds-none ';
         html += "<div class='ha-dp-clock'>" +
             "<div class='ha-dp-clock-header'>" +
             "<div class='ha-dp-ampm"+type+"'>" +
             "<div type='button' class='ha-dp-clock-am-btn" + (this.selectedTime && this.selectedTime.amOrPm.toLowerCase() == "am" || !this.selectedTime ? " selected" : "") + "'>AM</div>" +
             "<button type='button' class='ha-dp-clock-ampm-btn" + (this.selectedTime && this.selectedTime.amOrPm.toLowerCase() == "pm" ? " pm" : " am") + "'>AMPM</button>" +
             "<div type='button' class='ha-dp-clock-pm-btn" + (this.selectedTime && this.selectedTime.amOrPm.toLowerCase() == "pm" ? " selected" : "") + "'>PM</div>" +
             "</div>" + //end of div.ha-dp-ampm
             "</div>" + //end of div.ha-dp-clock-header
             "<div class='ha-dp-clock-body'>" +
             "<div class='ha-dp-clock-face'>" +
             "<div class='hours-clock-face'>" +
             "</div>" + //end of div.houres-clock-face
             "</div>" + //end of div.ha-dp-clock-face
             "</div>" + //end of div.ha-dp-clock-body
             "<div class='ha-dp-clock-footer'>" +
             "<p class='ha-dp-clock-res'></p>";
         if (!this.options.disableOkButton) {
             html += "<button type='button' class='ha-dp-btn ha-dp-clock-ok-btn'>OK</button>";
         }
         html += "</div>" + //end of div.ha-dp-clock-footer
             "</div>"; //end of div.ha-dp-clock
     }
     html += "<div class='ha-dp-footer'>" +
         "<p class='ha-dp-result'>-</p>";
     if (!this.options.disableOkButton) {
         html += "<div class='ha-dp-buttons'>" +
             "<button type='button' class='ha-dp-btn ha-dp-cancel-btn'>Cancel</button>" +
             "<button type='button' class='ha-dp-btn ha-dp-ok-btn'>OK</button>";
         if (this.options.disableTime === false) {
             html += "<button type='button' class='ha-dp-btn ha-dp-clock-btn'>Clock</button>";
         }
         html += "</div>"; //end of div.ha-dp-buttons
     }
     html += "</div>"; //end of div.ha-dp-footer
     html += "</div></div>"; //end of div.ha-datetimepicker

     var dom = createFragment(html);
     this.dpDOM = dom;
     document.body.insertBefore(dom, document.body.childNodes[document.body.childNodes.length - 1]);

 }

 HaDateTimePicker.prototype.setupStyles = function() {
     var c = document.querySelector(".ha-dp-days-container");
     c.setAttribute("style", "animation-duration:" + this.options.pagingDuration + "ms");

     if (this.options.isSolar || this.options.isLunar) {
         var dp = document.querySelector(".ha-dp-body");
         dp.style.direction = "rtl";
     }
 }

 HaDateTimePicker.prototype.renderDate = function(date) {
     this.renderedDate = new HaDateSource(date);
     this.renderedDate.setDate(1);

     var weeks = [{
         daysOfWeek: []
     }];

     var dp = document.querySelector(".ha-datetimepicker");
     for (var c = 0; c < dp.classList.length; c++) {
         if (dp.classList[c].indexOf("month") >= 0)
             dp.classList.remove(dp.classList[c]);
     }
     dp.className += " month" + date.getMonth();

     var currentDate;
     var tempDate;

     tempDate = new HaDateSource(date.getFullYear(), date.getMonth(), 1);
     currentDate = new HaDateSource();
     var c = -tempDate.getDay() + 1;

     for (var w = 1; w <= 6; w++) {
         var daysOfWeek = new Array();
         for (var d = 1; d <= 7; d++) {
             daysOfWeek.push(c++);
         }
         weeks.push({
             daysOfWeek: daysOfWeek
         });
     }

     var yearBtn = document.querySelector(".ha-dp-year-btn");
     yearBtn.innerHTML = this.options.isSolar || this.options.isLunar ? date.getFullYear().toString().toLocalDigit() : date.getFullYear();
     var yearItems = document.getElementsByClassName("ha-dp-year-item");

     for (var yi = 0; yi < yearItems.length; yi++) {
         if (yearItems[yi].classList.contains("selected"))
             yearItems[yi].classList.remove("selected");
     }
     var selectedYear = document.querySelector(".ha-dp-year-item[data-year='" + date.getFullYear() + "']");
     if (selectedYear != null)
         selectedYear.className += " selected"

     var monthBtn = document.querySelector(".ha-dp-month-btn");
     monthBtn.innerHTML = this.monthNames[date.getMonth()];

     var daysContainer = document.querySelector(".ha-dp-days-container");
     var tempHaDateSource = new HaDateSource();
     var monthLastDay = tempHaDateSource.getMonthTotalDays(date.getMonth(), date.getFullYear());
     var previousMonthLastDay = tempHaDateSource.getMonthTotalDays(date.getMonth() - 1, date.getFullYear());
     delete tempHaDateSource;
     var html = "";

     for (var x = 0; x < weeks.length; x++) {
         var h = "<div>";
         for (var l = 0; l < weeks[x].daysOfWeek.length; l++) {
             var dayOfMonth = weeks[x].daysOfWeek[l];
             if (dayOfMonth <= monthLastDay && dayOfMonth > 0) {
                 var selected = (this.selectedDate != null &&
                     this.selectedDate.getFullYear() == date.getFullYear() &&
                     this.selectedDate.getMonth() == date.getMonth() &&
                     this.selectedDate.getDate() == dayOfMonth) ? " ha-dp-cell-selected" : "";

                 var muted = "";
                 if (this.options.minAllowedDate != null)
                     muted = this.options.date.compare(new Date(date.getFullYear(), date.getMonth(), dayOfMonth), this.options.minAllowedDate) > 0 ? " ha-dp-cell-muted" : muted;
                 if (this.options.maxAllowedDate != null)
                     muted = this.options.date.compare(new Date(date.getFullYear(), date.getMonth(), dayOfMonth), this.options.maxAllowedDate) < 0 ? " ha-dp-cell-muted" : muted;
                 if (this.options.disabledWeekDays != null) {
                     var weekDay = this.options.isSolar || this.options.isLunar ? l : l + 1;

                     if (this.options.disabledWeekDays.indexOf(weekDay) >= 0)
                         muted = " ha-dp-cell-muted";
                 }

                 var cd = currentDate.getFullYear() == date.getFullYear() && currentDate.getMonth() == date.getMonth() && currentDate.getDate() == dayOfMonth ? " ha-dp-cell-currentdate" : "";
                 var holiday;
                 if (this.options.isSolar || this.options.isLunar)
                     holiday = l == 6 ? " ha-dp-cell-holiday" : "";
                 else
                     holiday = l == 5 ? " ha-dp-cell-holiday" : "";

                 var disp = this.options.isSolar == true || this.options.isLunar ? dayOfMonth.toString().toLocalDigit() : dayOfMonth;
                 h += "<p class='ha-dp-cell" + holiday + cd + selected + muted + "' data-date='" + dayOfMonth + "' data-disp='" + disp + "'>" + disp + "</p>";
             } else
             if (dayOfMonth < 1) {
                 var disp = this.options.isSolar == true || this.options.isLunar ? (previousMonthLastDay + dayOfMonth).toString().toLocalDigit() : (previousMonthLastDay + dayOfMonth);
                 h += "<p class='ha-dp-cell ha-dp-cell-muted' data-date='" + (previousMonthLastDay + dayOfMonth) + "'>" + disp + "</p>";
             } else {
                 var disp = this.options.isSolar == true || this.options.isLunar ? (dayOfMonth - monthLastDay).toString().toLocalDigit() : (dayOfMonth - monthLastDay);
                 h += "<p class='ha-dp-cell ha-dp-cell-muted' data-date='" + (dayOfMonth - monthLastDay) + "'>" + disp + "</p>";
             }

         }
         h += "</div>"
         html += h;
     }

     daysContainer.innerHTML = html;
     this.addEvents();
     this.events.pageChanged.detail.isClock = self.clock;
     this.eventHandler.dispatchEvent(this.events.pageChanged);
 }

 HaDateTimePicker.prototype.changeDate = function(date) {
     var c = document.querySelector(".ha-dp-days-container");
     var delay = this.options.pagingDuration;
     c.className = c.className.replace("page-left", "").replace("page-right", "").trim();
     if (this.options.date.compare(date, this.renderedDate) == -1)
         c.className += " page-left";
     else
         c.className += " page-right";

     var self = this;
     setTimeout(function() {
         self.renderDate(new HaDateSource(date.getFullYear(), date.getMonth(), date.getDate()));
     }, delay / 2);

     setTimeout(function() {
         c.className = c.className.replace("page-left", "").replace("page-right", "").trim();
     }, delay);
 }

 HaDateTimePicker.prototype.createEvents = function() {
     (function() {
         function CustomEvent(event, params) {
             params = params || { bubbles: false, cancelable: false, detail: undefined };
             var evt = document.createEvent('CustomEvent');
             evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
             return evt;
         };

         CustomEvent.prototype = window.Event.prototype;
         window.CustomEvent = CustomEvent;
     })();

     this.events = {
         selectedDateChanged: new CustomEvent("selectedDateChanged", {
             "detail": {
                 selectedDate: this.getResult()
             }
         }),
         selectedTimeChanged: new CustomEvent("selectedTimeChanged", {
             "detail": {
                 selectedTime: this.selectedTime
             }
         }),
         pageChanged: new CustomEvent("pageChanged", {
             "detail": {
                 date: this.renderedDate
             }
         }),
         clockToggled: new CustomEvent("clockToggled", {
             "detail": {
                 isClock: this.clock
             }
         }),
         pickerShow: new CustomEvent("pickerShow"),
         pickerHide: new CustomEvent("pickerHide")
     }
 }

 HaDateTimePicker.prototype.addEventListener = function(eventName, func) {
     this.eventHandler.addEventListener(eventName, func);
 }

 HaDateTimePicker.prototype.addEvents = function() {
     var c = document.querySelector(".ha-dp-days-container");
     var currentDate = new Date();
     var self = this;
     var cells = document.querySelectorAll("#" + this.uId + " .ha-dp-cell:not(.ha-dp-cell-muted):not(.ha-dp-cell-header)");
     for (var i = 0; i < cells.length; i++) {
         cells[i].onclick = function() {
             for (var c = 0; c < cells.length; c++) {
                 cells[c].className = cells[c].className.replace("ha-dp-cell-selected", "").trim();
             }
             this.className += " ha-dp-cell-selected";
             self.selectedDate = new HaDateSource(self.renderedDate.getFullYear(), self.renderedDate.getMonth(), parseInt(this.getAttribute("data-date")));
             self.events.selectedDateChanged.detail.selectedDate = self.selectedDate;
             self.eventHandler.dispatchEvent(self.events.selectedDateChanged);

             self.renderResult();
             if (self.options.disableOkButton) {
                 self.toggleClock();
                 self.returnResults();
             }
         }
     }

     var dim = document.querySelector(".ha-dp-dim");
     dim.onclick = function() {
         self.hide();
     }

     var next = document.querySelector(".ha-dp-next-btn");
     var previous = document.querySelector(".ha-dp-prev-btn");
     next.onclick = function() {
         var year = self.renderedDate.getFullYear();

         var month = self.renderedDate.getMonth() + 1;
         if (month >= 12) {
             year++;
             month = 0;
         }
         var nextDate = new HaDateSource(year, month, currentDate.getDate());

         self.changeDate(nextDate);
     }
     previous.onclick = function() {
         var year = self.renderedDate.getFullYear();
         var month = self.renderedDate.getMonth() - 1;

         if (month < 0) {
             year--;
             month = 11;
         }
         self.changeDate(new HaDateSource(year, month, currentDate.getDate()));
     }
     var monthBtn = document.querySelector(".ha-dp-month-btn");
     var yearBtn = document.querySelector(".ha-dp-year-btn");
     var monthDropdown = document.querySelector(".ha-dp-month-dropdown");
     var yearDropdown = document.querySelector(".ha-dp-year-dropdown");
     document.querySelector("body").addEventListener("click", function() {
         if (monthDropdown.className.indexOf("show") > -1)
             monthDropdown.className = monthDropdown.className.replace("show", "").trim();
         if (yearDropdown.className.indexOf("show") > -1)
             yearDropdown.className = yearDropdown.className.replace("show", "").trim();
     });
     monthBtn.onclick = function(e) {
         e.stopPropagation();
         if (yearDropdown.className.indexOf("show") > -1)
             yearDropdown.className = yearDropdown.className.replace("show", "").trim();
         if (monthDropdown.className.indexOf("show") > -1)
             monthDropdown.className = monthDropdown.className.replace("show", "").trim();
         else
             monthDropdown.className += " show";
     }

     yearBtn.onclick = function(e) {
         e.stopPropagation();
         if (monthDropdown.className.indexOf("show") > -1)
             monthDropdown.className = monthDropdown.className.replace("show", "").trim();
         if (yearDropdown.className.indexOf("show") > -1)
             yearDropdown.className = yearDropdown.className.replace("show", "").trim();
         else
             yearDropdown.className += " show";

         var selectedYear = document.querySelector(".ha-dp-year-item.selected");
         if (selectedYear != null) {
             var scrollYear = Math.max(selectedYear.getAttribute("data-year") - 5, document.querySelector(".ha-dp-year-item").getAttribute("data-year"));
             selectedYear = document.querySelector(".ha-dp-year-item[data-year='" + scrollYear + "']");
             selectedYear.scrollIntoView();
         }
     }

     var monthNameBtns = document.querySelectorAll(".ha-dp-month-item");
     for (var b = 0; b < monthNameBtns.length; b++) {
         monthNameBtns[b].index = b;
         monthNameBtns[b].onclick = function() {
             if (this.index == self.renderedDate.getMonth())
                 return;
             var month = this.index;
             self.changeDate(new Date(self.renderedDate.getFullYear(), month, currentDate.getDate()));
         }
     }

     var yearBtns = document.querySelectorAll(".ha-dp-year-item");
     for (var yb = 0; yb < yearBtns.length; yb++) {
         yearBtns[yb].onclick = function() {
             var year = this.getAttribute("data-year");
             if (year == self.renderedDate.getFullYear())
                 return;
             self.changeDate(new Date(year, self.renderedDate.getMonth(), currentDate.getDate()));
         }
     }

     if (!this.options.disableOkButton) {
         var okBtn = document.querySelector(".ha-dp-ok-btn");
         okBtn.onclick = function() {
             if (self.returnResults() != null) {
                 self.hide();
             }
         }
         var cancelBtn = document.querySelector(".ha-dp-cancel-btn");
         cancelBtn.onclick = function() {
             self.hide();
         }
     }

     if (this.options.disableTime === false) {
         if (!this.options.disableOkButton) {
             var clockBtn = document.querySelector(".ha-dp-clock-btn");
             clockBtn.onclick = function() {
                 self.toggleClock();
             }
         }
         var amBtn = document.querySelector(".ha-dp-clock-am-btn");
         var pmBtn = document.querySelector(".ha-dp-clock-pm-btn");
         amBtn.onclick = function() {
             self.changeAmPm("am");
         }

         pmBtn.onclick = function() {
             self.changeAmPm("pm");
         }

         var ampmBtn = document.querySelector(".ha-dp-clock-ampm-btn");
         ampmBtn.onclick = function() {
             self.changeAmPm();
         }

         if (!this.options.disableOkButton) {
             var clockOkBtn = document.querySelector(".ha-dp-clock-ok-btn");
             clockOkBtn.onclick = function() {

                 if (self.options.timePickerOnly) {
                     if (self.returnResults())
                         self.hide();
                 } else
                     self.toggleClock();
             }
         }

         var isInsideHours = false;
         var hoursClockFace = document.querySelector(".hours-clock-face");
         hoursClockFace.addEventListener("mouseenter", function() {
             isInsideHours = true;
         });
         hoursClockFace.addEventListener("mouseleave", function() {
             isInsideHours = false;
         });
         hoursClockFace.onwheel = function(e) {
             e.preventDefault();
             e.stopPropagation();
             if (self.selectedTime == null)
                 return;
             var h = Number(self.selectedTime.hour);
             if (e.wheelDelta < 0 || e.detail > 0) {
                 self.setTime({
                     hour: h - 1
                 });
             } else {
                 self.setTime({
                     hour: h + 1
                 });
             }
         };
         var minutesClockFace = document.querySelector(".ha-dp-clock-face");
         minutesClockFace.onwheel = function(e) {
             e.preventDefault();
             e.stopPropagation();
             if (self.selectedTime == null || isInsideHours)
                 return;
             var m = Number(self.selectedTime.minute)
             if (e.wheelDelta < 0 || e.detail > 0) {
                 self.setTime({
                     minute: m - 1
                 });
             } else {
                 self.setTime({
                     minute: m + 1
                 });
             }
         };

         var hourBtns = document.querySelectorAll(".ha-dp-clock-num.ha-dp-hour-num .num");
         for (var h = 0; h < hourBtns.length; h++) {
             hourBtns[h].onclick = function() {
                 var n = this.getAttribute("data-hour");
                 self.setTime({
                     hour: n
                 });
             }
         }

         var minuteBtns = document.querySelectorAll(".ha-dp-clock-num.ha-dp-minute-num .num");
         for (var h = 0; h < minuteBtns.length; h++) {
             minuteBtns[h].onclick = function() {
                 var n = this.getAttribute("data-minute");
                 self.setTime({
                     minute: n
                 });
             }
         }
     }
 }
 HaDateTimePicker.prototype.setTime = function(newTime) {
     if (!this.selectedTime)
         this.selectedTime = {
             hour: 0,
             minute: 0,
             amOrPm: "AM"
         };

         if (this.options.is24) {
            if (newTime.hour > 23)
                newTime.hour = 0;
            if (newTime.hour < 0)
                newTime.hour = 23;
        } else {
            if (newTime.hour > 11)
                newTime.hour = 0;
            if (newTime.hour < 0)
                newTime.hour = 11;
        }

     if (newTime.minute > 59)
         newTime.minute = 0;
     if (newTime.minute < 0)
         newTime.minute = 59;

     this.selectedTime.hour = newTime.hour != null ? newTime.hour : this.selectedTime.hour;
     this.selectedTime.minute = newTime.minute != null ? newTime.minute : this.selectedTime.minute;
     this.selectedTime.amOrPm = newTime.amOrPm != null ? newTime.amOrPm : this.selectedTime.amOrPm;
     this.renderMinuteHand();
     this.renderHourHand();

     this.events.selectedTimeChanged.detail.selectedTime = this.selectedTime;
     this.eventHandler.dispatchEvent(this.events.selectedTimeChanged);
 }
 HaDateTimePicker.prototype.toggleClock = function() {
     if (this.options.disableTime === true)
         return;
     var dp = document.querySelector(".ha-datetimepicker");
     if (!this.clock)
         dp.className += " clock";
     else
         dp.className = dp.className.replace("clock", "").trim();
     this.clock = !this.clock;
     this.events.clockToggled.detail.isClock = this.clock;
     this.eventHandler.dispatchEvent(this.events.clockToggled);
     this.renderResult();
 }
 HaDateTimePicker.prototype.renderResult = function() {
     var r = document.querySelector(".ha-dp-result");
     var res = "";
     if (this.selectedDate != null)
         res = this.options.isSolar || this.options.isLunar ? this.selectedDate.getFullYear() + "/" + (this.selectedDate.getMonth() + 1) + "/" + this.selectedDate.getDate() :
         (this.selectedDate.getMonth() + 1) + "/" + this.selectedDate.getDate() + "/" + this.selectedDate.getFullYear();
     if (this.selectedTime != null)
     if (this.options.is24) {
        res += "   " + twoDigits(this.getHours()) + ":" + twoDigits(this.getMinutes());
    } else {
        res += "   " + twoDigits(this.getHours()) + ":" + twoDigits(this.getMinutes()) + " " + this.getAmOrPm().toUpperCase();
    }
     r.innerHTML = res == "" ? "-" : this.options.isSolar || this.options.isLunar ? res.toLocalDigit() : res;
 }

 HaDateTimePicker.prototype.renderHourHand = function() {
     if (this.options.disableTime === true)
         return;
     var n = this.selectedTime.hour;

     var hoursClockFace = document.querySelector(".hours-clock-face");
     var lastHand = document.querySelector(".ha-dp-clock-hour-hand");
     var last = document.querySelectorAll(".ha-dp-clock-num.ha-dp-hour-num .num.selected");
     for (var l = 0; l < last.length; l++) {
         last[l].classList.remove("selected");
     }

     document.querySelector(".ha-datetimepicker [data-hour='" + this.selectedTime.hour + "']").className += " selected";
     var hand;
     if (lastHand != null)
         hand = lastHand;
     else
         hand = document.createElement("div");
     hand.className = "ha-dp-clock-hour-hand";
     if (this.options.is24) {
        var rot = 180 + (n * 15)
    } else {
        var rot = 180 + (n * 30) + (this.selectedTime.minute * .5);
    }

     hand.setAttribute("style", "-webkit-transform: rotateZ(" + rot + "deg);-moz-transform: rotateZ(" + rot + "deg);transform: rotateZ(" + rot + "deg);");
     if (lastHand == null)
         hoursClockFace.appendChild(hand);

     this.renderClockResult();
 }

 HaDateTimePicker.prototype.renderMinuteHand = function() {
     if (this.options.disableTime === true)
         return;
     var n = this.selectedTime.minute;
     var last = document.querySelectorAll(".ha-dp-clock-num.ha-dp-minute-num .num.selected");
     for (var l = 0; l < last.length; l++) {
         last[l].classList.remove("selected");
     }
     document.querySelector(".ha-datetimepicker [data-minute='" + this.selectedTime.minute + "']").className += " selected";

     var minutesClockFace = document.querySelector(".ha-dp-clock-face");
     var lastHand = document.querySelector(".ha-dp-clock-minute-hand");
     var hand;
     if (lastHand != null)
         hand = lastHand;
     else
         hand = document.createElement("div");
     hand.className = "ha-dp-clock-minute-hand";
     var rot = 180 + (n * 6);
     hand.setAttribute("style", "-webkit-transform: rotateZ(" + rot + "deg);-moz-transform: rotateZ(" + rot + "deg);transform: rotateZ(" + rot + "deg);");
     if (lastHand == null)
         minutesClockFace.appendChild(hand);

     this.renderClockResult();
 }

 HaDateTimePicker.prototype.renderClockResult = function() {
     if (this.options.disableTime === true)
         return;
     var resHolder = document.querySelector(".ha-dp-clock-res");
     if (this.options.is24) {
        resHolder.innerHTML = twoDigits(this.getHours()) + ":" + twoDigits(this.getMinutes());
    } else {
        resHolder.innerHTML = twoDigits(this.getHours()) + ":" + twoDigits(this.getMinutes()) + " " + this.getAmOrPm().toUpperCase();
    }

     if (this.options.disableOkButton) {
         this.returnResults();
     }
 }

 HaDateTimePicker.prototype.changeAmPm = function(amPm) {
     if (this.options.disableTime === true)
         return;
     if (this.selectedTime == null)
         return;
     var ampmBtn = document.querySelector(".ha-dp-clock-ampm-btn");
     var amBtn = document.querySelector(".ha-dp-clock-am-btn");
     var pmBtn = document.querySelector(".ha-dp-clock-pm-btn");
     if (amPm == null || (amPm.toLowerCase() != "am" && amPm.toLowerCase() != "pm"))
         amPm = this.selectedTime == null ? "am" : this.selectedTime.amOrPm.toLowerCase() === "am" ? "pm" : "am";
     this.selectedTime.amOrPm = amPm;
     if (amPm.toLowerCase() == "am") {
         pmBtn.classList.remove("selected");
         amBtn.classList.add("selected");
     } else {
         amBtn.classList.remove("selected");
         pmBtn.classList.add("selected");
     }
     ampmBtn.classList.remove("am");
     ampmBtn.classList.remove("pm");
     ampmBtn.classList.add(amPm);
     this.renderClockResult();
     this.events.selectedTimeChanged.detail.selectedTime = this.selectedTime;
     this.eventHandler.dispatchEvent(this.events.selectedTimeChanged);
 }

 HaDateTimePicker.prototype.getHours = function() {
     var hour = this.selectedTime.hour;
     if (this.options.is24) {
        if (this.selectedTime.hour == 24)
            hour = 0;
    } else {
        if (this.selectedTime.amOrPm.toLowerCase() == "pm" && hour == 0)
            hour = 12;
    }

     return hour;
 }

 HaDateTimePicker.prototype.getMinutes = function() {
     return this.selectedTime.minute;
 }

 HaDateTimePicker.prototype.getAmOrPm = function() {
     return this.selectedTime.amOrPm;
 }

 HaDateTimePicker.prototype.renderClock = function() {
     if (this.options.disableTime === true)
         return;
     var clockFace = document.querySelector(".ha-dp-clock-face");
     var hoursClockFace = document.querySelector(".hours-clock-face");
     if (this.options.is24) {
        for (var n = 0; n < 24; n++) {
            var numContainer = document.createElement("div");
            numContainer.className = "ha-dp-clock-num ha-dp-hour-num";
            var num = document.createElement("span");
            num.setAttribute("data-hour", n)
            num.className = "num";
            num.innerHTML = n == 0 ? 0 : n;
            numContainer.appendChild(num);
            var rot = 180 + (n * 15);
            numContainer.setAttribute("style", "-webkit-transform: rotateZ(" + rot + "deg);-moz-transform: rotateZ(" + rot + "deg);transform: rotateZ(" + rot + "deg);")
            num.setAttribute("style", "-webkit-transform: rotateZ(" + -rot + "deg);-moz-transform: rotateZ(" + -rot + "deg);transform: rotateZ(" + -rot + "deg);")
            clockFace.appendChild(numContainer);
        }
    } else {
        for (var n = 0; n < 12; n++) {
            var numContainer = document.createElement("div");
            numContainer.className = "ha-dp-clock-num ha-dp-hour-num";
            var num = document.createElement("span");
            num.setAttribute("data-hour", n)
            num.className = "num";
            num.innerHTML = n == 0 ? 12 : n;
            numContainer.appendChild(num);

            var rot = 180 + (n * 30);
            numContainer.setAttribute("style", "-webkit-transform: rotateZ(" + rot + "deg);-moz-transform: rotateZ(" + rot + "deg);transform: rotateZ(" + rot + "deg);")
            num.setAttribute("style", "-webkit-transform: rotateZ(" + -rot + "deg);-moz-transform: rotateZ(" + -rot + "deg);transform: rotateZ(" + -rot + "deg);")
            hoursClockFace.appendChild(numContainer);
        }
    }
     for (var m = 0; m < 60; m++) {
         var numContainer = document.createElement("div");
         numContainer.className = "ha-dp-clock-num ha-dp-minute-num";
         var num = document.createElement("span");
         num.setAttribute("data-minute", m)
         num.className = "num";
         num.innerHTML = m % 5 == 0 ? m == 0 || m == 5 ? "0" + m : m : "•";
         num.className += m % 5 != 0 ? " dot" : "";
         numContainer.appendChild(num);

         var rot = 180 + (m * 6);
         numContainer.setAttribute("style", "-webkit-transform: rotateZ(" + rot + "deg);-moz-transform: rotateZ(" + rot + "deg);transform: rotateZ(" + rot + "deg);")
         num.setAttribute("style", "-webkit-transform: rotateZ(" + -rot + "deg);-moz-transform: rotateZ(" + -rot + "deg);transform: rotateZ(" + -rot + "deg);")
         if (this.options.is24) {
            hoursClockFace.appendChild(numContainer);
        } else {
            clockFace.appendChild(numContainer);
        }
     }
 }

 HaDateTimePicker.prototype.returnResults = function() {
     if (!this.options.timePickerOnly && this.selectedDate == null || this.options.timePickerOnly && this.selectedTime == null)
         return null;


     if (this.options.forceSetTime && !this.selectedTime) {
         this.toggleClock();
         return null;
     }


     var targets = this.target.nodeType ? [this.target] : document.querySelectorAll(this.target);

     var formattedResult = this.getFormatedResult();

     for (var t = 0; t < targets.length; t++) {
         var target = targets[t];
         if (target.tagName.toLowerCase() == "input") {
             target.value = formattedResult;
         } else {
             target.innerHTML = formattedResult;
         }
     }


     if (this.options.extraTargets) {
         var exTargets = document.querySelectorAll(this.options.extraTargets);
         var res = this.getResult("gregorian");
         var resString = this.getExtraTargetsResultString(res);
         for (var et = 0; et < exTargets.length; et++) {
             if (exTargets[et].tagName.toLowerCase() == "input") {
                 exTargets[et].value = resString;
             } else {
                 exTargets[et].innerHTML = resString;
             }
         }
     }

     if (this.options.extraLunarTargets) {
         var exLunarTargets = document.querySelectorAll(this.options.extraLunarTargets);
         var resL = this.getResult("lunar");
         var resStringL = this.getExtraTargetsResultString(resL);
         for (var elt = 0; elt < exLunarTargets.length; elt++) {
             if (exLunarTargets[elt].tagName.toLowerCase() == "input") {
                 exLunarTargets[elt].value = resStringL;
             } else {
                 exLunarTargets[elt].innerHTML = resStringL;
             }
         }
     }

     if (this.options.extraSolarTargets) {
         var exSolarTargets = document.querySelectorAll(this.options.extraSolarTargets);
         var resS = this.getResult("solar");
         var resStringS = this.getExtraTargetsResultString(resS);
         for (var est = 0; est < exSolarTargets.length; est++) {
             if (exSolarTargets[est].tagName.toLowerCase() == "input") {
                 exSolarTargets[est].value = resStringS;
             } else {
                 exSolarTargets[est].innerHTML = resStringS;
             }
         }
     }

     return formattedResult;
 }

 HaDateTimePicker.prototype.getExtraTargetsResultString = function(result) {
     var resString = "";
     if (!this.options.timePickerOnly)
         resString += (result.getMonth() + 1) + "/" + result.getDate() + "/" + result.getFullYear();
     if (this.selectedTime != null && !this.options.disableTime)
         resString += " " + twoDigits(result.getHours()) + ":" + twoDigits(result.getMinutes()) + " " + this.selectedTime.amOrPm;
     if (this.options.is24) {
            resString = (result.getMonth() + 1) + "/" + result.getDate() + "/" + result.getFullYear();
            resString += " " + twoDigits(result.getHours()) + ":" + twoDigits(result.getMinutes());
     }
     return resString.trim();
 }

 HaDateTimePicker.prototype.getResult = function(toDate) {
     var resultDate = this.options.timePickerOnly ? new Date() : this.selectedDate;
     var tempHaDateSource = new HaDateSource();
     if (this.options.isSolar || this.options.isLunar)
         resultDate = tempHaDateSource.convertToGregorian(this.selectedDate);

     if (toDate != null) {
         if (toDate.toLowerCase() == "solar") {
             var tempC = new HaSolarDate();
             resultDate = tempC.convertFromGregorian(resultDate);
             delete tempC;
         } else if (toDate.toLowerCase() == "lunar") {
             var tempC = new HaLunarDate();
             resultDate = tempC.convertFromGregorian(resultDate);
             delete tempC;
         }
     } else if (this.options.resultInSolar || this.options.resultInLunar) {
         var tempConvertor = this.options.resultInSolar ? this.solarDate : this.lunarDate;
         resultDate = tempConvertor.convertFromGregorian(resultDate);
     }
     delete tempHaDateSource;

     if (this.selectedTime != null) {
         resultDate.setHours(this.getHours());
         resultDate.setMinutes(this.getMinutes());
     }

     return resultDate;
 }

 HaDateTimePicker.prototype.getFormatedResult = function() {
     var resultDate = this.getResult();
     var formattedResult = this.options.resultFormat;

     if (this.options.timePickerOnly)
         formattedResult = formattedResult.replace("{month}", "").replace("{day}", "").replace("{year}", "");
     do {
         var indexOfT = formattedResult.indexOf("{t?");
         var indexOfTEnd = formattedResult.indexOfClosingSymbol(indexOfT, "{", "}");

         var timeStr = "";
         if (indexOfT >= 0) {
             timeStr = formattedResult.substr(indexOfT, indexOfTEnd - indexOfT + 1);

             if (this.selectedTime == null)
                 formattedResult = formattedResult.replace(timeStr, "");
             else
                 formattedResult = formattedResult.removeCharsAt(indexOfTEnd).removeCharsAt(indexOfT, 3);
         }
     } while (indexOfT >= 0);

     do {
         var endDate = formattedResult.indexOf("{month}") < 0 && formattedResult.indexOf("{year}") < 0 && formattedResult.indexOf("{day}") < 0;
         formattedResult = formattedResult.replace("{month}", (resultDate.getMonth() + 1))
             .replace("{day}", resultDate.getDate())
             .replace("{year}", resultDate.getFullYear())
     } while (!endDate)

     do {
         var endTime = formattedResult.indexOf("{minute}") < 0 && formattedResult.indexOf("{hour}") < 0 && formattedResult.indexOf("{ampm}") < 0;
         if (this.options.is24) {
            var endTime = formattedResult.indexOf("{minute}") < 0 && formattedResult.indexOf("{hour}") < 0;
        }
         if (this.selectedTime != null) {
            if (this.options.is24) {
                formattedResult = formattedResult.replace("{hour}", twoDigits(this.getHours()))
                    .replace("{minute}", twoDigits(this.getMinutes()))
                    .replace("{ampm}", "");
            } else {
                formattedResult = formattedResult.replace("{hour}", twoDigits(this.getHours()))
                    .replace("{minute}", twoDigits(this.getMinutes()))
                    .replace("{ampm}", this.getAmOrPm().toUpperCase());
            }
         } else {
            if (this.options.is24) {
                formattedResult = formattedResult.replace("{hour}", "")
                    .replace("{minute}", "")
            } else {
                formattedResult = formattedResult.replace("{hour}", "")
                    .replace("{minute}", "")
                    .replace("{ampm}", "");
            }
         }
     } while (!endTime)

     return formattedResult.trim();
 }

 HaDateTimePicker.prototype.show = function() {
     this.init();
     var self = this;
     setTimeout(function() {
         document.querySelector(".ha-datetimepicker").className += " show";
         self.eventHandler.dispatchEvent(self.events.pickerShow);
     }, 10);
 }

 HaDateTimePicker.prototype.hide = function() {
     var dp = document.querySelector(".ha-datetimepicker");
     dp.className = dp.className.replace("show", "").trim();
     this.clock = false;
     this.eventHandler.dispatchEvent(this.events.pickerHide);
 }

 var dps = [];
 HaDateTimePicker.init = function() {
     var datePickers = document.querySelectorAll("[data-ha-datetimepicker]");
     for (var d = 0; d < datePickers.length; d++) {
         datePickers[d].addEventListener("mousedown", function() {
             this.blur();
         });
         datePickers[d].addEventListener("keydown", function(e) {
             e.preventDefault();
             return false;
         });
         var is24 = caseInsensitiveGetAttribute(datePickers[d], "data-ha-dp-is24");
         var isSolar = caseInsensitiveGetAttribute(datePickers[d], "data-ha-dp-issolar");
         var isLunar = caseInsensitiveGetAttribute(datePickers[d], "data-ha-dp-islunar");
         var resultInSolar = caseInsensitiveGetAttribute(datePickers[d], "data-ha-dp-resultinsolar")
         var resultInLunar = caseInsensitiveGetAttribute(datePickers[d], "data-ha-dp-resultinlunar")
         var dp = new HaDateTimePicker(caseInsensitiveGetAttribute(datePickers[d], "data-ha-datetimepicker"), {
             date: caseInsensitiveGetAttribute(datePickers[d], "data-ha-dp-date"),
             selectedDate: datePickers[d].value ? datePickers[d].value : datePickers[d].innerHTML ? datePickers[d].innerHTML : caseInsensitiveGetAttribute(datePickers[d], "data-ha-dp-selecteddate"),
             minAllowedDate: caseInsensitiveGetAttribute(datePickers[d], "data-ha-dp-minalloweddate"),
             maxAllowedDate: caseInsensitiveGetAttribute(datePickers[d], "data-ha-dp-maxalloweddate"),
             pagingDuration: caseInsensitiveGetAttribute(datePickers[d], "data-ha-dp-pagingduration"),
             minYear: caseInsensitiveGetAttribute(datePickers[d], "data-ha-dp-minyear"),
             maxYear: caseInsensitiveGetAttribute(datePickers[d], "data-ha-dp-maxyear"),
             resultInSolar: resultInSolar,
             resultInLunar: resultInLunar,
             is24: is24,
             isSolar: isSolar,
             isLunar: isLunar,
             extraTargets: caseInsensitiveGetAttribute(datePickers[d], "data-ha-dp-extratargets"),
             extraSolarTargets: caseInsensitiveGetAttribute(datePickers[d], "data-ha-dp-extrasolartargets"),
             extraLunarTargets: caseInsensitiveGetAttribute(datePickers[d], "data-ha-dp-extralunartargets"),
             forceSetTime: caseInsensitiveGetAttribute(datePickers[d], "data-ha-dp-forcesettime"),
             disableTime: caseInsensitiveGetAttribute(datePickers[d], "data-ha-dp-disabletime"),
             timePickerOnly: caseInsensitiveGetAttribute(datePickers[d], "data-ha-dp-timepickeronly"),
             resultFormat: caseInsensitiveGetAttribute(datePickers[d], "data-ha-dp-resultformat"),
             disabledWeekDays: caseInsensitiveGetAttribute(datePickers[d], "data-ha-dp-disabledweekdays"),
             disableOkButton: caseInsensitiveGetAttribute(datePickers[d], "data-ha-dp-disableokbutton"),
             disableAnimations: caseInsensitiveGetAttribute(datePickers[d], "data-ha-dp-disableanimations")
         });
         dps.push(dp);
         datePickers[d].index = d;
         datePickers[d].addEventListener("click", function(e) {
             this.blur();

             dps[this.index].show();
         });
     }
 }

 function caseInsensitiveGetAttribute(elem, attr) {
     for (var i = 0; i < elem.attributes.length; i++) {
         var attrib = elem.attributes[i];

         if (attr.toLowerCase() === attrib.name)
             return attrib.value;
     }
 };



 String.prototype.indexOfAfter = function(preString, searchString) {
     preIndex = this.indexOf(preString);
     return preIndex + this.substring(preIndex).indexOf(searchString);
 }

 function twoDigits(num) {
     if (num.toString().length < 2)
         num = "0" + num.toString();

     return num;
 }

 String.prototype.removeCharsAt = function(index, range) {
     range = range || 1;
     return this.slice(0, index) + this.slice(index + range);
 }

 String.prototype.indexOfClosingSymbol = function(openingIndex, openingSymbol, closingSymbol) {
     openingSymbol = openingSymbol || "{";
     closingSymbol = closingSymbol || "}";
     var count = 0;

     for (var i = openingIndex; i < this.length; i++) {
         if (this[i] == openingSymbol)
             count++;
         if (this[i] == closingSymbol)
             count--;
         if (count <= 0)
             return i;
     }

     return -1;
 }

 function createFragment(htmlStr) {
     var frag = document.createDocumentFragment(),
         temp = document.createElement('div');
     temp.innerHTML = htmlStr;
     while (temp.firstChild) {
         frag.appendChild(temp.firstChild);
     }
     return frag;
 }

 Date.prototype.getMonthTotalDays = function(monthNumber, year) {
     var date = new Date();
     if (monthNumber + 1 > 11)
         year++;
     var lastDay = new Date(year, monthNumber + 1, 0).getDate();
     return lastDay;
 }

 Date.prototype.compare = function(date1, date2) {
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

 HaDateTimePicker.init();
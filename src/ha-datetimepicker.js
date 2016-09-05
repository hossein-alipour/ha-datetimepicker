// HA-PopOver v1.1 © 2016 by Hossein Alipour http://hosseinalipour.ir

function HaDateTimePicker(selector, options) {
    this.solarDate = new HaSolarDate();
    this.target = selector;
    options = options || {};
    var isSolar = options.isSolar ? options.isSolar.toString().toLowerCase() === "true" ? true : false : false;
    this.options = {
        date: options.date || new Date(),
        isSolar: isSolar,
        maxYear: options.maxYear || isSolar === true ? 1450 : 2050,
        minYear: options.minYear || isSolar === true ? 1350 : 1950,
        pagingDuration: options.pagingDuration || 600,
        selectedDate: options.selectedDate || null,
        minAllowedDate: options.minAllowedDate || null,
        maxAllowedDate: options.maxAllowedDate || null,
        forceSetTime: options.forceSetTime ? options.forceSetTime.toString().toLowerCase() === "true" ? true : false : false,
        resultInSolar: options.resultInSolar ? options.resultInSolar.toString().toLowerCase() === "true" ? true : false : false,
        disableTime: options.disableTime ? options.disableTime.toString().toLowerCase() === "true" ? true : false : false,
        resultFormat: options.resultFormat || "{month}/{day}/{year} {t?{hour}:{minute} {ampm}}"
    };

    if (this.options.isSolar === true) {
        this.days = this.solarDate.dayNames;
        this.monthNames = this.solarDate.monthNames;
        this.renderedDate = this.solarDate.convertFromGregorian(this.options.date);
        if (this.options.selectedDate != null)
            this.selectedDate = this.options.resultInSolar === false ? this.solarDate.convertFromGregorian(this.options.selectedDate) : this.options.selectedDate;
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
        this.options.maxAllowedDate = this.options.isSolar ? new HaSolarDate(this.options.maxAllowedDate) : new Date(this.options.maxAllowedDate);
        this.options.maxYear = Math.min(this.options.maxYear, this.options.maxAllowedDate.getFullYear());
        if (this.solarDate.compare(this.options.maxAllowedDate, this.renderedDate) > 0)
            this.renderedDate = this.options.maxAllowedDate;
    }

    if (this.options.minAllowedDate) {
        this.options.minAllowedDate = this.options.isSolar ? new HaSolarDate(this.options.minAllowedDate) : new Date(this.options.minAllowedDate);
        this.options.minYear = Math.max(this.options.minYear, this.options.minAllowedDate.getFullYear());
        if (this.solarDate.compare(this.options.minAllowedDate, this.options.renderedDate) < 0)
            this.renderedDate = this.options.minAllowedDate;
    }

    if (this.selectedDate != null)
        this.selectedTime = {
            hour: this.selectedDate.getHours() >= 12 ? this.selectedDate.getHours() - 12 : this.selectedDate.getHours(),
            minute: this.selectedDate.getMinutes(),
            amOrPm: this.selectedDate.getHours() >= 12 ? "pm" : "am"
        };


    if (this.options.disableTime === true) {
        this.options.forceSetTime = false;
        this.selectedTime = null;
    }


}

HaDateTimePicker.prototype.init = function() {
    if (document.querySelectorAll(".ha-datetimepicker").length > 0) {
        document.body.removeChild(document.querySelector(".ha-datetimepicker"));
    }

    this.createCalendar();
    this.setupStyles();
    this.renderDate(this.selectedDate || this.renderedDate);
    this.renderClock();
    if (this.selectedTime != null) {
        this.renderHourHand();
        this.renderMinuteHand();
    }
    this.addEvents();
    this.renderResult();
    var self = this;
}

HaDateTimePicker.prototype.createCalendar = function() {
    var currentYearDisp = this.options.isSolar == true ? this.renderedDate.getFullYear().toString().toFaDigit() : this.renderedDate.getFullYear();

    var html = "<div class='ha-datetimepicker'><div class='ha-dp-dim'></div><div class='ha-datetimepicker-container'>" +
        "<div class='ha-dp-header'>" +
        "<div class='ha-dp-year'>" +
        "<div class='ha-dp-year-dropdown-container'>" +
        "<button type='button' class='ha-dp-year-btn'>" + currentYearDisp + "</button>" +
        "<ul class='ha-dp-year-dropdown'>";
    for (var y = this.options.minYear; y <= this.options.maxYear; y++) {
        if (y % 10 == 0)
            html += "<hr class='ha-dp-list-separator'/>";
        var yearDisp = this.options.isSolar == true ? y.toString().toFaDigit() : y;
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
        html += "<div class='ha-dp-clock'>" +
            "<div class='ha-dp-clock-header'>" +
            "<div class='ha-dp-ampm'>" +
            "<div type='button' class='ha-dp-clock-am-btn" + (this.selectedTime && this.selectedTime.amOrPm.toLowerCase() == "am" || !this.selectedTime ? " selected" : "") + "'>AM</div>" +
            "<button type='button' class='ha-dp-clock-ampm-btn" + (this.selectedTime && this.selectedTime.amOrPm.toLowerCase() == "pm" ? " pm" : " am") + "'>AMPM</button>" +
            "<div type='button' class='ha-dp-clock-pm-btn" + (this.selectedTime && this.selectedTime.amOrPm.toLowerCase() == "pm" ? " selected" : "") + "'>PM</div>" +
            "</div>" + //end of div.ha-dp-ampm
            "</div>" + //end of div.ha-dp-clock-header
            "<div class='ha-dp-clock-face'>" +
            "<div class='hours-clock-face'>" +
            "</div>" + //end of div.houres-clock-face
            "</div>" + //end of div.ha-dp-clock-face
            "<p class='ha-dp-clock-res'></p>" +
            "<button type='button' class='ha-dp-btn ha-dp-clock-ok-btn'>OK</button>" +
            "</div>"; //end of div.ha-dp-clock
    }
    html += "<div class='ha-dp-footer'>" +
        "<p class='ha-dp-result'>-</p>" +
        "<div class='ha-dp-buttons'>" +
        "<button type='button' class='ha-dp-btn ha-dp-cancel-btn'>Cancel</button>" +
        "<button type='button' class='ha-dp-btn ha-dp-ok-btn'>OK</button>";
    if (this.options.disableTime === false) {
        html += "<button type='button' class='ha-dp-btn ha-dp-clock-btn'>Clock</button>";
    }
    html += "</div>" + //end of div.ha-dp-buttons
        "</div>"; //end of div.ha-dp-footer
    html += "</div></div>"; //end of div.ha-datetimepicker

    var dom = createFragment(html);
    document.body.insertBefore(dom, document.body.childNodes[document.body.childNodes.length - 1]);

}

HaDateTimePicker.prototype.setupStyles = function() {
    var c = document.querySelector(".ha-dp-days-container");
    c.setAttribute("style", "animation-duration:" + this.options.pagingDuration + "ms");

    if (this.options.isSolar) {
        var dp = document.querySelector(".ha-dp-body");
        dp.style.direction = "rtl";
    }
}

HaDateTimePicker.prototype.renderDate = function(date) {

    this.renderedDate = this.options.isSolar ? new HaSolarDate(date) : new Date(date);
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

    if (this.options.isSolar == true) {
        tempDate = new HaSolarDate(date.getFullYear(), date.getMonth(), 1);
        currentDate = new HaSolarDate();
    } else {
        tempDate = new Date(date.getFullYear(), date.getMonth(), 1);
        currentDate = new Date();
    }
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
    yearBtn.innerHTML = this.options.isSolar === true ? date.getFullYear().toString().toFaDigit() : date.getFullYear();
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

    var monthLastDay = this.options.isSolar === false ? getMonthLastDay(date.getMonth(), date.getFullYear()) : this.solarDate.getMonthTotalDays(date.getMonth(), date.getFullYear());
    var previousMonthLastDay = this.options.isSolar === false ? getMonthLastDay(date.getMonth() - 1, date.getFullYear()) : this.solarDate.getMonthTotalDays(date.getMonth() - 1, date.getFullYear());

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
                    muted = this.solarDate.compare(new Date(date.getFullYear(), date.getMonth(), dayOfMonth), this.options.minAllowedDate) > 0 ? " ha-dp-cell-muted" : muted;
                if (this.options.maxAllowedDate != null)
                    muted = this.solarDate.compare(new Date(date.getFullYear(), date.getMonth(), dayOfMonth), this.options.maxAllowedDate) < 0 ? " ha-dp-cell-muted" : muted;

                var cd = currentDate.getFullYear() == date.getFullYear() && currentDate.getMonth() == date.getMonth() && currentDate.getDate() == dayOfMonth ? " ha-dp-cell-currentdate" : "";
                var holiday;
                if (this.options.isSolar)
                    holiday = l == 6 ? " ha-dp-cell-holiday" : "";
                else
                    holiday = l == 5 ? " ha-dp-cell-holiday" : "";

                var disp = this.options.isSolar == true ? dayOfMonth.toString().toFaDigit() : dayOfMonth;
                h += "<p class='ha-dp-cell" + holiday + cd + selected + muted + "' data-date='" + dayOfMonth + "' data-disp='" + disp + "'>" + disp + "</p>";
            } else
            if (dayOfMonth < 1) {
                var disp = this.options.isSolar == true ? (previousMonthLastDay + dayOfMonth).toString().toFaDigit() : (previousMonthLastDay + dayOfMonth);
                h += "<p class='ha-dp-cell ha-dp-cell-muted' data-date='" + (previousMonthLastDay + dayOfMonth) + "'>" + disp + "</p>";
            } else {
                var disp = this.options.isSolar == true ? (dayOfMonth - monthLastDay).toString().toFaDigit() : (dayOfMonth - monthLastDay);
                h += "<p class='ha-dp-cell ha-dp-cell-muted' data-date='" + (dayOfMonth - monthLastDay) + "'>" + disp + "</p>";
            }

        }
        h += "</div>"
        html += h;
    }

    daysContainer.innerHTML = html;
    this.addEvents();
}

HaDateTimePicker.prototype.changeDate = function(date) {
    // if (this.options.maxAllowedDate)
    //     if (this.solarDate.compare(this.renderedDate, date) > 0) {
    //         if (this.solarDate.compare(this.options.maxAllowedDate, date) > 0)
    //             return;
    //     }

    // if (this.options.minAllowedDate)
    //     if (this.solarDate.compare(this.renderedDate, date) < 0) {
    //         if (this.solarDate.compare(this.options.minAllowedDate, date) < 0)
    //             return;
    //     }
    var c = document.querySelector(".ha-dp-days-container");
    var delay = this.options.pagingDuration;
    c.className = c.className.replace("page-left", "").replace("page-right", "").trim();
    if (this.solarDate.compare(date, this.renderedDate) == -1)
        c.className += " page-left";
    else
        c.className += " page-right";



    var self = this;
    setTimeout(function() {
        if (self.options.isSolar)
            self.renderDate(new HaSolarDate(date.getFullYear(), date.getMonth(), date.getDate()));
        else
            self.renderDate(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
    }, delay / 2);

    setTimeout(function() {
        c.className = c.className.replace("page-left", "").replace("page-right", "").trim();
    }, delay);
}

HaDateTimePicker.prototype.addEvents = function() {
    var c = document.querySelector(".ha-dp-days-container");
    var currentDate = new Date();
    var self = this;
    var cells = document.querySelectorAll(".ha-dp-cell:not(.ha-dp-cell-muted):not(.ha-dp-cell-header)");
    for (var i = 0; i < cells.length; i++) {
        cells[i].onclick = function() {
            for (var c = 0; c < cells.length; c++) {
                cells[c].className = cells[c].className.replace("ha-dp-cell-selected", "").trim();
            }
            this.className += " ha-dp-cell-selected";
            if (self.options.isSolar)
                self.selectedDate = new HaSolarDate(self.renderedDate.getFullYear(), self.renderedDate.getMonth(), parseInt(this.getAttribute("data-date")));
            else
                self.selectedDate = new Date(self.renderedDate.getFullYear(), self.renderedDate.getMonth(), parseInt(this.getAttribute("data-date")));
            self.renderResult();
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
        self.changeDate(new Date(year, month, currentDate.getDate()));
    }
    previous.onclick = function() {
        var year = self.renderedDate.getFullYear();
        var month = self.renderedDate.getMonth() - 1;

        if (month < 0) {
            year--;
            month = 11;
        }
        if (self.options.isSolar)
            self.changeDate(new HaSolarDate(year, month, currentDate.getDate()));
        else
            self.changeDate(new Date(year, month, currentDate.getDate()));
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

    var okBtn = document.querySelector(".ha-dp-ok-btn");
    okBtn.onclick = function() {
        if (self.returnResults() != null)
            self.hide();
    }
    var cancelBtn = document.querySelector(".ha-dp-cancel-btn");
    cancelBtn.onclick = function() {
        self.hide();
    }

    if (this.options.disableTime === false) {
        var clockBtn = document.querySelector(".ha-dp-clock-btn");
        clockBtn.onclick = function() {
            self.toggleClock();
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

        var clockOkBtn = document.querySelector(".ha-dp-clock-ok-btn");
        clockOkBtn.onclick = function() {
            self.toggleClock();
        }

        var hourBtns = document.querySelectorAll(".ha-dp-clock-num.ha-dp-hour-num .num");
        for (var h = 0; h < hourBtns.length; h++) {
            hourBtns[h].onclick = function() {
                var n = this.getAttribute("data-hour");
                if (!self.selectedTime)
                    self.selectedTime = {
                        hour: 0,
                        minute: 0,
                        amOrPm: "AM"
                    };
                self.selectedTime.hour = n;
                self.renderHourHand();
                self.renderMinuteHand();
            }
        }

        var minuteBtns = document.querySelectorAll(".ha-dp-clock-num.ha-dp-minute-num .num");
        for (var h = 0; h < minuteBtns.length; h++) {
            minuteBtns[h].onclick = function() {
                var n = this.getAttribute("data-minute");
                if (!self.selectedTime)
                    self.selectedTime = {
                        hour: 0,
                        minute: 0,
                        amOrPm: "AM"
                    };
                self.selectedTime.minute = n;

                self.renderMinuteHand();
                self.renderHourHand();
            }
        }
    }
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
    this.renderResult();
}
HaDateTimePicker.prototype.renderResult = function() {
    var r = document.querySelector(".ha-dp-result");
    var res = "";
    if (this.selectedDate != null)
        res = this.options.isSolar ? this.selectedDate.getDate() + "/" + (this.selectedDate.getMonth() + 1) + "/" + this.selectedDate.getFullYear() :
        (this.selectedDate.getMonth() + 1) + "/" + this.selectedDate.getDate() + "/" + this.selectedDate.getFullYear();
    if (this.selectedTime != null)
        res += " " + twoDigits(this.getHours()) + ":" + twoDigits(this.getMinutes()) + " " + this.getAmOrPm().toUpperCase();

    r.innerHTML = res == "" ? "-" : this.options.isSolar == false ? res : res.toFaDigit();
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
    var rot = 180 + (n * 30) + (this.selectedTime.minute * .5);

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
    resHolder.innerHTML = twoDigits(this.getHours()) + ":" + twoDigits(this.getMinutes()) + " " + this.getAmOrPm().toUpperCase();
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
}

HaDateTimePicker.prototype.getHours = function() {
    var hour = this.selectedTime.hour;
    if (this.selectedTime.amOrPm.toLowerCase() == "pm" && hour == 0)
        hour = 12;

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
        clockFace.appendChild(numContainer);
    }
}

HaDateTimePicker.prototype.returnResults = function() {
    if (this.selectedDate == null)
        return null;

    if (this.options.forceSetTime && !this.selectedTime) {
        this.toggleClock();
        return null;
    }
    var targets = document.querySelectorAll(this.target);

    var formattedResult = this.getFormatedResult();

    for (var t = 0; t < targets.length; t++) {
        var target = targets[t];
        if (target.tagName.toLowerCase() == "input") {
            target.value = formattedResult;
        } else {
            target.innerHTML = formattedResult;
        }
    }

    return formattedResult;
}

HaDateTimePicker.prototype.getResult = function() {
    var resultDate = this.selectedDate;
    if (!this.options.resultInSolar && this.options.isSolar) {
        resultDate = this.solarDate.convertToGregorian(new HaSolarDate(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate()));
    }

    if (!this.options.isSolar && this.options.resultInSolar) {
        resultDate = this.solarDate.convertFromGregorian(new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate()));
    }

    if (this.selectedTime != null) {
        resultDate.setHours(this.getHours());
        resultDate.setMinutes(this.getMinutes());
    }

    return resultDate;
}

HaDateTimePicker.prototype.getFormatedResult = function() {
    var resultDate = this.getResult();
    var formattedResult = this.options.resultFormat;
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
        if (this.selectedTime != null) {
            formattedResult = formattedResult.replace("{hour}", twoDigits(this.getHours()))
                .replace("{minute}", twoDigits(this.getMinutes()))
                .replace("{ampm}", this.getAmOrPm().toUpperCase());
        } else {
            formattedResult = formattedResult.replace("{hour}", "")
                .replace("{minute}", "")
                .replace("{ampm}", "");
        }
    } while (!endTime)

    return formattedResult.trim();
}

HaDateTimePicker.prototype.show = function() {
    this.init();
    setTimeout(function() {
        document.querySelector(".ha-datetimepicker").className += " show";
    }, 10);
}

HaDateTimePicker.prototype.hide = function() {
    var dp = document.querySelector(".ha-datetimepicker");
    dp.className = dp.className.replace("show", "").trim();
}

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
        datePickers[d].addEventListener("click", function(e) {
            this.blur();
            var dp = new HaDateTimePicker(caseInsensitiveGetAttribute(this, "data-ha-datetimepicker"), {
                date: caseInsensitiveGetAttribute(this, "data-ha-dp-date"),
                selectedDate: this.value && Date.parse(this.value).toString() !== "NaN" ? new Date(this.value) : null ||
                    this.innerHTML && Date.parse(this.innerHTML).toString() !== "NaN" ? new Date(this.innerHTML) : null ||
                    caseInsensitiveGetAttribute(this, "data-ha-dp-selecteddate"),
                minAllowedDate: caseInsensitiveGetAttribute(this, "data-ha-dp-minalloweddate"),
                maxAllowedDate: caseInsensitiveGetAttribute(this, "data-ha-dp-maxalloweddate"),
                pagingDuration: caseInsensitiveGetAttribute(this, "data-ha-dp-pagingduration"),
                minYear: caseInsensitiveGetAttribute(this, "data-ha-dp-minyear"),
                maxYear: caseInsensitiveGetAttribute(this, "data-ha-dp-maxyear"),
                resultInSolar: caseInsensitiveGetAttribute(this, "data-ha-dp-resultinsolar"),
                isSolar: caseInsensitiveGetAttribute(this, "data-ha-dp-issolar"),
                forceSetTime: caseInsensitiveGetAttribute(this, "data-ha-dp-forcesettime"),
                disableTime: caseInsensitiveGetAttribute(this, "data-ha-dp-disabletime"),
                resultFormat: caseInsensitiveGetAttribute(this, "data-ha-dp-resultformat")
            });
            dp.show();
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

String.prototype.toFaDigit = function() {
    return this.replace(/\d+/g, function(digits) {
        var result = "";
        for (var i = 0; i < digits.length; i++) {
            result += String.fromCharCode(digits.charCodeAt(i) + 1728);
        }
        return result;
    });
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

function getMonthLastDay(monthNumber, year) {
    var date = new Date();
    if (monthNumber + 1 > 11)
        year++;
    var lastDay = new Date(year, monthNumber + 1, 0).getDate();
    return lastDay;
}

HaDateTimePicker.init();
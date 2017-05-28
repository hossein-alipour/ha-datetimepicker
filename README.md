[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](http://demos.hosseinalipour.ir/ha-datetimepicker)

# HA-DateTimePicker
A date and time picker with Solar(Persian), Lunar(Arabic) and Gregorian calendars

## View [Documentation and Demos](http://demos.hosseinalipour.ir/ha-datetimepicker)

# Changelog
v1.4
 - Added events to control HA-DateTimePicker behaviour

v1.3
 - The HA-DateTimePicker is now fully responsive
 - Added feature of disabling ok button
 - Added feature of extra targets
 - Added Timepicker only mode
 - Minor Improvements
 - Minor bug fixes

v1.2
 - Added Lunar Date (هجری قمری)
 - Added feature of changing hour and minute via mouse wheel
 - Added Disabled Week days feature
 - Minor Improvements
 - Minor bug fixes

v1.1
 - Added Max an Min Allowed Date: choose the maximum and minimum date that the user can select 
 - DateTimePicker will now close when clicking outside of it
 - Added Result format: display date and time in any format you want
 - Minor Improvements
 - Minor bug fixes

# Installation

Just download the files and and include JS, CSS and other resource files in your project

JS Files:
```
<script type="text/javascript" src="ha-solardate.min.js"></script>
<script type="text/javascript" src="ha-lunardate.min.js"></script> // If you dont need the lunar calendar features, just ignore this line
<script type="text/javascript" src="ha-datetimepicker.min.js"></script>
```
*Note: Be sure to include the ha-solardate.js and ha-lunardate.js file before ha-datetimepicker.js*

CSS File:
```
<link rel="stylesheet" type="text/css" href="ha-datetimepicker.css" />
```

# NuGet Package
 
 NuGet is a standard package manager for .NET Applications, It's simplest solution for ASP.NET Web Developers and Visual Studio Developers to install the latest release of packages with just type the below command and press enter
 
 ```
 Install-Package hadatetimepicker
 ```
 
#npm Package
npm is a NodeJS package manager. As its name would imply, you can use it to install node programs. Also, if you use it in development, it makes it easier to specify and link dependencies. type the below command in your Command Prompt or Terminal and press enter

```
npm i ha-datetimepicker
```

#Bower Package
Bower is a package manager for the web. type the below command in your Command Prompt or Terminal and press enter
```
bower install ha-datetimepicker
```

# How to use

## - Add *data-ha-datetimepicker* attribute to your DOMElement

```
  <input type="text" id="datetime" data-ha-datetimepicker="#datetime" />
```

## - Show using Javascript

  ```javascript
  var dp = new HaDateTimePicker("#datetime");
  dp.show();
  ```
  
#Features
You can initiate your HA-DateTimePicker with this set of options:

*Note: you can use with javascript object or HTML Attribute*

Javascript option | HTML attribute | Type | description
------------ | ------------- | ------------- | -------------
date | data-ha-dp-date | Date | Initial month and year sheet
selectedDate | data-ha-dp-selecteddate | Date | Selected Date
minYear | data-ha-dp-minyear | Number | The first year in the year dropdown list
maxYear | data-ha-dp-maxyear | Number | The last year in the year dropdown list
isSolar | data-ha-dp-issolar | Boolean | Turns into Solar(Persian) Calendar
isLunar | data-ha-dp-islunar | Boolean | Turns into Lunar(Arabic) Calendar
resultInSolar | data-ha-dp-resultinsolar | Boolean | Returns the result in Solar(Persian) date mode
resultInLunar | data-ha-dp-resultinlunar | Boolean | Returns the result in Lunar(Arabic) date mode
forceSetTime | data-ha-dp-forcesettime | Boolean | Forces the user to set the time
disableTime | data-ha-dp-disabletime | Boolean | Disables the time feature
pagingDuration | data-ha-dp-pagingduration | Number | The duration time of changing month (In Miliseconds)
minAllowedDate | data-ha-dp-minalloweddate | Date | The minimum date that the user can select
maxAllowedDate | data-ha-dp-maxalloweddate | Date | The maximum date that the user can select
resultFormat | data-ha-dp-resultformat | String | The string format of date and time result. use {year} for year, {month} for month, {day} for day, {hour} for hour, {minute} for minute, {ampm} for AM or Pm and if you want to display some text only when time is available put it between {t? and }. ex. {month}/{day}/{year} {t?{hour}:{minute} {ampm}}
disabledWeekDays | data-ha-dp-disabledweekdays | Array or String(separated by comma) | Use the number of week days to disable them.  1 for Sunday(یکشنبه or الأحد) and 7 for Saturday(شنبه or السبت)



***
Copyright © 2016 by [Hossein Alipour](http://hosseinalipour.ir) under [MIT License](https://opensource.org/licenses/MIT)


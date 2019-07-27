var datePickerHelper = function () {
    var Promise = require('bluebird');
    var helpers = require('../../pages/helpers.js');
    var _ = require("lodash");

    var setDynamicDate = function (value, unit, datePickerSelector) {
        var date = new Date();
        switch (unit) {
            case 'day(s)':
                date.setDate(date.getDate() + value);
                break;
            case 'month(s)':
                date.setMonth(date.getMonth() + value);
                break;
            case 'year(s)':
                date.setYear(date.getYear() + value);
                break;
            default:
                throw new Error('Date unit not recognised');
        }

        return setDate(date, datePickerSelector);
    };

    var dateSelector = function (date) {
        return helpers.findVisible(by.css('.datepicker ul.dates li:not(.different-month)')).then(
            function (element) {
                return element[date.getDate() - 1].click();
            });
    };

    var yearSelector = function (date, today, datePickerSelector) {
        var yearPromises = [];
        var yearDiff = date.getFullYear() - today.getFullYear();
        var yearBtnClass = 'left';
        if (yearDiff > 0) {
            yearBtnClass = 'right';
        }

        for (var y = 1; y <= Math.abs(yearDiff); y++) {
            yearPromises.push(element(by.css(datePickerSelector + ' .datepicker i.' + yearBtnClass)).click());
        }
        return yearPromises;
    };

    var monthSelector = function (date, today, datePickerSelector) {
        var monthDiff = date.getMonth() - today.getMonth();
        var monthBtnClass = 'previousMonth';
        if (monthDiff > 0) {
            monthBtnClass = 'nextMonth';
        }

        var monthPromises = [];
        for (var m = 1; m <= Math.abs(monthDiff); m++) {
            monthPromises.push(element(by.css(datePickerSelector + ' .datepicker i.' + monthBtnClass)).click());
        }

        return monthPromises;
    };

    var setDate = function (input, datePickerSelector) {
        var datePickerDate = new Date();
        return element(by.css(datePickerSelector)).getAttribute('latest-date').then(function(latestDateValue) {

            var latestDate = new Date(latestDateValue);
            if(latestDateValue && latestDate < datePickerDate) {
                datePickerDate = latestDate;
            }
            var inputDate = new Date(input);

            return element(by.css(datePickerSelector)).element(by.tagName('input')).click().then(
                function () {
                    return Promise.all(
                        [Promise.all(yearSelector(inputDate, datePickerDate, datePickerSelector)),
                            Promise.all(monthSelector(inputDate, datePickerDate, datePickerSelector)),
                            dateSelector(inputDate)]
                    );
                }
            );
        });
    };

    return {
        setDate: setDate,
        setDynamicDate: setDynamicDate
    };


};

module.exports = datePickerHelper();
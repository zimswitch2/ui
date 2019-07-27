function PaymentDetail(properties) {
    'use strict';

    var intervalNames = {
        Monthly: 'month',
        Weekly: 'week',
        Daily: 'day'
    };

    var intervals = [
        {repeatInterval: 'Monthly', intervalName: 'Month'},
        {repeatInterval: 'Weekly', intervalName: 'Week'},
        {repeatInterval: 'Daily', intervalName: 'Day'}
    ];
    
    return {
        repeatInterval: properties.repeatInterval,
        repeatNumber: properties.repeatNumber,
        fromDate: properties.fromDate,
        currentDate: properties.currentDate,
        minimumRepeatNumber: properties.minimumRepeatNumber || 2,

        getPaymentDescription: function(){
          return 'Every ' + this.getIntervalName() + ' for ' + this.repeatNumber + ' ' + this.getIntervalName() + 's';
        },

        stateChanged: function(isRecurring, latestTimestampFromServer) {
            if (isRecurring) {
                this.repeatInterval = 'Monthly';
                this.repeatNumber = 2;

                if (!moment(this.fromDate).isAfter(moment(latestTimestampFromServer))) {
                    this.fromDate = moment(latestTimestampFromServer).add('Days', 1).format();
                }

            } else {
                this.repeatInterval = 'Single';
                this.repeatNumber = undefined;
                this.fromDate = moment(latestTimestampFromServer).format();
            }
        },

        defaultRepeatNumber: function () {
            this.repeatNumber = 2;
        },

        getIntervals: function () {
            return intervals;
        },

        isRecurringPayment: function () {
            return this.repeatInterval && this.repeatInterval !== 'Single';
        },

        getFromDateLabel: function () {
            return this.isRecurringPayment() ? 'First payment date' : 'Payment date';
        },

        getIntervalName: function () {
            return intervalNames[this.repeatInterval];
        },

        getToDate: function () {
            if (this.isRecurringPayment()) {
                return moment(this.fromDate).add(this.getIntervalName(), this.repeatNumber - 1).format();
            }
            return undefined;
        },

        getMaximumRepeats: function () {
            if (this.getIntervalName()) {
                var lastPermissibleDate = moment(this.currentDate).add(1, 'year');
                return lastPermissibleDate.diff(moment(this.fromDate).startOf('day'), this.getIntervalName()) + 1;
            }

            return 0;
        },

        getMinimumRepeats: function () {
            return this.minimumRepeatNumber;
        },

        getMinimumRepeatsInWords: function () {
            var words = {1: 'one', 2: 'two'};
            return words[this.minimumRepeatNumber] || '';
        },

        getEarliestPaymentDate: function (latestTimestampFromServer) {
            if (this.isRecurringPayment()) {
                return moment(latestTimestampFromServer).add('Days', 1).format();
            } else {
                return latestTimestampFromServer.format();
            }
        },

        getLatestPaymentDate: function (latestTimestampFromServer) {
            return moment(latestTimestampFromServer).add('Years', 1).format();
        }
    };
}

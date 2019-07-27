var change_instant_money_pin_step_definitions = function(){
	var expect = require('../../step_definitions/expect');
	var tableHelper = require('../../step_definitions/table_helper');

	this.Then(/^I should see the following change instant money pin details$/, function (table) {
        return tableHelper.getAndExpectRowsToMatch({
            rowSelector: '.summary',
            cssPropertyMap: {
                "From Account": '#fromAccount',
                "Available Balance": '#availableBalance',
                "Cell phone number": '#cellPhoneNumber',
                "Amount": '#amount'
            }
        }, [table.rowsHash()]);
	});

    this.Then(/^I should see the following change instant money pin confirm details$/, function (table) {
        return tableHelper.getAndExpectRowsToMatch({
            rowSelector: '.summary',
            cssPropertyMap: {
                "From Account": '#fromAccount',
                "Available Balance": '#availableBalance',
                "Cell phone number": '#cellPhoneNumber',
                "Amount": '#amount',
                "Voucher number": '#voucherNumber'
            }
        }, [table.rowsHash()]);
    });

    this.Then(/^I should see the following change instant money pin successful details$/, function (table) {
        return tableHelper.getAndExpectRowsToMatch({
            rowSelector: '.summary',
            cssPropertyMap: {
                "From Account": '#fromAccount',
                "Available Balance": '#availableBalance',
                "Cell phone number": '#cellPhoneNumber',
                "Amount": '#amount',
                "Voucher number": '#voucherNumber'
            }
        }, [table.rowsHash()]);
    });
};

module.exports = change_instant_money_pin_step_definitions;
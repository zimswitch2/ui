describe('ACCEPTANCE - Schedule future recurring dated payments Functionality', function () {
    var helpers = require('../../pages/helpers.js');
    var anyPage = require('../../pages/anyPage.js');
    var loginPage = require('../../pages/loginPage.js');
    var landingPage = require('../../pages/landingPage.js');
    var paymentPage = require('../../pages/paymentPage.js');
    var beneficiaryPage = require('../../pages/listBeneficiaryPage.js');
    var transactionPage = require('../../pages/transactionPage.js');
    var manageScheduledPaymentsPage = require('../../pages/manageScheduledPaymentsPage.js');
    var moment = require('moment');

    var __credentialsOfLoggedInUser__;

    function navigateUsing(credentials) {
        if (__credentialsOfLoggedInUser__ !== credentials) {
            loginPage.loginWith(credentials);
            __credentialsOfLoggedInUser__ = credentials;
        }
    }

    describe('no scheduled payments', function () {
        beforeEach(function () {
            var credentials = {
                username: 'zerobeneficiaries@standardbank.co.za',
                password: 'password'
            };
            navigateUsing(credentials);
        });

        it('should show a warning message on the scheduled payments page', function () {
            landingPage.baseActions.clickOnTab('Transact');
            transactionPage.manageFuturePayments();
            expect(manageScheduledPaymentsPage.baseActions.getWarningMessage()).toEqual("There are no payments scheduled.");
        });

    });

    describe('with scheduled payments', function () {
        beforeEach(function () {
            navigateUsing(browser.params.credentials);
        });

        it('should display a list of scheduled future payments', function () {
            landingPage.baseActions.clickOnTab('Transact');
            transactionPage.manageFuturePayments();
            expect(manageScheduledPaymentsPage.heading()).toEqual('Scheduled Payments');
            expect(manageScheduledPaymentsPage.getCellContent('.beneficiary-name', 0)).toEqual('2QVEWMVU9');
            expect(manageScheduledPaymentsPage.getCellContent('.next-payment-date', 0)).toEqual('1 August 2014');
            expect(manageScheduledPaymentsPage.getCellContent('.final-payment-date', 0)).toEqual('1 August 2014');
            expect(manageScheduledPaymentsPage.getCellContent('.payment-amount', 0)).toEqual('R 1.00');
            expect(manageScheduledPaymentsPage.getCellContent('.frequency', 0)).toEqual('Single');
            expect(manageScheduledPaymentsPage.getCellContent('.remaining-payments', 0)).toEqual('1');

        });

        describe('Recurring payments schedule when user has non zero EAP limit', function () {
            beforeEach(function () {
                landingPage.baseActions.navigateToBeneficiaries();
                beneficiaryPage.clickOnPay();
            });

            it('should schedule recurring future payment', function () {
                paymentPage.selectRepeatPayment();
                paymentPage.selectFirstRepeatInterval();
                paymentPage.enterRepeatNumber(5);
                paymentPage.amount('100.00');
                paymentPage.proceed();
                paymentPage.clickConfirm();
                expect(paymentPage.baseActions.getVisibleSuccessMessage()).toEqual('Payments were successfully scheduled');
            });
        });

        describe('sorting', function () {
            beforeEach(function () {
                paymentPage.baseActions.clickOnTab('Transact');
                transactionPage.manageFuturePayments();
            });

            it('should be by beneficiary name by default', function () {
                var beneficiaryNames = manageScheduledPaymentsPage.filterByColumn('.beneficiary-name');
                beneficiaryNames.then(function (names) {
                    var namesFromPage = _.clone(names);
                    expect(names.sort()).toEqual(namesFromPage);
                });
            });

            var date = function (text) {
                return moment(new Date(text));
            };

            var currency = function (text) {
                return parseFloat(text.replace('R', ''));
            };

            var number = function (text) {
                return parseInt(text);
            };

            var testColumnSort = function (field, transform) {
                helpers.scrollThenClick(element(by.css('#' + field)));
                var elements = element.all(by.css('.' + field)).map(function (elm) {
                    return elm.getText();
                });

                elements.then(function (result) {
                    var sorted = _.sortBy(result, function (name) {
                        return transform ? transform(name) : name;
                    }).reverse();

                    expect(result).toEqual(sorted);

                });
            };

            it('should be by next payment date when column is clicked', function () {
                testColumnSort('next-payment-date', date);
            });

            it('should be by final payment date when column is clicked', function () {
                testColumnSort('final-payment-date', date);
            });

            it('should be by amount when column is clicked', function () {
                testColumnSort('payment-amount', currency);
            });

            it('should be by frequency when column is clicked', function () {
                testColumnSort('frequency');
            });

            it('should be by remaining payments when column is clicked', function () {
                testColumnSort('remaining-payments', number);
            });

        });

        describe('filtering', function () {

            beforeEach(function () {
                paymentPage.baseActions.clickOnTab('Transact');
                transactionPage.manageFuturePayments();
            });

            var testFilter = function (filter, selector, count) {
                manageScheduledPaymentsPage.filter(filter);
                manageScheduledPaymentsPage.filterByColumn(selector).then(function (tableCells) {
                    expect(tableCells.length).toBe(count || 1);
                    expect(tableCells[0]).toEqual(filter);
                });
            };

            it('should filter on beneficiary name', function () {
                testFilter('DEMO', '.beneficiary-name');
            });

            it('should filter on next payment date', function () {
                testFilter('17 July 2014', '.next-payment-date');
            });

            it('should filter on final payment date', function () {
                testFilter('7 August 2014', '.final-payment-date');
            });

            it('should filter on amount', function () {
                testFilter('R 33.69', '.payment-amount');
            });

            it('should filter on frequency', function () {
                testFilter('Weekly', '.frequency', 2);
            });

            it('should show a message when the are no filter results', function () {
                manageScheduledPaymentsPage.filter('this should never return anything');
                expect(manageScheduledPaymentsPage.baseActions.getWarningMessage()).toEqual("No matches found.");
            });
        });

        describe('navigation', function () {
            beforeEach(function () {
                paymentPage.baseActions.clickOnTab('Transact');
                transactionPage.manageFuturePayments();
            });

            it('should go to the transact page when the back button is clicked', function () {
                manageScheduledPaymentsPage.back();
                expect(transactionPage.waitForHeading('Transact').getText()).toEqual('Transact');
            });
        });

        describe('delete', function () {
            beforeEach(function () {
                paymentPage.baseActions.clickOnTab('Transact');
                transactionPage.manageFuturePayments();
            });

            it('should delete a scheduled payment', function () {
                expect(manageScheduledPaymentsPage.scheduledPaymentCount()).toEqual(7);
                manageScheduledPaymentsPage.filter('DEMO');

                manageScheduledPaymentsPage.delete();
                manageScheduledPaymentsPage.confirm();
                expect(manageScheduledPaymentsPage.errorMessage()).toEqual('Could not delete this scheduled payment, try again later.');
                expect(manageScheduledPaymentsPage.scheduledPaymentCount()).toEqual(7);

                manageScheduledPaymentsPage.filter('911');
                manageScheduledPaymentsPage.delete();
                manageScheduledPaymentsPage.confirm();
                expect(manageScheduledPaymentsPage.scheduledPaymentCount()).toEqual(6);
            });
        });

        describe('modify', function () {
                beforeEach(function () {
                    paymentPage.baseActions.clickOnTab('Transact');
                    transactionPage.manageFuturePayments();
                });

                it('should modify a scheduled payment', function () {
                    expect(manageScheduledPaymentsPage.scheduledPaymentCount()).toEqual(7);
                    manageScheduledPaymentsPage.filter('16 June');
                    manageScheduledPaymentsPage.modify();
                    expect(paymentPage.baseActions.getCurrentUrl()).toContain("/payment/scheduled/modify");
                    paymentPage.amount('123');
                    paymentPage.proceed();
                    expect(paymentPage.baseActions.getCurrentUrl()).toContain("/payment/scheduled/modify/confirm");
                    expect(paymentPage.getAmount()).toBe('R 123.00');
                    paymentPage.clickConfirm();
                    expect(manageScheduledPaymentsPage.baseActions.getCurrentUrl()).toContain("/payment/scheduled/manage");
                    expect(manageScheduledPaymentsPage.getHighLightedBeneficiaryName()).toContain('JOHN');
                });

                it('should navigate between screens correctly', function () {
                    expect(manageScheduledPaymentsPage.scheduledPaymentCount()).toEqual(7);
                    manageScheduledPaymentsPage.filter('16 June');
                    manageScheduledPaymentsPage.modify();
                    expect(paymentPage.baseActions.getCurrentUrl()).toContain("/payment/scheduled/modify");
                    paymentPage.proceed();
                    expect(paymentPage.baseActions.getCurrentUrl()).toContain("/payment/scheduled/modify/confirm");
                    paymentPage.clickModify();
                    expect(paymentPage.baseActions.getCurrentUrl()).toContain("/payment/scheduled/modify");
                    paymentPage.proceed();
                    expect(paymentPage.baseActions.getCurrentUrl()).toContain("/payment/scheduled/modify/confirm");
                });

                describe('cancel buttons', function () {
                    it('should return to the scheduled payment list from the details page', function () {
                        expect(manageScheduledPaymentsPage.scheduledPaymentCount()).toEqual(7);
                        manageScheduledPaymentsPage.filter('16 June');
                        manageScheduledPaymentsPage.modify();
                        expect(paymentPage.baseActions.getCurrentUrl()).toContain("/payment/scheduled/modify");
                        paymentPage.clickCancel();
                        paymentPage.waitForManagePage();
                        expect(manageScheduledPaymentsPage.baseActions.getCurrentUrl()).toContain("/payment/scheduled/manage");
                    });

                    it('should return to the scheduled payment list from the confirm page', function () {
                        expect(manageScheduledPaymentsPage.scheduledPaymentCount()).toEqual(7);
                        manageScheduledPaymentsPage.filter('16 June');
                        manageScheduledPaymentsPage.modify();
                        expect(paymentPage.baseActions.getCurrentUrl()).toContain("/payment/scheduled/modify");
                        paymentPage.proceed();
                        expect(paymentPage.baseActions.getCurrentUrl()).toContain("/payment/scheduled/modify/confirm");
                        paymentPage.clickCancel();
                        expect(manageScheduledPaymentsPage.baseActions.getCurrentUrl()).toContain("/payment/scheduled/manage");
                    });
                });
            });
    });
});


describe('filters', function () {
    'use strict';

    beforeEach(module('refresh.filters', 'refresh.test'));

    describe('voucherNumber', function () {
        beforeEach(inject(function (voucherNumberFilter) {
            this.voucherNumberFilter = voucherNumberFilter;
        }));

        it('should add a dash every 4 digits', function () {
            expect(this.voucherNumberFilter('')).toEqual('');
            expect(this.voucherNumberFilter('   ')).toEqual('');
            expect(this.voucherNumberFilter('1111')).toEqual('1111');
            expect(this.voucherNumberFilter('11111')).toEqual('1111-1');
            expect(this.voucherNumberFilter('111111111')).toEqual('1111-1111-1');
            expect(this.voucherNumberFilter('1234567890')).toEqual('1234-5678-90');
        });
    });

    describe('capitalize', function () {
        beforeEach(inject(function (capitalizeFilter) {
            this.capitalizeFilter = capitalizeFilter;
        }));

        it('should capitalize first letter of every word when input is all lowercase (except special cases)',
            function () {
                expect(this.capitalizeFilter('hello and world')).toEqual('Hello and World');
            });

        it('should lower other letters of every word when input is all uppercase', function () {
            expect(this.capitalizeFilter('HELLO AND WORLD')).toEqual('Hello and World');
        });

        it('should return empty string when input is undefined', function () {
            expect(this.capitalizeFilter()).toEqual('');
        });

        describe('with change only first char', function(){
            it('should change only the first letter of each word if to caps and leave all other characters in word alone.', function(){
                expect(this.capitalizeFilter('halloWorld', true)).toEqual('HalloWorld');
                expect(this.capitalizeFilter('halloWorld whats up', true)).toEqual('HalloWorld Whats Up');
            });
        });
    });

    describe('capitalizeCountry', function () {
        beforeEach(inject(function (capitalizeCountryFilter) {
            this.capitalizeCountryFilter = capitalizeCountryFilter;
        }));

        it('should capitalize first letter of every word when input is all lowercase (except special cases)',
            function () {
                expect(this.capitalizeCountryFilter('virGin Islands (U.s)')).toEqual('Virgin Islands (US)');
                expect(this.capitalizeCountryFilter('MACEDONIA.THE FORMER YUGOSLAV REPUBLIC OF')).toEqual('Macedonia, The Former Yugoslav Republic of');
                expect(this.capitalizeCountryFilter('SAINT VINCENT & THE GRENADINES')).toEqual('Saint Vincent & The Grenadines');
                expect(this.capitalizeCountryFilter('cote d\'ivoire')).toEqual('Cote d\'Ivoire');
            });

    });

    describe('dateFormat', function () {
        beforeEach(inject(function (dateFormatFilter) {
            this.dateFormatFilter = dateFormatFilter;
        }));

        it('should format from extended format', function () {
            expect(this.dateFormatFilter('4 February 2000')).toEqual('4 February 2000');
        });

        it('should format from short format', function () {
            expect(this.dateFormatFilter('2000/02/28')).toEqual('28 February 2000');
        });

        it('should format from short format with time', function () {
            expect(this.dateFormatFilter('1998/01/01 11:15')).toEqual('1 January 1998');
        });

        it('should format from ISO', function () {
            expect(this.dateFormatFilter('2014-08-13T09:08:40.424+02:00')).toEqual('13 August 2014');
        });

        it('should return empty if value is undefined', function () {
            expect(this.dateFormatFilter(undefined)).toEqual('');
        });

        it('should return empty if value is null', function () {
            expect(this.dateFormatFilter(null)).toEqual('');
        });

        it('should return empty if value is empty', function () {
            expect(this.dateFormatFilter('')).toEqual('');
        });

        it('should return empty if value is a space', function () {
            expect(this.dateFormatFilter(' ')).toEqual('');
        });

        it('should return empty if format is invalid', function () {
            expect(this.dateFormatFilter('adjidasasi')).toEqual('');
        });
    });

    describe('monthYearDateFormat', function () {
        beforeEach(inject(function (monthYearDateFormatFilter) {
            this.monthYearDateFormatFilter = monthYearDateFormatFilter;
        }));

        it('should format from extended format', function () {
            expect(this.monthYearDateFormatFilter('4 February 2000')).toEqual('February 2000');
        });

        it('should format from short format', function () {
            expect(this.monthYearDateFormatFilter('2000/02/28')).toEqual('February 2000');
        });

        it('should format from short format with time', function () {
            expect(this.monthYearDateFormatFilter('1998/01/01 11:15')).toEqual('January 1998');
        });

        it('should format from ISO', function () {
            expect(this.monthYearDateFormatFilter('2014-08-13T09:08:40.424+02:00')).toEqual('August 2014');
        });

        it('should return empty if value is undefined', function () {
            expect(this.monthYearDateFormatFilter(undefined)).toEqual('');
        });

        it('should return empty if value is null', function () {
            expect(this.monthYearDateFormatFilter(null)).toEqual('');
        });

        it('should return empty if value is empty', function () {
            expect(this.monthYearDateFormatFilter('')).toEqual('');
        });

        it('should return empty if value is a space', function () {
            expect(this.monthYearDateFormatFilter(' ')).toEqual('');
        });

        it('should return empty if format is invalid', function () {
            expect(this.monthYearDateFormatFilter('adjidasasi')).toEqual('');
        });
    });

    describe('timeFormat', function () {
        beforeEach(inject(function (timeFormatFilter) {
            this.timeFormatFilter = timeFormatFilter;
        }));

        it('should format from short format with time', function () {
            expect(this.timeFormatFilter('1998/01/01 11:15')).toEqual('11:15:00');
        });

        it('should format from ISO', function () {
            expect(this.timeFormatFilter('2014-08-13T09:08:40.424+02:00')).toEqual('09:08:40');
        });

        it('should return empty if value is undefined', function () {
            expect(this.timeFormatFilter(undefined)).toEqual('');
        });

        it('should return empty if value is null', function () {
            expect(this.timeFormatFilter(null)).toEqual('');
        });

        it('should return empty if value is empty', function () {
            expect(this.timeFormatFilter('')).toEqual('');
        });

        it('should return empty if value is a space', function () {
            expect(this.timeFormatFilter(' ')).toEqual('');
        });

        it('should return empty if format is invalid', function () {
            expect(this.timeFormatFilter('adjidasasi')).toEqual('');
        });
    });

    describe('dateTimeFormat', function () {
        var filter;
        beforeEach(inject(function (dateTimeFormatFilter) {
            filter = dateTimeFormatFilter;
        }));

        it('should format from short format with time', function () {
            expect(filter('1998/01/01 11:15')).toEqual('1 January 1998 11:15:00');
        });

        it('should format from ISO', function () {
            expect(filter('2014-08-13T09:08:40.424+02:00')).toEqual('13 August 2014 09:08:40');
        });

        it('should return empty if value is undefined', function () {
            expect(filter(undefined)).toEqual('');
        });

        it('should return empty if value is null', function () {
            expect(filter(null)).toEqual('');
        });

        it('should return empty if value is empty', function () {
            expect(filter('')).toEqual('');
        });

        it('should return empty if value is a space', function () {
            expect(filter(' ')).toEqual('');
        });

        it('should return empty if format is invalid', function () {
            expect(filter('adjidasasi')).toEqual('');
        });
    });

    describe('addressLines', function () {
        beforeEach(inject(function (addressLinesFilter) {
            this.addressLinesFilter = addressLinesFilter;
        }));

        it('should join all lines with commas', function () {
            var address = {
                unitNumber: '5th floor',
                building: 'Standard Bank',
                streetPOBox: '5 Simmonds St',
                suburb: 'Marshalltown',
                cityTown: 'Johannesburg'
            };
            expect(this.addressLinesFilter(address)).toEqual('5th floor, Standard Bank, 5 Simmonds St, Marshalltown, Johannesburg');
        });

        it('should ignore empty string and undefined', function () {
            var address = {
                streetPOBox: '5 Simmonds St',
                suburb: '',
                cityTown: 'Johannesburg'
            };
            expect(this.addressLinesFilter(address)).toEqual('5 Simmonds St, Johannesburg');
        });

        it('should return empty if address is undefined', function () {
            expect(this.addressLinesFilter()).toEqual('');
        });
    });

    describe('yearMonth', function () {
        beforeEach(inject(function (yearMonthFilter) {
            this.yearMonthFilter = yearMonthFilter;
        }));

        it('should include years and months when both present', function () {
            expect(this.yearMonthFilter(2, 3)).toEqual('2 years 3 months');
        });

        it('should include only years when months is zero', function () {
            expect(this.yearMonthFilter(2, 0)).toEqual('2 years');
        });

        it('should include only months when years is zero', function () {
            expect(this.yearMonthFilter(0, 5)).toEqual('5 months');
        });

        it('should not pluralize 1 year', function () {
            expect(this.yearMonthFilter(1, 0)).toEqual('1 year');
        });

        it('should not pluralize 1 month', function () {
            expect(this.yearMonthFilter(0, 1)).toEqual('1 month');
        });
    });

    describe('randAmountFilter', function () {
        beforeEach(inject(function (randAmountFilter) {
            this.randAmountFilter = randAmountFilter;
        }));

        it('should return empty string when input is undefined', function () {
            expect(this.randAmountFilter()).toEqual('');
        });

        it('should return formatted zero if the input is zero', function () {
            expect(this.randAmountFilter(0)).toEqual('R 0.00');
        });

        it('should return formatted amount if the input is non zero', function () {
            expect(this.randAmountFilter(100)).toEqual('R 100.00');
        });

        it('should return formatted negative amounts', function () {
            expect(this.randAmountFilter(-100)).toEqual('- R 100.00');
        });

        it('should separate with space when number is greater than 1000', function () {
            expect(this.randAmountFilter(1000000)).toEqual('R 1 000 000.00');
        });
    });

    describe('randAmountNoCentsFilter', function () {
        beforeEach(inject(function (randAmountNoCentsFilter) {
            this.randAmountNoCentsFilter = randAmountNoCentsFilter;
        }));

        it('should return empty string when input is undefined', function () {
            expect(this.randAmountNoCentsFilter()).toEqual('');
        });

        it('should return formatted zero if the input is zero', function () {
            expect(this.randAmountNoCentsFilter(0)).toEqual('R 0');
        });

        it('should return formatted amount if the input is non zero', function () {
            expect(this.randAmountNoCentsFilter(100)).toEqual('R 100');
        });

        it('should return formatted negative amounts', function () {
            expect(this.randAmountNoCentsFilter(-100)).toEqual('- R 100');
        });

        it('should separate with space when number is greater than 1000', function () {
            expect(this.randAmountNoCentsFilter(1000000)).toEqual('R 1 000 000');
        });
    });

    describe('absoluteRandAmount', function () {
        beforeEach(inject(function (absoluteRandAmountFilter) {
            this.absoluteRandAmountFilter = absoluteRandAmountFilter;
        }));

        it('should return empty string when input is undefined', function () {
            expect(this.absoluteRandAmountFilter()).toEqual('');
        });

        it('should return formatted zero if the input is zero', function () {
            expect(this.absoluteRandAmountFilter(0)).toEqual('R 0.00');
        });

        it('should return formatted amount if the input is non zero', function () {
            expect(this.absoluteRandAmountFilter(100)).toEqual('R 100.00');
        });

        it('should return formatted absolute amounts', function () {
            expect(this.absoluteRandAmountFilter(-100)).toEqual('R 100.00');
        });

        it('should separate with space when number is greater than 1000 or less than -1000', function () {
            expect(this.absoluteRandAmountFilter(1000000)).toEqual('R 1 000 000.00');
            expect(this.absoluteRandAmountFilter(-1000000)).toEqual('R 1 000 000.00');
        });
    });

    describe('monthNameFilter', function () {
        var monthNames;
        beforeEach(inject(function (monthNameFilter) {
            this.monthNameFilter = monthNameFilter;
            monthNames =
                ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
                    "November", "December"];
        }));

        it('should return undefined when input is undefined', function () {
            expect(this.monthNameFilter()).not.toBeDefined();
        });

        it('should return original input when input is out of range', function () {
            expect(this.monthNameFilter(0)).toEqual(0);
            expect(this.monthNameFilter(13)).toEqual(13);
            expect(this.monthNameFilter("Random String")).toEqual("Random String");
        });

        it('should return the name of the month of the month number that was passed', function () {
            for (var i = 0; i < monthNames.length; i++) {
                expect(this.monthNameFilter(i + 1)).toEqual(monthNames[i]);
            }
        });

        it('should return the name of the month of the date that was passed', function () {
            for (var i = 0; i < monthNames.length; i++) {
                var date = new Date(2015, i, 1, 1, 1, 1, 1);
                expect(this.monthNameFilter(date)).toEqual(monthNames[i]);
            }
        });
    });

    describe('amountFilter', function () {
        beforeEach(inject(function (amountFilter) {
            this.amountFilter = amountFilter;
        }));

        it('should return empty string when input is undefined', function () {
            expect(this.amountFilter()).toEqual('');
        });

        it('should return formatted zero if the input is zero', function () {
            expect(this.amountFilter(0)).toEqual('0.00');
        });

        it('should return formatted amount if the input is non zero', function () {
            expect(this.amountFilter(100)).toEqual('100.00');
        });

        it('should return formatted negative amounts', function () {
            expect(this.amountFilter(-100)).toEqual('- 100.00');
        });

        it('should separate with space when number is greater than 1000', function () {
            expect(this.amountFilter(1000)).toEqual('1 000.00');
        });
    });

    describe('amountNegativePositive', function () {
        beforeEach(inject(function (amountNegativePositiveFilter) {
            this.amountNegativePositiveFilter = amountNegativePositiveFilter;
        }));

        it('should return empty string when input is undefined', function () {
            expect(this.amountNegativePositiveFilter()).toEqual('');
        });

        it('should append + sign when the amount is positive', function () {
            expect(this.amountNegativePositiveFilter(100)).toEqual('+ 100.00');
        });

        it('should return formatted zero if the input is zero', function () {
            expect(this.amountNegativePositiveFilter(0)).toEqual('0.00');
        });

        it('should not append + sign when the amount is negative', function () {
            expect(this.amountNegativePositiveFilter(-100)).toEqual('- 100.00');

        });
        it('should separate with a space number is greater than 1000', function () {
            expect(this.amountNegativePositiveFilter(1000)).toEqual('+ 1 000.00');
        });
    });

    describe('currencyAmountFilter', function () {
        beforeEach(inject(function (currencyAmountFilter) {
            this.currencyAmountFilter = currencyAmountFilter;
        }));

        it('should return empty string when input is undefined', function () {
            expect(this.currencyAmountFilter()).toEqual('');
        });

        it('should return formatted zero if the input is zero', function () {
            expect(this.currencyAmountFilter(0, 'USD')).toEqual('USD 0.00');
        });

        it('should return formatted amount if the input is non zero', function () {
            expect(this.currencyAmountFilter(100, 'USD')).toEqual('USD 100.00');
        });

        it('should return formatted negative amounts', function () {
            expect(this.currencyAmountFilter(-100, 'USD')).toEqual('- USD 100.00');
        });

        it('should separate with space when number is greater than 1000', function () {
            expect(this.currencyAmountFilter(1000000, 'USD')).toEqual('USD 1 000 000.00');
        });
    });

    describe('cellPhoneNumberFilter', function () {
        beforeEach(inject(function (cellPhoneNumberFilter) {
            this.cellPhoneNumberFilter = cellPhoneNumberFilter;
        }));

        it('should remove leading zero', function () {
            expect(this.cellPhoneNumberFilter('07212345670')).toEqual('7212345670');
        });

        it('should not remove zero when it is not a leading number', function () {
            expect(this.cellPhoneNumberFilter('27011')).toEqual('27011');
        });

        it('should remove leading zeros', function () {
            expect(this.cellPhoneNumberFilter('0000101')).toEqual('101');
        });

        it('should return undefined when value is undefined', function () {
            expect(this.cellPhoneNumberFilter(undefined)).toBeUndefined();

        });
    });

    describe('nonNegativeRandAmount', function () {
        var filter;
        beforeEach(inject(function (nonNegativeRandAmountFilter) {
            filter = nonNegativeRandAmountFilter;
        }));

        it('should return empty string when input is undefined', function () {
            expect(filter()).toEqual('');
        });

        it('should return formatted zero if the input is zero', function () {
            expect(filter(0)).toEqual('R 0.00');
        });

        it('should return formatted amount if the input is non zero', function () {
            expect(filter(100)).toEqual('R 100.00');
        });

        it('should return formatted negative amounts', function () {
            expect(filter(-100)).toEqual('R 0.00');
        });

        it('should separate with space when number is greater than 1000', function () {
            expect(filter(1000000)).toEqual('R 1 000 000.00');
        });
    });

    describe('accountLabel', function () {
        beforeEach(inject(function (accountLabelFilter) {
            this.accountLabelFilter = accountLabelFilter;
        }));

        it('should return empty string if account is undefined', function () {
            expect(this.accountLabelFilter(undefined)).toEqual('');
        });

        it('should return custom name and formatted number if custom name exists', function () {
            var account = {
                name: 'An Account Name',
                formattedNumber: '34798598374598437',
                productName: 'ELLITE',
                customName: 'Custom Name'
            };
            expect(this.accountLabelFilter(account)).toEqual('Custom Name - 34798598374598437');
        });


        it('should return account name and formatted number if account name exists', function () {
            var account = {
                name: 'An Account Name',
                formattedNumber: '34798598374598437',
                productName: 'ELLITE'
            };
            expect(this.accountLabelFilter(account)).toEqual('ELLITE - 34798598374598437');
        });

        it('should return just formatted number if no account name exists', function () {
            var account = {
                formattedNumber: '34798598374598437'
            };
            expect(this.accountLabelFilter(account)).toEqual('34798598374598437');
        });
    });

    describe('condenseSpaces', function () {
        beforeEach(inject(function (condenseSpacesFilter) {
            this.condenseSpacesFilter = condenseSpacesFilter;
        }));

        it('should return empty string if input is undefined', function () {
            expect(this.condenseSpacesFilter(undefined)).toEqual('');
        });

        it('should replace all instances of multiple spaces with single space', function () {
            expect(this.condenseSpacesFilter('a  b   c    d     e')).toEqual('a b c d e');
        });
    });

    describe("dayNumberSuffix", function () {
        beforeEach(inject(function (dayNumberSuffixFilter) {
            this.dayNumberSuffixFilter = dayNumberSuffixFilter;
        }));

        it("should append empty string ", function () {
            expect(this.dayNumberSuffixFilter(undefined)).toEqual('');
            expect(this.dayNumberSuffixFilter(33)).toEqual('');
        });

        it("should append st ", function () {
            expect(this.dayNumberSuffixFilter(1)).toEqual('1st');
            expect(this.dayNumberSuffixFilter(21)).toEqual('21st');
            expect(this.dayNumberSuffixFilter(31)).toEqual('31st');
        });

        it("should append nd ", function () {
            expect(this.dayNumberSuffixFilter(2)).toEqual('2nd');
            expect(this.dayNumberSuffixFilter(22)).toEqual('22nd');
        });

        it("should append rd", function () {
            expect(this.dayNumberSuffixFilter(3)).toEqual('3rd');
            expect(this.dayNumberSuffixFilter(23)).toEqual('23rd');
        });

        it("should append th", function () {
            expect(this.dayNumberSuffixFilter(4)).toEqual('4th');
            expect(this.dayNumberSuffixFilter(6)).toEqual('6th');
        });

    });

    describe('currentAccountProductName', function () {

        beforeEach(inject(function (currentAccountProductNameFilter) {
            this.currentAccountProductNameFilter = currentAccountProductNameFilter;
        }));

        it('should remove CURRENT ACCOUNT from ELITE PLUS CURRENT ACCOUNT', function () {
            expect(this.currentAccountProductNameFilter('ELITE PLUS CURRENT ACCOUNT')).toBe('Elite Plus');
        });

        it('should  remove PLUS CURRENT ACCOUNT from PRIVATE BANKING PLUS CURRENT ACCOUNT', function () {
            expect(this.currentAccountProductNameFilter('PRIVATE BANKING PLUS CURRENT ACCOUNT')).toBe('Private Banking');

        });

        it('should  remove  CURRENT ACCOUNT from ELITE CURRENT ACCOUNT', function () {
            expect(this.currentAccountProductNameFilter('ELITE CURRENT ACCOUNT')).toBe('Elite');

        });

    });

    describe('bytes', function () {
        var bytesFilter;

        beforeEach(inject(function (_bytesFilter_) {
            bytesFilter = _bytesFilter_;
        }));

        it('Should format 1023 to 1023.0 Bytes', function () {
            expect(bytesFilter(1023)).toEqual('1023.0 Bytes');
        });

        it('Should format 1025 to 1.0 KB', function () {
            expect(bytesFilter(1025)).toEqual('1.0 KB');
        });

        it('Should format 1024*1024 to 1.0 MB', function () {
            expect(bytesFilter(1024 * 1024)).toEqual('1.0 MB');
        });

        it('Should format 1024*1024*1024 to 1.0 GB', function () {
            expect(bytesFilter(1024 * 1024 * 1024)).toEqual('1.0 GB');
        });

        it('Should format 1024*1024*1024*1024 to 1.0 TB', function () {
            expect(bytesFilter(1024 * 1024 * 1024 * 1024)).toEqual('1.0 TB');
        });

        it('Should format 1024*1024*1024*1024*1024 to 1.0 PB', function () {
            expect(bytesFilter(1024 * 1024 * 1024 * 1024 * 1024)).toEqual('1.0 PB');
        });

        it('Should format invalid number to dash', function () {
            expect(bytesFilter('ada')).toEqual('-');
        });

        it('Should format negative number to dash', function () {
            expect(bytesFilter(-1)).toEqual('-');
        });

        it('Should format infinite number to dash', function () {
            expect(bytesFilter(1 / 0)).toEqual('-');
        });

        it('Should format 0 to 0 Bytes', function () {
            expect(bytesFilter(0.0)).toEqual('0 Bytes');
        });

        it('Should format 1036 to 1.01 KB', function () {
            expect(bytesFilter(1036, 2)).toEqual('1.01 KB');
        });

    });

    describe('formatProductInterestRate', function(){
        beforeEach(inject(function(formatProductInterestRateFilter){
            this.formatProductInterestRateFilter = formatProductInterestRateFilter;
        }));
        describe('greater than or equal to 10', function(){
            it('should format natural numbers to not have decimals', function(){
                expect(this.formatProductInterestRateFilter(10.00)).toEqual('10');
                expect(this.formatProductInterestRateFilter(11)).toEqual('11');
                expect(this.formatProductInterestRateFilter(12)).toEqual('12');
            });

            it('should format decimal numbers to have 2 decimal points', function(){
                expect(this.formatProductInterestRateFilter(11.011)).toEqual('11.01');
                expect(this.formatProductInterestRateFilter(12.016)).toEqual('12.02');
            });
        });

        describe('less than 10', function(){
           it('should format number to have 2 decimal points',function(){
               expect(this.formatProductInterestRateFilter(6)).toEqual('6.00');
               expect(this.formatProductInterestRateFilter(7)).toEqual('7.00');
               expect(this.formatProductInterestRateFilter(8.12)).toEqual('8.12');
               expect(this.formatProductInterestRateFilter(9.126)).toEqual('9.13');
               expect(this.formatProductInterestRateFilter(9.99)).toEqual('9.99');
           });
        });

    });

});

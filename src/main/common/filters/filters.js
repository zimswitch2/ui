(function () {
    'use strict';

    var module = angular.module('refresh.filters', []);

    module.filter('voucherNumber', function () {
        return function (voucherNumber) {
            if (voucherNumber && voucherNumber.trim().length > 0) {
                return voucherNumber.replace(/(\d\d\d\d)(?=(\d))/g, "$1-");
            }
            return '';
        };
    });

    var standardize = function (txt) {
        return txt.replace(/[ \)\(]/g, '').toUpperCase();
    };

    var formatProductInterestRate = function (input) {

        var inputFloat = parseFloat(input);
        var formattedInterestRate = inputFloat.toFixed(2);

        if (inputFloat >= 10 && inputFloat % 1 === 0) {
            formattedInterestRate = inputFloat.toFixed(0);
        }

        return formattedInterestRate;
    };

    var capitalize = function (input, changeOnlyFirstChar) {
        if (!!input) {
            return input.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
                if (_.contains(['OF', 'AND'], standardize(txt))) {
                    return txt.toLowerCase();
                } else {
                    return txt.charAt(0).toUpperCase() + (changeOnlyFirstChar ? txt.substr(1) : txt.substr(1).toLowerCase());
                }
            });
        }
        else {
            return '';
        }
    };

    module.filter('formatProductInterestRate', function () {
        return formatProductInterestRate;
    });

    module.filter('capitalize', function () {
        return capitalize;
    });

    module.filter('capitalizeCountry', function () {
        return function (input) {
            var capitalizedInput = capitalize(input);
            if (!!capitalizedInput) {
                return capitalizedInput.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
                    if ('U.S' === standardize(txt)) {
                        return txt.replace(/\./g, '').toUpperCase();
                    } else if ('D\'IVOIRE' === standardize(txt)) {
                        return 'd\'Ivoire';
                    } else {
                        return txt.replace(/(.*)\.(.*)/g, function (word, word1, word2) {
                            return capitalize(word1 + ', ' + word2);
                        });
                    }
                });
            }
            else {
                return '';
            }
        };
    });

    var formatWithMoment = function (input, format) {
        if (input) {
            var formatted = moment(input).format(format);
            if (formatted === 'Invalid date') {
                return "";
            }
            return formatted;
        }
        return "";
    };

    module.filter('dateFormat', function () {
        return function (input) {
            return formatWithMoment(input, 'D MMMM YYYY');
        };
    });

    module.filter('monthYearDateFormat', function () {
        return function (input) {
            return formatWithMoment(input, 'MMMM YYYY');
        };
    });

    module.filter('monthName', function () {
        return function (input) {
            if (input) {
                var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
                    "October", "November", "December"];
                if (typeof input.getMonth === 'function') {
                    return monthNames[input.getMonth()];
                } else if (!isNaN(input) && input > 0 && input < 13) {
                    return monthNames[input - 1];
                }
            }
            return input;
        };
    });

    module.filter('timeFormat', function () {
        return function (input) {
            return formatWithMoment(input, 'HH:mm:ss');
        };
    });

    module.filter('dateTimeFormat', function () {
        return function (input) {
            return formatWithMoment(input, 'D MMMM YYYY HH:mm:ss');
        };
    });

    module.filter('addressLines', function () {
        var blank = function (value) {
            return !value;
        };

        return function (input) {
            input = input || {};

            var lines = [input.unitNumber, input.building, input.streetPOBox, input.suburb, input.cityTown];
            _.remove(lines, blank);
            return _(lines).join(', ');
        };
    });

    module.filter('yearMonth', function () {
        return function (year, month) {
            function format(number, description) {
                if (number === 0) {
                    return [];
                }

                return number === 1 ? [number + ' ' + description] : [number + ' ' + description + 's'];
            }

            return format(year, 'year').concat(format(month, 'month')).join(' ');
        };
    });

    var formatAmount = function (currencyFilter, prefix, amount) {
        if (!amount && amount !== 0) {
            return '';
        }

        var currency = currencyFilter(amount, prefix);
        currency = currency.replace(/,/g, ' ');

        if (amount < 0) {
            currency = currency.replace('(', '-');
            currency = currency.replace(')', '');
        }

        if (currency.indexOf('-') > -1) {
            currency = currency.replace('-', '- ');
        }

        return currency;
    };

    module.filter('randAmount', function (currencyFilter) {
        return function (input) {
            return formatAmount(currencyFilter, 'R ', input);
        };
    });

    module.filter('randAmountNoCents', function (currencyFilter) {
        return function (input) {
            var randAmountFilteredValue = formatAmount(currencyFilter, 'R ', input);
            return randAmountFilteredValue.replace(/\.[0-9]{2}/, '');
        };
    });

    module.filter('absoluteRandAmount', function (currencyFilter) {
        return function (input) {
            return formatAmount(currencyFilter, 'R ', Math.abs(input));
        };
    });

    module.filter('amount', function (currencyFilter) {
        return function (input) {
            return formatAmount(currencyFilter, '', input);
        };
    });

    module.filter('nonNegativeRandAmount', function (currencyFilter) {
        return function (input) {
            return formatAmount(currencyFilter, 'R ', input < 0 ? 0 : input);
        };
    });

    module.filter('currencyAmount', function (currencyFilter) {
        return function (input, currencyCode) {
            return formatAmount(currencyFilter, currencyCode + ' ', input);
        };
    });

    module.filter('accountLabel', function () {
        return function (account) {
            if (account) {
                if (account.customName) {
                    return account.customName + ' - ' + account.formattedNumber;
                }
                if (account.productName) {
                    return account.productName + ' - ' + account.formattedNumber;
                } else {
                    return account.formattedNumber;
                }
            }
            return '';
        };
    });

    module.filter('condenseSpaces', function () {
        return function (input) {
            if (input) {
                return input.replace(/\s{2,}/g, ' ');
            }
            return '';
        };
    });

    module.filter('cellPhoneNumber', function () {
        return function (number) {
            if (number) {
                return number.replace(/^0+/, '');
            }
            return number;
        };
    });

    module.filter('dayNumberSuffix', function () {
        return function (input) {

            if (!input || input > 31) {
                return '';
            }
            if (input === 1 || input === 21 || input === 31) {
                return input + "st";
            }
            if (input === 2 || input === 22) {
                return input + "nd";
            }

            if (input === 3 || input === 23) {
                return input + "rd";
            }
            return input + "th";
        };
    });

    module.filter('currentAccountProductName', function () {
        return function (input) {
            var privateBankingPlusAccount = 'PRIVATE BANKING PLUS CURRENT ACCOUNT';
            var isPrivateBankingPlusAccount = input.toUpperCase() === privateBankingPlusAccount;

            var toBeDeleted = isPrivateBankingPlusAccount ? ' PLUS CURRENT ACCOUNT' : ' CURRENT ACCOUNT';
            return capitalize(input.toUpperCase().replace(toBeDeleted, ''));
        };
    });

    module.filter('bytes', function () {
        return function (bytes, precision) {
            var value = parseFloat(bytes);
            if (isNaN(value) || !isFinite(bytes) || bytes < 0) {
                return '-';
            } else if (value === 0) {
                return '0 Bytes';
            }
            precision = precision || 1;
            var units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'],
                number = Math.floor(Math.log(bytes) / Math.log(1024));
            return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
        };
    });

    module.filter('amountNegativePositive', function (currencyFilter) {
        return function (input) {
            return formatAmountToIncludePositiveNegativeSigns(currencyFilter, '', input);
        };
    });

    var formatAmountToIncludePositiveNegativeSigns = function (currencyFilter, prefix, amount) {
        if (!amount && amount !== 0) {
            return '';
        }

        var currency = currencyFilter(amount, prefix);
        currency = currency.replace(/,/g, ' ');

        if (amount < 0) {
            currency = currency.replace('(', '-');
            currency = currency.replace(')', '');
        }

        if(amount > 0) {
            currency = '+ ' + currency;
        }

        if (currency.indexOf('-') > -1) {
            currency = currency.replace('-', '- ');
        }

        return currency;
    };

}());
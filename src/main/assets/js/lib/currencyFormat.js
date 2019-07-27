var currency = (function () {
    var is_number = /[0-9]/;

    var defaultOptions =
    {
        prefix: 'R ',
        suffix: '',
        centsSeparator: '.',
        thousandsSeparator: ',',
        limit: false,
        centsLimit: 2,
        clearPrefix: false,
        clearSuffix: false,
        allowNegative: false,
        insertPlusSign: false,
        clearOnEmpty: false
    };

    var prefix = defaultOptions.prefix;
    var suffix = defaultOptions.suffix;
    var centsSeparator = defaultOptions.centsSeparator;
    var thousandsSeparator = defaultOptions.thousandsSeparator;
    var limit = defaultOptions.limit;
    var centsLimit = defaultOptions.centsLimit;
    var allowNegative = defaultOptions.allowNegative;
    var insertPlusSign = defaultOptions.insertPlusSign;
    var clearOnEmpty = defaultOptions.clearOnEmpty;

    // format to fill with zeros to complete cents chars
    function fill_with_zeroes(str) {
        while (str.length < (centsLimit + 1)) str = '0' + str;
        return str;
    }

    // skip everything that isn't a number
    // and also skip the left zeroes
    function to_numbers(str) {
        var formatted = '';
        for (var i = 0; i < (str.length); i++) {
            char_ = str.charAt(i);
            if (formatted.length == 0 && char_ == 0) char_ = false;

            if (char_ && char_.match(is_number)) {
                if (limit) {
                    if (formatted.length < limit) formatted = formatted + char_;
                }
                else {
                    formatted = formatted + char_;
                }
            }
        }

        return formatted;
    }

    function doFormat(str, ignore) {
        if (!ignore && (str === '' || str == doFormat('0', true)) && clearOnEmpty)
            return '';

        // formatting settings
        var formatted = fill_with_zeroes(to_numbers(str));
        var thousandsFormatted = '';
        var thousandsCount = 0;

        // Checking CentsLimit
        if (centsLimit == 0) {
            centsSeparator = "";
            centsVal = "";
        }

        // split integer from cents
        var centsVal = formatted.substr(formatted.length - centsLimit, centsLimit);
        var integerVal = formatted.substr(0, formatted.length - centsLimit);

        // apply cents pontuation
        formatted = (centsLimit == 0) ? integerVal : integerVal + centsSeparator + centsVal;

        // apply thousands pontuation
        if (thousandsSeparator || _.trim(thousandsSeparator) != "") {
            for (var j = integerVal.length; j > 0; j--) {
                char_ = integerVal.substr(j - 1, 1);
                thousandsCount++;
                if (thousandsCount % 3 == 0) char_ = thousandsSeparator + char_;
                thousandsFormatted = char_ + thousandsFormatted;
            }

            //
            if (thousandsFormatted.substr(0, 1) == thousandsSeparator) thousandsFormatted = thousandsFormatted.substring(1, thousandsFormatted.length);
            formatted = (centsLimit == 0) ? thousandsFormatted : thousandsFormatted + centsSeparator + centsVal;
        }

        // if the string contains a dash, it is negative - add it to the begining (except for zero)
        if (allowNegative && (integerVal != 0 || centsVal != 0)) {
            if (str.indexOf('-') != -1 && str.indexOf('+') < str.indexOf('-')) {
                formatted = '-' + formatted;
            }
            else {
                if (!insertPlusSign)
                    formatted = '' + formatted;
                else
                    formatted = '+' + formatted;
            }
        }

        // apply the prefix
        if (prefix) formatted = prefix + formatted;

        // apply the suffix
        if (suffix) formatted = formatted + suffix;

        return formatted;
    }

    var doUnformat = function (amount) {
        if (!amount) {
            return amount;
        }
        amount = amount.replace(new RegExp("^" + prefix), '');
        amount = amount.replace(/,/g, '');
        amount = amount.replace(/ /g, '');
        return parseFloat(amount);
    };

    return {
        unformat: doUnformat,
        format: doFormat
    }
}());

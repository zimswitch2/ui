var rowFieldHelper = function () {
    var Promise = require('bluebird');

    var getRowLabelAndValue = function (row) {
        return Promise
            .settle([ row.element(by.css('.field-label')).getText(), row.element(by.css('.field-value')).getText() ])
            .spread(function(labelPromiseStatus, valuePromiseStatus){
                return {
                    label: labelPromiseStatus.isFulfilled() ? labelPromiseStatus.value() : '',
                    value: valuePromiseStatus.isFulfilled() ? valuePromiseStatus.value() : ''
                };
            });
    };

    var getRowFields = function (parentElement) {
        return (parentElement || element).all(by.css('.row-field')).then(function (rows) {
            return Promise.all(rows.map(getRowLabelAndValue));
        });
    };

    return {
        getRowFields: getRowFields
    };
};

module.exports = rowFieldHelper();
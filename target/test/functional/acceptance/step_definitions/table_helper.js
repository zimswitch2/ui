var tableHelper = function () {
    var expect = require('./expect');
    var Promise = require('bluebird');
    var _ = require("lodash");
    var moment = require('moment');


    var dateFormat = function (input, format) {
        if (input) {
            var formatted = moment(input).format(format);
            if (formatted === 'Invalid date') {
                return "";
            }
            return formatted;
        }
        return "";
    };

    var expectRowToMatch = function (target, expectation) {
        Object.keys(expectation).forEach(function (key, i) {
            expect(target[key], 'On row ' + i + ' ').to.equal(expectation[key]);
        });
    };

    var getTableRows = function (tableRowsSelector, propertyToCssMap) {
        var getRowAsHash = function (row) {
            var properties = Object.keys(propertyToCssMap);
            var fieldText = properties.map(function (field) {
                return getFieldText(row, field).then(function (fieldText) {
                    var r = {};
                    r[field] = fieldText;

                    return r;
                });
            });

            return Promise.all(fieldText).then(function (fields) {
                return fields.reduce(function (o, field) {
                    return _.assign(o, field);
                }, {});
            });
        };

        var getFieldText = function (row, field) {
            var css = propertyToCssMap[field];

            return row.element(by.css(css)).getText();
        };

        return element.all(by.css(tableRowsSelector))
            .then(function (rows) {
                return Promise.all(rows.map(getRowAsHash));
            });
    };

    var expectRowsToMatch = function expectRowsToMatch(targetRows, expectedRows) {
        expectedRows.forEach(function (expectedRow, i) {
            expectRowToMatch(targetRows[i], expectedRow);
        });
    };
    var getAndExpectRowsToMatch = function (selectorDetails, expectedRows) {
        return getTableRows(selectorDetails.rowSelector, selectorDetails.cssPropertyMap).then(function (targetRows) {
            expectRowsToMatch(targetRows, expectedRows);
        });
    };

    var expectContentToMatch = function (tableRowsSelector, propertyToCssMap, expectedContent) {
        var rows = expectedContent.hashes();
        return getTableRows(tableRowsSelector, propertyToCssMap)
            .then(function (targetRows) {
                expect(targetRows.length, 'Mismatched number of rows').to.equal(rows.length);

                rows.forEach(function (expectedRow, i) {
                    expectRowToMatch(targetRows[i], expectedRow);
                });
            });
    };

    return {
        expectRowToMatch: expectRowToMatch,
        getTableRows: getTableRows,
        getAndExpectRowsToMatch: getAndExpectRowsToMatch,
        expectContentToMatch: expectContentToMatch,
        dateFormat: dateFormat
    };
};

module.exports = tableHelper();
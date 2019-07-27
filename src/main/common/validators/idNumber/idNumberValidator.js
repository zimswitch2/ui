(function() {
    'use strict';

    angular
        .module('refresh.validators.idNumber')
        .factory('IdNumber', function() {

            function sumString(text) {
                return _.reduce(text, function(memo, num) {
                    return parseInt(memo) + parseInt(num);
                }, 0);
            }

            function calculateCheckDigit(idNumber) {
                var evenDigit = (idNumber[1] + idNumber[3] + idNumber[5] + idNumber[7] + idNumber[9] + idNumber[11]) * 2;
                var evenSum = sumString(evenDigit.toString());
                var oddSum = sumString(idNumber[0] + idNumber[2] + idNumber[4] + idNumber[6] + idNumber[8] + idNumber[10]);
                return ((10 - (oddSum + evenSum) % 10) % 10).toString();
            }

            function birthDate(idNumber) {
                var firstDigit = parseInt(_.first(idNumber));
                return (firstDigit <= 2 ? '20' : '19') + idNumber.substr(0, 6);
            }

            function hasValidBirthDate(idNumber) {
                return moment(birthDate(idNumber), 'YYYYMMDD').isValid();
            }

            function hasValid11thDigit(idNumber) {
                return '012'.indexOf(idNumber[10]) >= 0;
            }

            function hasValidCheckDigit(idNumber) {
                return calculateCheckDigit(idNumber) === idNumber[12];
            }

            return {
                hasValidBirthDate: hasValidBirthDate,
                hasValid11thDigit: hasValid11thDigit,
                hasValidCheckDigit: hasValidCheckDigit,
                birthDate: birthDate
            };
        });
})();

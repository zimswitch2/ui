describe('IdNumber', function() {
    'use strict';
    var idNumber;

    beforeEach(module('refresh.validators.idNumber'));

    beforeEach(inject(function(IdNumber) {
        idNumber = IdNumber;
    }));

    describe('check digit validation', function() {
        it('is false for an id number with a wrong check digit', function() {
            expect(idNumber.hasValidCheckDigit('8006212361189')).toBeFalsy();
        });

        it('is false for an incorrect id number', function() {
            expect(idNumber.hasValidCheckDigit('7006212361181')).toBeFalsy();
        });

        it('is true for a correct id number', function() {
            expect(idNumber.hasValidCheckDigit('8006212361181')).toBeTruthy();
        });
    });

    describe('11th digit validation', function() {
        it('is false for an id number with an 11th digit that is greater than 2', function() {
            expect(idNumber.hasValid11thDigit('0000000000300')).toBeFalsy();
        });

        it('is true for an id number with an 11th digit that is 0', function() {
            expect(idNumber.hasValid11thDigit('0000000000000')).toBeTruthy();
        });

        it('is true for an id number with an 11th digit that is 1', function() {
            expect(idNumber.hasValid11thDigit('0000000000100')).toBeTruthy();
        });

        it('is true for an id number with an 11th digit that is 2', function() {
            expect(idNumber.hasValid11thDigit('0000000000200')).toBeTruthy();
        });
    });

    describe('birthdate validation', function() {
        it('is false for an invalid birthdate in the id number', function() {
            expect(idNumber.hasValidBirthDate('9090900000000')).toBeFalsy();
        });

        it('is true for a valid birthdate in the id number', function() {
            expect(idNumber.hasValidBirthDate('9001010000000')).toBeTruthy();
        });
    });

    describe('birthdate from id number', function() {
        it('returns the birthdate starting with 20 from an id number starting with 2', function() {
            expect(idNumber.birthDate('2001010000000')).toBe('20200101');
        });

        it('returns the birthdate starting with 20 from an id number starting with 1', function() {
            expect(idNumber.birthDate('1001010000000')).toBe('20100101');
        });

        it('returns the birthdate starting with 20 from an id number starting with 0', function() {
            expect(idNumber.birthDate('0001010000000')).toBe('20000101');
        });

        it('returns the birthdate starting with 19 from an id number starting with 9', function() {
            expect(idNumber.birthDate('9001010000000')).toBe('19900101');
        });

        it('returns the birthdate starting with 19 from an id number starting with 8', function() {
            expect(idNumber.birthDate('8001010000000')).toBe('19800101');
        });

        it('returns the birthdate starting with 19 from an id number starting with 7', function() {
            expect(idNumber.birthDate('7001010000000')).toBe('19700101');
        });

        it('returns the birthdate starting with 19 from an id number starting with 6', function() {
            expect(idNumber.birthDate('6001010000000')).toBe('19600101');
        });

        it('returns the birthdate starting with 19 from an id number starting with 5', function() {
            expect(idNumber.birthDate('5001010000000')).toBe('19500101');
        });

        it('returns the birthdate starting with 19 from an id number starting with 4', function() {
            expect(idNumber.birthDate('4001010000000')).toBe('19400101');
        });

        it('returns the birthdate starting with 19 from an id number starting with 3', function() {
            expect(idNumber.birthDate('3001010000000')).toBe('19300101');
        });
    });
});

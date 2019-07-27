describe('amount factory', function () {
    var amountValidator;
    beforeEach(module('refresh.sbForm', 'refresh.fixture', 'refresh.test'));

    beforeEach(inject(function (_amountKeyCodeValidator_) {
        amountValidator = _amountKeyCodeValidator_;
    }));

    describe('invalid keycode', function () {

        it('should allow periods', function () {
            expect(amountValidator.invalidKeyCode(110, '')).toBeFalsy();
            expect(amountValidator.invalidKeyCode(190, '')).toBeFalsy();
        });

        it('should invalidate more than one period', function () {
            expect(amountValidator.invalidKeyCode(110, '33.')).toBeTruthy();
            expect(amountValidator.invalidKeyCode(190, '33.')).toBeTruthy();
        });

        it('should validate digits', function () {
            for (var keyCode = 48; keyCode <= 57; keyCode++) {
                expect(amountValidator.invalidKeyCode(keyCode, '')).toBeFalsy();
            }
        });

        it('should validate numpad digits', function () {
            for (var keyCode = 96; keyCode <= 105; keyCode++) {
                expect(amountValidator.invalidKeyCode(keyCode, '')).toBeFalsy();
            }
        });

        it('should not allow any other characters', function () {
            expect(amountValidator.invalidKeyCode(134, '')).toBeTruthy();
        });

        it('should always allow navigation keys', function () {
            var validActionKeys = {
                backspace: 8,
                tab: 9,
                enter: 13,
                delete: 46,
                leftArrow: 37,
                rightArrow: 39,
                end: 35,
                home: 36
            };

            _.each(_.values(validActionKeys), function (keyCode) {
                expect(amountValidator.invalidKeyCode(keyCode, '')).toBeFalsy();
            });
        });
    });

    describe('unwanted period key', function (){
        var period = 190;
        it('should consider period as invalid when noDecimal flag is true', function () {
            expect(amountValidator.invalidPeriodKey(period, true)).toBeTruthy();
        });

        it('should consider period as valid when noDecimal flag is set to false', function () {
            expect(amountValidator.invalidPeriodKey(period, false)).toBeFalsy();
        });

        it('should consider period as valid when sent key code is not period', function () {
            var leftArrow = 37;
            expect(amountValidator.invalidPeriodKey(leftArrow, false)).toBeFalsy();
        });

    });
});

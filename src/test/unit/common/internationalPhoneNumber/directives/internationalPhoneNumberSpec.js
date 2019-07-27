describe('international phone number directive', function () {
    'use strict';

    beforeEach(module('refresh.internationalPhoneNumber', 'refresh.test', 'ngMessages'));

    var lookups;

    beforeEach(function () {
        lookups = {
            dialingCodes: {
                promise: function () {
                    return mock.resolve(
                        [
                            {internationalDialingCode: '27 ', description: 'South Africa', countryCode: 'ZAF'},
                            {internationalDialingCode: '44', description: 'United Kingdom', countryCode: 'GBR'},
                            {internationalDialingCode: '263', description: 'Zimbabwe', countryCode: 'ZWE'},
                            {internationalDialingCode: '7', description: 'Russian Federation', countryCode: 'aa'}
                        ]
                    );
                }
            }
        };
        module(function ($provide) {
            $provide.value('LookUps', lookups);
        });

    });

    var templateTest, parentScope, document, directiveScope, mock;

    describe('create', function () {
        beforeEach(inject(function (TemplateTest, _mock_) {
            templateTest = TemplateTest;
            parentScope = templateTest.scope;
            mock = _mock_;
            templateTest.allowTemplate('common/internationalPhoneNumber/partials/internationalPhoneNumber.html');
            templateTest.allowTemplate('common/typeahead/partials/typeahead.html');
            document =
                templateTest.compileTemplate('<form><international-phone-number ng-model="asd"></international-phone-number></form>');
            directiveScope = document.find('international-phone-number').isolateScope();
        }));

        describe('simple contents', function () {
            it('should have country code span', function () {
                expect(document.find('span#internationalDialingCode').length).toBe(1);
            });

            it('should have an input for cell phone number', function () {
                expect(document.find('input#cellPhoneNumber').length).toBe(1);
            });

            it('should have a div with the country type ahead', function () {
                expect(document.find('div>sb-typeahead#country').length).toBe(1);
            });
        });

        describe('countries values', function () {
            it('should have country code objects with label function', function () {
                expect(directiveScope.countryDialingCodes.length).toBe(4);
                expect(directiveScope.countryDialingCodes[0].label()).toBe('South Africa +27');
                expect(directiveScope.countryDialingCodes[1].label()).toBe('United Kingdom +44');
            });
        });

        describe('changing the phone number', function () {
            var document, directiveScope;
            beforeEach(function () {
                parentScope.contactDetails = {};
                document =
                    templateTest.compileTemplate('<form><international-phone-number ng-model="contactDetails"></international-phone-number></form>');

                directiveScope = document.find('international-phone-number').isolateScope();
            });

            it('should have value when only the dialling code dropdown is defined', function () {
                directiveScope.country = directiveScope.countryDialingCodes[0];
                directiveScope.changePhoneNumber();
                expect(parentScope.contactDetails).toEqual({
                    countryCode: 'ZAF',
                    internationalDialingCode: '27',
                    cellPhoneNumber: undefined
                });
            });

            it('should have undefined country code and dialing when country is undefined', function () {
                directiveScope.country = undefined;
                directiveScope.changePhoneNumber();
                expect(parentScope.contactDetails).toEqual({
                    countryCode: undefined,
                    internationalDialingCode: undefined,
                    cellPhoneNumber: undefined
                });
            });

            it('should only have a value when the dialling code dropdown and the phone number input are defined', function () {
                var expectedContactDetails = {countryCode: 'ZAF', internationalDialingCode: '27', cellPhoneNumber: '12345678'};
                directiveScope.country = directiveScope.countryDialingCodes[0];
                directiveScope.phoneNumber = '12345678';
                directiveScope.changePhoneNumber();
                expect(parentScope.contactDetails).toEqual(expectedContactDetails);
            });

            it('should not use a leading zero in the phone number for non-SA', function () {
                var expectedContactDetails = {countryCode: 'GBR', internationalDialingCode: '44', cellPhoneNumber: '12345678'};
                directiveScope.country = directiveScope.countryDialingCodes[1];
                directiveScope.phoneNumber = '012345678';
                directiveScope.changePhoneNumber();
                expect(parentScope.contactDetails).toEqual(expectedContactDetails);
            });

            it('should return contact details for non-sa and uk', function () {
                var expectedContactDetails = {countryCode: 'ZWE', internationalDialingCode: '263', cellPhoneNumber: '12345678'};
                directiveScope.country = directiveScope.countryDialingCodes[2];
                directiveScope.phoneNumber = '012345678';
                directiveScope.changePhoneNumber();
                expect(parentScope.contactDetails).toEqual(expectedContactDetails);
            });


            it('should keep the leading 0 for SA', function () {
                var expectedContactDetails = {countryCode: 'ZAF', internationalDialingCode: '27', cellPhoneNumber: '012345678'};
                directiveScope.country = _.find(directiveScope.countryDialingCodes, {internationalDialingCode: '27'});
                directiveScope.phoneNumber = '012345678';
                directiveScope.changePhoneNumber();
                expect(parentScope.contactDetails).toEqual(expectedContactDetails);
            });

            it('should warn when phone number starts with dialling code', function () {
                var expectedContactDetails = {
                    countryCode: 'ZAF',
                    internationalDialingCode: '27',
                    cellPhoneNumber: '2712345678'
                };
                directiveScope.country = directiveScope.countryDialingCodes[0];
                directiveScope.phoneNumber = '2712345678';
                directiveScope.changePhoneNumber();
                expect(parentScope.contactDetails).toEqual(expectedContactDetails);
                expect(directiveScope.warningMessage).toBeTruthy();
            });

            it('should display max length error when total length is longer than 15', function () {
                directiveScope.country = {internationalDialingCode: '44'};
                document.find('input').controller('ngModel').$setViewValue('4412345678546465');
                directiveScope.changePhoneNumber();
                directiveScope.$apply();
                expect(document.find('ng-messages:not(.ng-hide) ng-message.input-length').text()).toEqual('Cannot be longer than 15 numbers');
            });

            it('should display min length error when total length is shorter than 3', function () {
                directiveScope.country = {internationalDialingCode: '7'};
                document.find('input').controller('ngModel').$setViewValue('1');
                directiveScope.changePhoneNumber();
                directiveScope.$apply();
                expect(document.find('ng-messages:not(.ng-hide) ng-message.input-length').text()).toEqual('Must be longer than 1 numbers');
            });

        });

        describe('default to south africa', function () {
            it('should have south africa selected', function () {
                expect(directiveScope.country.internationalDialingCode).toBe('27');
                expect(directiveScope.country.description).toEqual('South Africa');
            });
        });

        describe('when type ahead is changed', function () {
            var countyButton, typeAhead, typeAheadInput;
            beforeEach(function () {
                countyButton = document.find('span#internationalDialingCode');
                typeAhead = document.find('div#countrySelector');
                typeAheadInput = document.find('input#country-input');
            });

            it('should not display type ahead when value is selected', function () {
                expect(typeAhead.hasClass('ng-hide')).toBeTruthy();
                countyButton.click();
                expect(typeAhead.hasClass('ng-hide')).toBeFalsy();

                templateTest.changeInputValueTo(typeAheadInput, "263");
                typeAhead.find('li').first().mousedown();

                expect(typeAhead.hasClass('ng-hide')).toBeTruthy();
            });

            it('should still display type ahead when value is cleared', function () {
                expect(typeAhead.hasClass('ng-hide')).toBeTruthy();
                countyButton.click();
                expect(typeAhead.hasClass('ng-hide')).toBeFalsy();

                typeAhead.find('.close').click();

                expect(typeAhead.hasClass('ng-hide')).toBeFalsy();
            });

            it('should not clear country code when type ahead is cleared', function () {
                countyButton.click();
                templateTest.changeInputValueTo(typeAheadInput, directiveScope.countryDialingCodes[1].internationalDialingCode);
                typeAhead.find('li').first().mousedown();
                typeAhead.find('.close').click();
                expect(directiveScope.selectedCountry).toBeUndefined();
                expect(directiveScope.country).toEqual(directiveScope.countryDialingCodes[1]);
            });

            describe('non-SA', function () {
                    it('should display max length error when total length is longer than 17', function () {
                        document.find('input').controller('ngModel').$setViewValue('123456789012345');
                        directiveScope.country = {internationalDialingCode: '263'};
                        directiveScope.changePhoneNumber();
                        directiveScope.$apply();
                        expect(document.find('ng-messages:not(.ng-hide) ng-message.input-length').text()).toEqual('Cannot be longer than 14 numbers');
                    });

                    it('should display min length error when total length is shorter than 3', function () {
                        document.find('input').controller('ngModel').$setViewValue('2');
                        directiveScope.country = {internationalDialingCode: '7'};
                        directiveScope.changePhoneNumber();
                        directiveScope.$apply();
                        expect(document.find('ng-messages:not(.ng-hide) ng-message.input-length').text()).toEqual('Must be longer than 1 numbers');
                    });
                }
            );

            describe('SA', function () {
                    beforeEach(function () {
                        directiveScope.country = {internationalDialingCode: '27'};
                    });

                    it('should display exact length error when phone number is not started with 0, and not exactly 9 numbers',
                        function () {
                            document.find('input').controller('ngModel').$setViewValue('1234567890');
                            directiveScope.changePhoneNumber();
                            directiveScope.$apply();
                            expect(document.find('ng-messages:not(.ng-hide) ng-message.input-length').text()).toEqual('Must be 9 numbers long');
                        });

                    it('should display exact length error when phone number is started with 0, and not exactly 10 numbers',
                        function () {
                            document.find('input').controller('ngModel').$setViewValue('01234567');
                            directiveScope.changePhoneNumber();
                            directiveScope.$apply();
                            expect(document.find('ng-messages:not(.ng-hide) ng-message.input-length').text()).toEqual('Must be 10 numbers long');
                        });
                }
            );
        });

        describe('up and down arrows on clickable span', function () {
            it('should have down arrow when type ahead is hidden', function () {
                expect(document.find('span#internationalDialingCode>i').hasClass('icomoon-chevron-down')).toBeTruthy();
            });

            it('should have up arrow when type ahead is displayed', function () {
                document.find('span#internationalDialingCode').click();
                expect(document.find('div#countrySelector').hasClass('ng-hide')).toBeFalsy();
                expect(document.find('span#internationalDialingCode>i').hasClass('icomoon-chevron-up')).toBeTruthy();
            });
        });

        describe('warning message', function () {

            beforeEach(function () {
                directiveScope.phoneNumber = '27';
                directiveScope.country = directiveScope.countryDialingCodes[0];
                directiveScope.changePhoneNumber();
                directiveScope.$apply();
            });
            it('should show warning message', function () {
                expect(document.find('span#warningMessage').hasClass('ng-hide')).toBeFalsy();
            });

            it('should hide warning message', function () {
                document.find('span#internationalDialingCode').click();
                expect(document.find('span#warningMessage').hasClass('ng-hide')).toBeTruthy();
            });
        });

        describe('showing and hiding the type ahead', function () {
            it('should hide type ahead when span is clicked', function () {
                expect(document.find('div#countrySelector').hasClass('ng-hide')).toBeTruthy();
                document.find('span#internationalDialingCode').click();
                expect(document.find('div#countrySelector').hasClass('ng-hide')).toBeFalsy();
                document.find('span#internationalDialingCode').click();
                expect(document.find('div#countrySelector').hasClass('ng-hide')).toBeTruthy();
            });
        });
    });

    describe('modify', function () {
        beforeEach(inject(function (TemplateTest, _mock_) {
            templateTest = TemplateTest;
            parentScope = templateTest.scope;
            mock = _mock_;
            templateTest.allowTemplate('common/internationalPhoneNumber/partials/internationalPhoneNumber.html');
            templateTest.allowTemplate('common/typeahead/partials/typeahead.html');

            parentScope.contactDetails = {
                countryCode: 'Zwe',
                internationalDialingCode: '263',
                cellPhoneNumber: '12345678'
            };

            document =
                templateTest.compileTemplate('<form><international-phone-number ng-model="contactDetails"></international-phone-number></form>');
            directiveScope = document.find('international-phone-number').isolateScope();
        }));

        describe('on initializing contact details', function () {
            var contactDetails = {
                countryCode: 'Zwe',
                internationalDialingCode: '263',
                cellPhoneNumber: '12345678'
            };
            it('should change country', function () {
                directiveScope.initialize(directiveScope.countryDialingCodes, contactDetails);
                expect(directiveScope.country.internationalDialingCode).toEqual('263');
                expect(directiveScope.country.description).toEqual('Zimbabwe');
            });
        });

        describe('on changing model value', function () {
            it('should propegate the change to the view', function () {
                parentScope.contactDetails = {
                    countryCode: 'Zwe',
                    internationalDialingCode: '263',
                    cellPhoneNumber: '12345678'
                };
                parentScope.$digest();

                expect(directiveScope.phoneNumber).toEqual('12345678');
            });
        });
    });
});

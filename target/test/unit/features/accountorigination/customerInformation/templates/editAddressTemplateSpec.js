describe('customer information - edit addresses', function () {
    'use strict';

    var scope, document, test, fixture, CustomerInformationData;

    function expectElementIsExisting(element, elementId) {
        expect(element.find(elementId).length).toEqual(1);
    }

    function expectElementIsNotExisting(element, elementId) {
        expect(element.find(elementId).length).toEqual(0);
    }

    function compileTemplate() {
        test.allowTemplate('features/accountorigination/customerInformation/partials/existingCustomerModal.html');
        test.allowTemplate('features/accountorigination/common/directives/partials/cancelConfirmation.html');
        test.allowTemplate('common/flow/partials/flow.html');
        test.allowTemplate('common/sbform/partials/rowField.html');
        test.allowTemplate('common/sbform/partials/sbTextInput.html');
        var html = test.addRootNodeToDocument(fixture.load('base/main/features/accountorigination/customerInformation/partials/editAddress.html'));
        document = test.compileTemplate('<form>' + html + '</form>');
    }

    beforeEach(module(
        'refresh.accountOrigination.customerInformation.edit.address',
        'refresh.accountOrigination.domain.customer',
        function ($provide) {
            $provide.value('LookUps', {});
        }));

    beforeEach(inject(function (TemplateTest, Fixture, LookUps, mock, _CustomerInformationData_) {
        function PromiseLookUp(values) {
            return {
                promise: function () {
                    return mock.resolve(values);
                },
                values: function () {
                    return values;
                }
            };
        }

        LookUps.residentialStatus = new PromiseLookUp([{code: '01', description: 'Owner'}]);

        scope = TemplateTest.scope;
        CustomerInformationData = _CustomerInformationData_;
        scope.customerInformationData = CustomerInformationData.initialize({});
        scope.LogoutController = function () {
        };
        scope.$digest();
        test = TemplateTest;
        fixture = Fixture;

        compileTemplate();
    }));

    describe('when editing residential and postal address', function () {
        beforeEach(function () {
            compileTemplate();
        });

        it('should have all residential address fields', function () {
            var homeAddressSection = document.find('#homeAddressSection');
            expectElementIsExisting(homeAddressSection, 'row-field[label="Unit Number"]');
            expectElementIsExisting(homeAddressSection, 'row-field[label="Complex/Flat"]');
            expectElementIsExisting(homeAddressSection, 'row-field[label="Street *"]');
            expectElementIsExisting(homeAddressSection, 'row-field[label="Suburb *"]');
            expectElementIsExisting(homeAddressSection, 'row-field[label="City/town *"]');
            expectElementIsExisting(homeAddressSection, 'row-field[label="Postal Code *"]');
            expectElementIsExisting(homeAddressSection, 'row-field[label="Residential Status *"]');
        });

        it('should show "Same as home address" radio buttons"', function () {
            var postalAddressSection = document.find('.second-section');
            expectElementIsExisting(postalAddressSection, 'row-field[label="Same as home address *"]');
            expectElementIsExisting(postalAddressSection, '#samePostalAndHomeAddress-yes');
            expectElementIsExisting(postalAddressSection, '#samePostalAndHomeAddress-no');
        });

        describe('when residential and postal addresses are different', function () {
            beforeEach(function () {
                scope.isSamePostalAndResidential = false;
                compileTemplate();
            });

            it('should show postal address fields', function () {
                var postalAddressSection = document.find('.second-section');
                expectElementIsExisting(postalAddressSection, 'row-field[label="Unit Number"]');
                expectElementIsExisting(postalAddressSection, 'row-field[label="Complex/Flat"]');
                expectElementIsExisting(postalAddressSection, 'row-field[label="Street/PO Box *"]');
                expectElementIsExisting(postalAddressSection, 'row-field[label="Suburb *"]');
                expectElementIsExisting(postalAddressSection, 'row-field[label="City/town *"]');
                expectElementIsExisting(postalAddressSection, 'row-field[label="Postal Code *"]');
            });

            it('should have "Same as home address" no radio button selected', function () {
                expect(document.find('#samePostalAndHomeAddress-yes').is(':checked')).toBeFalsy();
                expect(document.find('#samePostalAndHomeAddress-no').is(':checked')).toBeTruthy();
            });
        });

        describe('when residential and postal addresses match', function () {
            beforeEach(function () {
                scope.isSamePostalAndResidential = true;
                compileTemplate();
            });

            it('should not show postal address fields if same postal and home address is set to yes', function () {
                scope.isSamePostalAndResidential = true;
                compileTemplate();

                var postalAddressSection = document.find('.second-section');
                expectElementIsNotExisting(postalAddressSection, 'row-field[label="Unit Number"]');
                expectElementIsNotExisting(postalAddressSection, 'row-field[label="Complex/Flat"]');
                expectElementIsNotExisting(postalAddressSection, 'row-field[label="Street/PO Box *"]');
                expectElementIsNotExisting(postalAddressSection, 'row-field[label="Suburb *"]');
                expectElementIsNotExisting(postalAddressSection, 'row-field[label="City/town *"]');
                expectElementIsNotExisting(postalAddressSection, 'row-field[label="Postal Code *"]');
            });

            it('should have "Same as home address" yes radio button selected', function () {
                expect(document.find('#samePostalAndHomeAddress-yes').is(':checked')).toBeTruthy();
                expect(document.find('#samePostalAndHomeAddress-no').is(':checked')).toBeFalsy();
            });
        });
    });
});
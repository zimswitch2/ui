describe('customer information - address template', function () {
    'use strict';

    beforeEach(module('refresh.filters','refresh.mapFilter', 'refresh.accountOrigination.domain.customer'));

    var scope, element, CustomerInformationData;

    function expectElementToBeHidden(elementId) {
        expect(element.find(elementId).hasClass('ng-hide')).toBeTruthy();
    }

    function expectElementToBeShown(elementId) {
        expect(element.find(elementId).hasClass('ng-hide')).toBeFalsy();
    }

    beforeEach(function () {
        module(function ($provide) {
            $provide.value('LookUps', {});
            $provide.value('_CustomerInformationData_', {});
        });
    });

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

        LookUps.residentialStatus = new PromiseLookUp([{code:'01', description:'Owner'}]);
        scope = TemplateTest.scope;
        TemplateTest.allowTemplate('common/sbform/partials/rowField.html');
        var html = TemplateTest.addRootNodeToDocument(Fixture.load('base/main/features/accountorigination/customerInformation/partials/address.html'));
        element = TemplateTest.compileTemplate(html);
        CustomerInformationData = _CustomerInformationData_;
    }));

    describe('address', function () {
        beforeEach(function () {
            scope.customerInformationData = CustomerInformationData.initialize({
                accommodationTypeCode: '01',
                addressDetails: [
                    {
                        addressType: '01',
                        streetPOBox: '5 SIMMONDS ST',
                        suburb: 'MARSHALLTOWN',
                        cityTown: 'JOHANNESBURG',
                        postalCode: 2001,
                        addressUsage: [{
                            usageCode: '05'
                        }]
                    },
                    {
                        addressType: '01',
                        streetPOBox: '7 SIMMONDS ST',
                        suburb: 'MARSHALLTOWN',
                        cityTown: 'JOHANNESBURG',
                        postalCode: 2001,
                        addressUsage: [{
                            usageCode: '02'
                        }]
                    }
                ]
            });
            scope.$digest();
        });

        describe('with home address', function () {
            it('should show the required fields', function () {
                expectElementToBeShown('#homeAddress');

                expect(element.find('#homeStreetPOBox').text()).toMatch(/5 Simmonds St/);
                expect(element.find('#homeSuburb').text()).toMatch(/Marshalltown/);
                expect(element.find('#homeCityTown').text()).toMatch(/Johannesburg/);
                expect(element.find('#homePostalCode').text()).toMatch(/2001/);
                expect(element.find('#homeResidentialStatus').text()).toMatch(/Owner/);

                expectElementToBeHidden('#noHomeAddress');
            });

            it('should hide optional fields when they are blank', function () {
                expectElementToBeHidden('#homeUnitNumber');
                expectElementToBeHidden('#homeBuilding');
            });

            it('should know when residential address does not exist', function () {
                scope.customerInformationData = CustomerInformationData.initialize({});
                scope.$digest();

                expectElementToBeHidden('#homeAddress');
                expectElementToBeShown('#noHomeAddress');
            });
        });

        describe('with postal address', function () {
            it('should show the required fields', function () {
                expectElementToBeShown('#postalAddress');

                expect(element.find('#postalStreetPOBox').text()).toMatch(/7 Simmonds St/);
                expect(element.find('#postalSuburb').text()).toMatch(/Marshalltown/);
                expect(element.find('#postalCityTown').text()).toMatch(/Johannesburg/);
                expect(element.find('#postalPostalCode').text()).toMatch(/2001/);

                expectElementToBeHidden('#noPostalAddress');
            });

            it('should hide optional fields when they are blank', function () {
                expectElementToBeHidden('#postalUnitNumber');
                expectElementToBeHidden('#postalBuilding');
            });

            it('should know when residential address does not exist', function () {
                scope.customerInformationData = CustomerInformationData.initialize({});
                scope.$digest();

                expectElementToBeHidden('#postalAddress');
                expectElementToBeShown('#noPostalAddress');
            });
        });
    });
});
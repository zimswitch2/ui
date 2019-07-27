describe('CustomerService', function () {
    'use strict';

    beforeEach(module('refresh.accountOrigination.customerService'));

    var test, customerService, mock;
    var systemPrincipal = {
        systemPrincipalIdentifier: {
            systemPrincipalId: '1',
            systemPrincipalKey: 'SBSA_BANKING'
        }
    };

    beforeEach(inject(function (_User_, _ServiceTest_, _CustomerService_, _mock_) {
        spyOn(_User_, 'principal');
        _User_.principal.and.returnValue({
            systemPrincipalIdentifier: {
                systemPrincipalId: '1',
                systemPrincipalKey: 'SBSA_BANKING'
            }
        });

        customerService = _CustomerService_;
        test = _ServiceTest_;
        mock = _mock_;
    }));

    var customerData = {
        customerInformation: {
            title: 'Mr',
            initials: 'S B S A',
            firstName: 'Standardbank',
            surName: 'Ibrfresh',
            idType: 'SA',
            idNumber: '1234567890123',
            nationality: 'African',
            cellphone: '0731231234',
            emailAddress: 'sbsa@standardbank.co.za'
        }
    };

    describe('getCustomer', function () {
        beforeEach(function () {
            test.spyOnEndpoint('customerInformation');
        });

        it('should invoke the customer information service', function () {
            test.stubResponse('customerInformation', 200, customerData, {});
            customerService.getCustomer();
            test.resolvePromise();

            expect(test.endpoint('customerInformation')).toHaveBeenCalledWith(systemPrincipal);
        });

        it('should resolve with customer information', function () {
            test.stubResponse('customerInformation', 200, customerData, {});
            expect(customerService.getCustomer()).toBeResolvedWith(customerData.customerInformation);
            test.resolvePromise();
        });
    });

    describe('updateCustomer', function () {
        beforeEach(function () {
            test.spyOnEndpoint('updateCustomerInformation');
        });

        it('should update the customer information', function () {
            test.stubResponse('updateCustomerInformation', 200, customerData, {});
            customerService.updateCustomer({userInfo: 'someInfo'});
            test.resolvePromise();

            var updateCustomerInformationEndpoint = test.endpoint('updateCustomerInformation');
            expect(updateCustomerInformationEndpoint).toHaveBeenCalledWith(jasmine.objectContaining({customerInformation: {userInfo: 'someInfo'}}));
            expect(updateCustomerInformationEndpoint).toHaveBeenCalledWith(jasmine.objectContaining(systemPrincipal));
        });

        it('should should reject errors on save', function () {
            test.stubResponse('updateCustomerInformation', 204, customerData, {
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-message': 'Random error'
            });
            customerService.updateCustomer({userInfo: 'someInfo'});
            test.resolvePromise();

            var updateCustomerInformationEndpoint = test.endpoint('updateCustomerInformation');
            expect(updateCustomerInformationEndpoint).toHaveBeenCalledWith(jasmine.objectContaining({customerInformation: {userInfo: 'someInfo'}}));
            expect(updateCustomerInformationEndpoint).toHaveBeenCalledWith(jasmine.objectContaining(systemPrincipal));
        });
    });

    describe('updateIncomeAndExpenses', function () {
        beforeEach(function () {
            test.spyOnEndpoint('updateCustomerIncomeAndExpenses');
        });

        it('should update the customer income and expenses', function () {
            test.stubResponse('updateCustomerIncomeAndExpenses', 200, customerData, {});
            customerService.updateIncomeAndExpenses({userInfo: 'someInfo'});
            test.resolvePromise();

            var updateCustomerInformationEndpoint = test.endpoint('updateCustomerIncomeAndExpenses');
            expect(updateCustomerInformationEndpoint).toHaveBeenCalledWith(jasmine.objectContaining({customerInformation: {userInfo: 'someInfo'}}));
            expect(updateCustomerInformationEndpoint).toHaveBeenCalledWith(jasmine.objectContaining(systemPrincipal));
        });
    });

    describe('updateFraudConsentAndSourceOfFunds', function () {
        beforeEach(function () {
            test.spyOnEndpoint('updateFraudConsentAndSourceOfFunds');
        });

        it('should update the customer fraud consent and source of funds', function () {
            test.stubResponse('updateFraudConsentAndSourceOfFunds', 200, customerData, {});
            customerService.updateFraudConsentAndSourceOfFunds({userInfo: 'someInfo'});
            test.resolvePromise();

            var updateCustomerInformationEndpoint = test.endpoint('updateFraudConsentAndSourceOfFunds');
            expect(updateCustomerInformationEndpoint).toHaveBeenCalledWith(jasmine.objectContaining({customerInformation: {userInfo: 'someInfo'}}));
            expect(updateCustomerInformationEndpoint).toHaveBeenCalledWith(jasmine.objectContaining(systemPrincipal));
        });
    });

    describe('updateContactInfo', function () {
        beforeEach(function () {
            test.spyOnEndpoint('updateCustomerContactInfo');
        });

        it('should update the customer contact information', function () {
            test.stubResponse('updateCustomerContactInfo', 200, customerData, {});
            customerService.updateContactInfo({userInfo: 'someInfo'});
            test.resolvePromise();

            var updateCustomerInformationEndpoint = test.endpoint('updateCustomerContactInfo');
            expect(updateCustomerInformationEndpoint).toHaveBeenCalledWith(jasmine.objectContaining({customerInformation: {userInfo: 'someInfo'}}));
            expect(updateCustomerInformationEndpoint).toHaveBeenCalledWith(jasmine.objectContaining(systemPrincipal));
        });
    });

    describe('updateEmployment', function () {
        beforeEach(function () {
            test.spyOnEndpoint('updateCustomerEmployment');
        });

        it('should update customer employment', function () {
            test.stubResponse('updateCustomerEmployment', 200, customerData, {});
            customerService.updateEmployment({userInfo: 'someInfo'});
            test.resolvePromise();

            var updateCustomerInformationEndpoint = test.endpoint('updateCustomerEmployment');
            expect(updateCustomerInformationEndpoint).toHaveBeenCalledWith(jasmine.objectContaining({customerInformation: {userInfo: 'someInfo'}}));
            expect(updateCustomerInformationEndpoint).toHaveBeenCalledWith(jasmine.objectContaining(systemPrincipal));
        });
    });

    describe('updateAddress', function () {
        var clock;

        beforeEach(function () {
            test.spyOnEndpoint('updateCustomerAddress');
            clock = sinon.useFakeTimers(moment('2015-04-12').valueOf());
        });

        afterEach(function () {
            clock.restore();
        });

        it('should update customer address with address(es) edited today', function () {
            test.stubResponse('updateCustomerAddress', 200, customerData, {});
            var customer = {
                addressDetails: [
                    {
                        addressType: '01',
                        streetPOBox: '5 SIMMONDS ST',
                        suburb: 'SELBY',
                        cityTown: 'JOHANNESBURG',
                        postalCode: '2001',
                        addressUsage: [
                            {
                                usageCode: '05',
                                deleteIndicator: false,
                                validFrom: '2015-04-11T22:00:00.000+0000'
                            }
                        ]
                    }, {
                        addressType: '01',
                        streetPOBox: '5 SIMMONDS ST',
                        suburb: 'SELBY',
                        cityTown: 'JOHANNESBURG',
                        postalCode: '2001',
                        addressUsage: [
                            {
                                usageCode: '02',
                                deleteIndicator: false,
                                validFrom: '2015-03-09T22:00:00.000+0000'
                            }
                        ]
                    }
                ]
            };
            customerService.updateAddress(customer);
            test.resolvePromise();

            var updateCustomerAddressEndpoint = test.endpoint('updateCustomerAddress');
            var expectedCustomer = {addressDetails: [customer.addressDetails[0]]};

            expect(updateCustomerAddressEndpoint).toHaveBeenCalledWith(jasmine.objectContaining({customerInformation: expectedCustomer}));
            expect(updateCustomerAddressEndpoint).toHaveBeenCalledWith(jasmine.objectContaining(systemPrincipal));
        });
    });

    describe('updateConsent', function () {
        beforeEach(function () {
            test.spyOnEndpoint('updateCustomerConsent');
        });

        it('should update customer consent', function () {
            test.stubResponse('updateCustomerConsent', 200, customerData, {});
            customerService.updateConsent({userInfo: 'someInfo'});
            test.resolvePromise();

            var updateCustomerInformationEndpoint = test.endpoint('updateCustomerConsent');
            expect(updateCustomerInformationEndpoint).toHaveBeenCalledWith(jasmine.objectContaining({customerInformation: {userInfo: 'someInfo'}}));
            expect(updateCustomerInformationEndpoint).toHaveBeenCalledWith(jasmine.objectContaining(systemPrincipal));
        });
    });

    describe('updateBasicInfo', function () {
        beforeEach(function () {
            test.spyOnEndpoint('updateCustomerBasicInfo');
        });

        it('should update customer basic info', function () {
            test.stubResponse('updateCustomerBasicInfo', 200, customerData, {});
            customerService.updateBasicInfo({userInfo: 'someInfo'});
            test.resolvePromise();

            var updateCustomerInformationEndpoint = test.endpoint('updateCustomerBasicInfo');
            expect(updateCustomerInformationEndpoint).toHaveBeenCalledWith(jasmine.objectContaining({customerInformation: {userInfo: 'someInfo'}}));
            expect(updateCustomerInformationEndpoint).toHaveBeenCalledWith(jasmine.objectContaining(systemPrincipal));
        });
    });

    describe('check customer validity information', function () {
        describe('given card number and analytics string', function () {
            describe('when isCustomerCompliant is called', function () {
                var complianceStatusBody;

                beforeEach(function () {
                    test.spyOnEndpoint('getCustomerCompliance');
                    complianceStatusBody = {"compliant": "The correct value"};
                    test.stubResponse('getCustomerCompliance', 200, complianceStatusBody, {});
                });

                it('should call isCustomerCompliant on the gateway', function () {
                    customerService.isCustomerCompliant({number: "1234567890123"}, "Test analytics string");
                    test.resolvePromise();
                    var getCustomerComplianceEndpoint = test.endpoint('getCustomerCompliance');
                    expect(getCustomerComplianceEndpoint).toHaveBeenCalledWith(jasmine.objectContaining({card: { number: "1234567890123" }, reasonForComplianceCheck: "Test analytics string" }));
                });

                it('should return resolve whether the customer is compliant or not', function () {
                    expect(customerService.isCustomerCompliant({ number: "1234567890123"}, "Test analytics string")).toBeResolvedWith(complianceStatusBody.compliant);
                    test.resolvePromise();
                });
            });

            describe('when the gateway returns an unexpected error', function () {
                beforeEach(function () {
                    test.spyOnEndpoint('getCustomerCompliance');
                    test.stubResponse('getCustomerCompliance', 500);
                });

                it('should reject to promise', function () {
                    expect(customerService.isCustomerCompliant({number: "1234567890123"}, "Test analytics string")).toBeRejected();
                    test.resolvePromise();
                });
            });

            describe('when the gateway returns an expected error', function () {
                beforeEach(function () {
                    test.spyOnEndpoint('getCustomerCompliance');
                    test.stubResponse('getCustomerCompliance', 200, {}, {"x-sbg-response-type": "ERROR"});
                });

                it('should reject to promise', function () {
                    expect(customerService.isCustomerCompliant({ number: "1234567890123"}, "Test analytics string")).toBeRejected();
                    test.resolvePromise();
                });
            });
        });
    });
});

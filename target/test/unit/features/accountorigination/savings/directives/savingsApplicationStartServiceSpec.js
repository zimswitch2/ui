using(['pure-save', 'market-link', 'tax-free-call-account'], function (productName) {
    describe('SavingsApplicationStartService', function () {
        'use strict';

        var SavingsApplicationStartService, CustomerInformationLoader, CustomerInformationData, location, invokeService;

        beforeEach(module('refresh.accountOrigination.savings.services.savingsApplicationStartService'));

        beforeEach(inject(function ($rootScope, $location, mock, _SavingsApplicationStartService_, Flow, _CustomerInformationLoader_, CustomerService, _CustomerInformationData_) {
            SavingsApplicationStartService = _SavingsApplicationStartService_;
            CustomerInformationData = _CustomerInformationData_;
            CustomerInformationLoader = _CustomerInformationLoader_;
            location = $location;
            Flow.create(['Flow']);

            spyOn(CustomerInformationLoader, 'load').and.returnValue(mock.resolve());
            spyOn(CustomerService, ['updateFraudConsentAndSourceOfFunds']).and.returnValue(mock.resolve());

            invokeService = function () {
                SavingsApplicationStartService.start(productName);
                $rootScope.$digest();
            };
        }));

        it('should load the customer information', function () {
            invokeService();
            expect(CustomerInformationLoader.load).toHaveBeenCalled();
        });

        it('should update customer consent and source of funds', inject(function (CustomerService) {
            CustomerInformationData.initialize({});

            invokeService();

            expect(CustomerService.updateFraudConsentAndSourceOfFunds).toHaveBeenCalledWith(CustomerInformationData.current());
        }));

        it('should set customer addresses to read-only', function () {
            CustomerInformationData.initialize({});

            invokeService();

            expect(CustomerInformationData.current().canModifyAddresses()).toBeFalsy();
        });

        it('should set customer contact information to read-only', function () {
            CustomerInformationData.initialize({});

            invokeService();

            expect(CustomerInformationData.current().canModifyContactInformation()).toBeFalsy();
        });

        describe('when customer needs additional basic information', function () {
            it('should set location to profile edit page', function () {
                CustomerInformationData.initialize({});

                invokeService();

                expect(location.path()).toEqual('/apply/' + productName + '/profile/edit');
            });
        });

        describe('when customer needs additional employment information', function () {
            it('should set location to profile page', function () {
                CustomerInformationData.initialize({
                    citizenshipCountryCode: 'ZA',
                    nationalityCountryCode: 'ZA',
                    residenceCountryCode: 'ZA',
                    birthCountryCode: 'ZA',
                    incomeExpenseItems: [{
                        itemTypeCode: '04',
                        itemAmount: 3600.0,
                        itemExpenditureIndicator: 'I'
                    }]
                });

                invokeService();

                expect(location.path()).toEqual('/apply/' + productName + '/profile');
            });
        });

        describe('when customer has no income', function () {
            it('should set location to profile page', function () {
                CustomerInformationData.initialize({
                    citizenshipCountryCode: 'ZA',
                    nationalityCountryCode: 'ZA',
                    residenceCountryCode: 'ZA',
                    birthCountryCode: 'ZA',
                    employmentDetails: [{
                        startDate: '2012-12-17T00:00:00.000+0000',
                        endDate: '9999-12-30T22:00:00.000+0000',
                        employerName: 'ZYX Restaurant',
                        occupationIndustryCode: '05',
                        occupationLevelCode: '01',
                        employmentStatusCode: '4'
                    }],
                    incomeExpenseItems: [{
                        itemTypeCode: '04',
                        itemAmount: 3600.0,
                        itemExpenditureIndicator: 'E'
                    }]
                });

                invokeService();

                expect(location.path()).toEqual('/apply/' + productName + '/profile');
            });
        });

        describe('when customer has all required information', function () {
            var mock, SavingsAccountOffersService, SavingsAccountApplication;

            beforeEach(inject(function (_mock_, _SavingsAccountOffersService_, _SavingsAccountApplication_) {
                mock = _mock_;
                SavingsAccountOffersService = _SavingsAccountOffersService_;
                SavingsAccountApplication = _SavingsAccountApplication_;

                CustomerInformationData.initialize({
                    citizenshipCountryCode: 'ZA',
                    nationalityCountryCode: 'ZA',
                    birthCountryCode: 'ZA',
                    residenceCountryCode: 'ZA',
                    employmentDetails: [{
                        startDate: '2012-12-17T00:00:00.000+0000',
                        endDate: '9999-12-30T22:00:00.000+0000',
                        employerName: 'ZYX Restaurant',
                        occupationIndustryCode: '05',
                        occupationLevelCode: '01',
                        employmentStatusCode: '4'
                    }],
                    incomeExpenseItems: [{
                        itemTypeCode: '04',
                        itemAmount: 3600.0,
                        itemExpenditureIndicator: 'I'
                    }]
                });
            }));

            it('should get offers from savings service', function () {
                spyOn(SavingsAccountOffersService, 'getOffers').and.returnValue(mock.resolve());

                invokeService();

                expect(SavingsAccountOffersService.getOffers).toHaveBeenCalled();
            });

            describe('and get offers is successful', function () {
                var offer = {
                    offerId: '123'
                };

                beforeEach(function () {
                    spyOn(SavingsAccountOffersService, 'getOffers').and.returnValue(mock.resolve(offer));
                });

                it('should set offer on savings application', function () {
                    invokeService();

                    expect(SavingsAccountApplication.offerId()).toEqual(offer.offerId);
                });

                it('should call Flow.next', inject(function (Flow) {
                    Flow.create(['First', 'Second']);

                    invokeService();

                    expect(Flow.currentStep().name).toEqual('Second');
                }));

                it('should set location to savings offer path', function () {
                    invokeService();

                    expect(location.path()).toEqual('/apply/' + productName + '/transfer');
                });
            });

            describe('and get offers fails', function () {
                it('should display generic service error when no reason is given', inject(function (NotificationService) {
                    spyOn(SavingsAccountOffersService, 'getOffers').and.returnValue(mock.reject({}));
                    spyOn(NotificationService, ['displayGenericServiceError']);

                    invokeService();

                    expect(NotificationService.displayGenericServiceError).toHaveBeenCalled();
                }));

                it('should set location to savings declined path if rejection reason is declined', function () {
                    spyOn(SavingsAccountOffersService, 'getOffers').and.returnValue(mock.reject({reason: 'DECLINED'}));

                    invokeService();

                    expect(location.path()).toEqual('/apply/' + productName + '/declined');
                });
            });
        });
    });
});
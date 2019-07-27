describe('Edit Consent', function () {
    'use strict';

    beforeEach(module('refresh.accountOrigination.customerInformation.edit.consent', 'refresh.accountOrigination.domain.customer', 'refresh.dtmanalytics'));

    var scope, location, mock, window, customerService, user, applicationParameters;

    describe('routes', function () {
        var route, location;
        beforeEach(inject(function ($route, $location) {
            route = $route;
            location = $location;
        }));

        it('should get the correct template url', function () {
            expect(route.routes['/apply/:product/submit/edit'].templateUrl).toBe('features/accountorigination/customerInformation/partials/editConsent.html');
        });

        it('should get the correct controller', function () {
            expect(route.routes['/apply/:product/submit/edit'].controller).toBe('EditConsentController');
        });
    });

    describe('controller', function () {
        function injectDependencies(scopeProperties) {
            function StaticLookUp(staticValues) {
                return {
                    values: function () {
                        return staticValues;
                    }
                };
            }

            return inject(function ($rootScope, $controller, $location, _mock_, _CustomerService_, CustomerInformationData) {
                scope = $rootScope.$new();
                scope.customerInformationData = CustomerInformationData.initialize(scopeProperties.customerData || {});
                CustomerInformationData.stash();
                scope.consentForm = jasmine.createSpyObj('scope.consentForm', ['$setDirty']);

                applicationParameters = jasmine.createSpyObj('ApplicationParameters', ['pushVariable', 'popVariable']);
                user = jasmine.createSpyObj('User', ['hasDashboards']);

                location = $location;

                customerService = _CustomerService_;
                mock = _mock_;

                var LookUps = {
                    consent: new StaticLookUp([
                        {
                            code: '03',
                            description: "Contact you about Standard Bank products, services and special offers."
                        },
                        {
                            code: '01',
                            description: "Contact you about other companies' products, services and special offers. If you agree, you may be contacted by these companies."
                        },
                        {
                            code: '04',
                            description: "Share your personal information within the Group for marketing purposes."
                        },
                        {
                            code: '02',
                            description: "Contact you for research purposes. Your personal information is confidential under a strict code of conduct."
                        }])
                };

                $controller('EditConsentController', {
                    $scope: scope,
                    LookUps: LookUps,
                    ApplicationParameters: applicationParameters,
                    User: user
                });
                scope.$digest();
            });
        }

        beforeEach(injectDependencies({}));

        describe("initialize", function () {
            it("should have the consents", function () {
                expect(scope.consents).toEqual([
                    {code: '03', description: "Contact you about Standard Bank products, services and special offers."},
                    {
                        code: '01',
                        description: "Contact you about other companies' products, services and special offers. If you agree, you may be contacted by these companies."
                    },
                    {
                        code: '04',
                        description: "Share your personal information within the Group for marketing purposes."
                    },
                    {
                        code: '02',
                        description: "Contact you for research purposes. Your personal information is confidential under a strict code of conduct."
                    }]);
            });

            describe("with customer consents", function () {
                describe("when customer has no consent information", function () {
                    it("should populate the consent clauses", function () {
                        expect(scope.customerInformationData.consentClauses.length).toEqual(4);
                        expect(scope.customerInformationData.consentClauses).toContain(jasmine.objectContaining({
                            consentCode: '01',
                            consentFlag: true
                        }));
                    });

                    it("should return true when the consent clauses have not been added on customer yet", function () {
                        expect(scope.hasNoMarketingConsent).toBeTruthy();
                    });
                });

                describe("when customer has consent information", function () {
                    beforeEach(function () {
                        injectDependencies({
                            customerData: {consentClauses: [{consentCode: '01', consentFlag: false}]}
                        });
                    });

                    it("should not populate consent clauses again", function () {
                        expect(scope.customerInformationData.consentClauses).toContain(jasmine.objectContaining({
                            consentCode: '01',
                            consentFlag: false
                        }));
                        expect(scope.customerInformationData.consentClauses).not.toContain(jasmine.objectContaining({
                            consentCode: '01',
                            consentFlag: true
                        }));
                    });

                    it("should not mark the consent form as dirty", function () {
                        expect(scope.consentForm.$setDirty).not.toHaveBeenCalled();
                    });

                    it("should return false when the consent clauses have already been saved on customer profile", function () {
                        expect(scope.hasNoMarketingConsent).toBeFalsy();
                    });
                });
            });
        });

        describe("on save", function () {
            var updateConsentSpy;

            beforeEach(function () {
                updateConsentSpy = spyOn(customerService, ['updateConsent']).and.returnValue(mock.resolve());
            });

            describe('with marketing consents', function () {
                it('should set consent form dirty when there are no marketing consents', function () {
                    scope.hasNoMarketingConsent = true;
                    scope.save();
                    expect(scope.consentForm.$setDirty).toHaveBeenCalled();
                });

                it('should not set consent form dirty when there are marketing consents', function () {
                    scope.hasNoMarketingConsent = false;
                    scope.save();
                    expect(scope.consentForm.$setDirty).not.toHaveBeenCalled();
                });
            });

            describe('when consent details have not been changed', function () {
                beforeEach(function () {
                    scope.hasNoMarketingConsent = false;
                    injectDependencies({
                        customerData: {consentClauses: [{consentCode: '01', consentFlag: false}]}
                    });
                });

                it('should not call update consent in Customer service', function () {
                    scope.save();
                    expect(updateConsentSpy).not.toHaveBeenCalled();
                });

                it('should cancel editing of customer consents', function () {
                    scope.cancel = spyOn(scope, 'cancel');
                    scope.save();

                    expect(updateConsentSpy).not.toHaveBeenCalled();
                    expect(scope.cancel).toHaveBeenCalled();
                });
            });

            describe('when consent form has been changed', function () {
                beforeEach(function () {
                    scope.hasNoMarketingConsent = false;
                    scope.customerInformationData.consentClauses[0].consentFlag = false;
                    scope.product = 'current-account';
                });

                it("should call update consent in CustomerService", function () {
                    scope.save();
                    expect(updateConsentSpy).toHaveBeenCalled();
                });

                it('should redirect to view consent page upon saving consents', function () {
                    scope.save();
                    scope.$digest();
                    expect(location.url()).toEqual('/apply/' + scope.product + '/submit');
                });

                describe('on error', function () {
                    beforeEach(function () {
                        updateConsentSpy.and.returnValue(mock.reject({message: 'some error'}));
                    });

                    it('should set server error message', function () {
                        scope.save();
                        scope.$digest();
                        expect(scope.serverErrorMessage).toEqual('some error');
                    });

                    it('should set otp error message when user has dashboards', function () {
                        user.hasDashboards.and.returnValue(true);
                        scope.save();
                        scope.$digest();
                        expect(applicationParameters.pushVariable).toHaveBeenCalledWith('otpErrorMessage', 'some error');
                    });

                    it('should not set otp error message when user has no dashboard', function () {
                        user.hasDashboards.and.returnValue(false);
                        scope.save();
                        scope.$digest();
                        expect(applicationParameters.pushVariable).not.toHaveBeenCalled();
                    });

                    it('should not redirect to view consents page', function () {
                        scope.save();
                        scope.$digest();
                        expect(location.url()).not.toEqual('/apply/current-account/submit');
                    });
                });
            });
        });

        describe("on cancel", function () {
            var cancelService, cancelEditSpy;
            beforeEach(inject(function ($window, CancelConfirmationService) {
                cancelService = CancelConfirmationService;
                cancelEditSpy = spyOn(cancelService, ['cancelEdit']).and.callThrough();
                window = spyOn($window.history, 'go');
            }));

            it("should cancel edit using CancelConfirmationService", function () {
                scope.cancel();
                expect(cancelEditSpy).toHaveBeenCalledWith(jasmine.any(Function));
            });

            it("should call cancel confirmation and go back one in history", function () {
                scope.consentForm = {$pristine: true};
                cancelService.setEditForm(scope.consentForm);
                scope.cancel();

                expect(window).toHaveBeenCalledWith(-1);
            });
        });
    });
});
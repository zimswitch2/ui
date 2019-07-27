describe('EditContactController', function () {
    'use strict';

    beforeEach(module('refresh.accountOrigination.customerInformation.edit.contact', 'refresh.sbInput'));

    var scope, location, mock, invokeController, customer, CustomerService, CancelConfirmationService, User, ApplicationParameters;

    function PromiseLookUp(values) {
        return {
            promise: function () {
                return mock.resolve(values);
            }
        };
    }

    function StaticLookUp(staticValues) {
        return {
            values: function () {
                return staticValues;
            }
        };
    }

    beforeEach(inject(function ($rootScope, $controller, $location, _mock_, _CustomerService_,
                                CustomerInformationData, _CancelConfirmationService_, _ApplicationParameters_) {
        scope = $rootScope.$new();
        mock = _mock_;
        location = $location;

        User = jasmine.createSpyObj('User', ['hasDashboards']);
        User.hasDashboards.and.returnValue(false);

        CustomerService = _CustomerService_;
        spyOn(CustomerService, 'updateContactInfo').and.returnValue(mock.resolve());

        CancelConfirmationService = _CancelConfirmationService_;
        spyOn(CancelConfirmationService, 'cancelEdit').and.callThrough();

        ApplicationParameters = _ApplicationParameters_;
        spyOn(ApplicationParameters, 'pushVariable');

        customer = {
            preferredLanguageCode: 'AF',
            communicationInformation: [
                {
                    communicationDetails: 'j*****@s*****.c*.z*',
                    communicationTypeCode: '04',
                    deleteIndicator: false
                },
                {
                    communicationDetails: '*****3452',
                    communicationTypeCode: '03',
                    deleteIndicator: false
                }
            ]
        };

        var LookUps = {
            contactType: new PromiseLookUp([
                {code: '01', description: 'Phone'},
                {code: '02', description: 'Cell phone'},
                {code: '03', description: 'Fax'},
                {code: '04', description: 'Email'}
            ]),
            language: new StaticLookUp([{code: 'EN', description: 'English'}, {code: 'AF', description: 'Afrikaans'}])
        };

        CustomerInformationData.initialize(customer);

        invokeController = function (document) {
            $controller('EditContactController', {
                $scope: scope,
                $document: document,
                LookUps: LookUps,
                User: User,
                $routeParams: {product: 'current-account'}
            });

            scope.$digest();
        };
    }));

    it('should set scope.product from route param', function () {
        invokeController();
        expect(scope.product).toEqual('current-account');
    });

    it('should set scope.customerInformationData from current CustomerInformationData', function () {
        invokeController();
        expect(scope.customerInformationData).toEqual(jasmine.objectContaining(customer));
    });

    it('should set scope.isNewToBankCustomer from user dashboards', function () {
        invokeController();
        expect(scope.isNewToBankCustomer).toBeTruthy();
    });

    it('should set scope.languages from look up', function () {
        invokeController();
        expect(scope.languages).toEqual([
            {code: 'EN', description: 'English'},
            {code: 'AF', description: 'Afrikaans'}]);
    });

    it('should set scope.contactTypes from look up', function () {
        invokeController();
        expect(scope.contactTypes).toEqual([
            {code: '01', description: 'Phone'},
            {code: '02', description: 'Cell phone'},
            {code: '03', description: 'Fax'},
            {code: '04', description: 'Email'}
        ]);
    });

    it('should add contact with default comm type (voice)', function () {
        invokeController();
        scope.addContact();

        expect(scope.customerInformationData.communicationInformation.length).toEqual(3);
        expect(scope.customerInformationData.communicationInformation[2]).toEqual({
            communicationTypeCode: '01',
            communicationDetails: ''
        });
    });

    it('should remove contact', function () {
        invokeController();
        scope.removeContact(1);

        expect(scope.customerInformationData.communicationInformation.length).toEqual(1);
        expect(scope.customerInformationData.communicationInformation[0].communicationTypeCode).toEqual('04');
    });

    describe('view integration', function () {
        var document, templateTest;

        beforeEach(inject(function (TemplateTest, $timeout) {
            TemplateTest.scope = scope;
            TemplateTest.stubTemplate('common/flow/partials/flow.html');
            TemplateTest.stubTemplate('features/accountorigination/common/directives/partials/cancelConfirmation.html');
            TemplateTest.stubTemplate('features/accountorigination/customerInformation/partials/basicInformation.html');
            TemplateTest.allowTemplate('features/accountorigination/customerInformation/partials/addContact.html');
            TemplateTest.allowTemplate('common/sbform/partials/sbTextInput.html');
            templateTest = TemplateTest;

            document = TemplateTest.compileTemplateInFile('features/accountorigination/customerInformation/partials/editContactInformation.html');

            invokeController(document);

            $timeout.flush();
        }));

        it('should display masked values in contact detail fields', function () {
            expect(document.find('input[name="Contact_detail_0"]').val()).toEqual('j*****@s*****.c*.z*');
            expect(document.find('input[name="Contact_detail_1"]').val()).toEqual('*****3452');
        });

        it('should set contact detail fields $viewValue with masked values', function () {
            expect(document.find('input[name="Contact_detail_0"]').controller('ngModel').$viewValue).toEqual('j*****@s*****.c*.z*');
            expect(document.find('input[name="Contact_detail_1"]').controller('ngModel').$viewValue).toEqual('*****3452');
        });

        it('should not be valid with masked values', function () {
            expect(scope.contactsValid()).toBeFalsy();
        });

        it('should be valid with non-masked values', function () {
            templateTest.changeInputValueTo(document.find('input[name="Contact_detail_0"]'), 'joy@sb.co.za');
            templateTest.changeInputValueTo(document.find('input[name="Contact_detail_1"]'), '0733214567');

            expect(scope.contactsValid()).toBeTruthy();
        });
    });

    describe('invalid pattern message', function () {
        using([
            {
                communicationInfo: {
                    communicationDetails: 'Jagan.Sandhadi',
                    communicationTypeCode: '04',
                    communicationTypeDescription: 'E-mail Address'
                },
                errorMessage: 'Please enter a valid email address'
            },
            {
                communicationInfo: {
                    communicationDetails: 'Jagan.Sandhadi',
                    communicationTypeCode: '02',
                    communicationTypeDescription: 'Cell Phone'
                },
                errorMessage: 'Please enter a valid cell phone number'
            },
            {
                communicationInfo: {
                    communicationDetails: '013wrongfax',
                    communicationTypeCode: '03',
                    communicationTypeDescription: 'Fax'
                },
                errorMessage: 'Please enter a valid fax number'
            },
            {
                communicationInfo: {
                    communicationDetails: 'wrongNumber13',
                    communicationTypeCode: '01',
                    communicationTypeDescription: 'Telephone'
                },
                errorMessage: 'Please enter a valid phone number'
            }
        ], function (data) {
            it('should return correct message for ' + data.communicationInfo.communicationTypeDescription, function () {
                invokeController();
                scope.customerInformationData.communicationInformation = [data.communicationInfo];
                expect(scope.getInvalidPatternMessage(data.communicationInfo.communicationTypeCode)).toEqual(data.errorMessage);
            });
        });
    });

    describe('on next', function () {
        it('should navigate to address page while cancelling customer information edit',
            function () {
                invokeController();

                scope.editContactForm = {$pristine: true};
                CancelConfirmationService.setEditForm(scope.editContactForm);

                scope.next();

                expect(CancelConfirmationService.cancelEdit).toHaveBeenCalledWith(jasmine.any(Function));
                expect(location.path()).toBe('/apply/current-account/address');
            });
    });

    describe('on save', function () {
        beforeEach(function () {
            scope.editContactForm = {};
            invokeController();
        });

        it('should call update and redirect to view', function () {
            scope.save();
            scope.$digest();
            expect(CustomerService.updateContactInfo).toHaveBeenCalledWith(scope.customerInformationData);
            expect(location.path()).toBe('/apply/current-account/profile');
        });

        describe('on error', function () {
            beforeEach(function () {
                CustomerService.updateContactInfo.and.returnValue(mock.reject({message: 'Random Server Error'}));
            });

            it('should show any otp errors for an existing user', function () {
                User.hasDashboards.and.returnValue(true);

                scope.save();
                scope.$digest();
                expect(ApplicationParameters.pushVariable).toHaveBeenCalledWith('otpErrorMessage', 'Random Server Error');
            });

            it('should not show any otp errors for new user', function () {
                User.hasDashboards.and.returnValue(false);

                scope.save();
                scope.$digest();
                expect(ApplicationParameters.pushVariable).not.toHaveBeenCalled();
            });

            it('should set server error message on scope', function () {
                scope.save();
                scope.$digest();

                expect(scope.serverErrorMessage).toBe('Random Server Error');
            });

            it('should not redirect to view', function () {
                scope.save();
                scope.$digest();

                expect(location.path()).not.toBe('apply/current-account/profile');
            });
        });
    });

    describe('on cancel', function () {
        it('should call cancel confirmation', inject(function ($window) {
            invokeController();

            var windowSpy = spyOn($window.history, 'go');

            scope.cancel();
            expect(CancelConfirmationService.cancelEdit).toHaveBeenCalledWith(jasmine.any(Function));

            CancelConfirmationService.confirmCancel();
            expect(windowSpy).toHaveBeenCalledWith(-1);
        }));
    });
});

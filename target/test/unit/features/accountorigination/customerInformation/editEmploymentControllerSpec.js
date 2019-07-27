describe('EditEmploymentController', function () {
    /* global customerManagementV4Feature:true */

    'use strict';

    beforeEach(module('refresh.accountOrigination.customerInformation.edit.employment',
        'refresh.accountOrigination.domain.customer', 'refresh.dtmanalytics'));

    var scope, controller, timeout, mock, clock, location, user, cancelConfirmationService, CustomerInformationData;
    var userHasDashboardsSpy, applicationParameters, window;

    describe('routes', function () {
        var route, location;
        beforeEach(inject(function ($route, $location) {
            route = $route;
            location = $location;
        }));

        it('should resolve the edit employment route correctly', function () {
            expect(route.routes['/apply/:product/employment/edit'].resolve.addStatus()).toBeFalsy();
        });

        it('should resolve the add employment route correctly', function () {
            expect(route.routes['/apply/:product/employment/add'].resolve.addStatus()).toBeTruthy();
        });

        it('should load the correct controller', function () {
            expect(route.routes['/apply/:product/employment/add'].controller).toBe('EditEmploymentController');
        });

        it('should load the correct template', function () {
            expect(route.routes['/apply/:product/employment/add'].templateUrl).toBe('features/accountorigination/customerInformation/partials/editEmployment.html');
        });
    });

    describe('controller', function () {
        var PromiseLookUp = function (values) {
            return {
                promise: function () {
                    return mock.resolve(values);
                }
            };
        };

        var LookUps = {
            unemploymentReason: new PromiseLookUp([{code: 0, description: '999'}]),
            occupationIndustry: new PromiseLookUp([{code: 1, description: 'aaa'}]),
            occupationLevel: new PromiseLookUp([{code: 2, description: 'bbb'}]),
            employmentType: new PromiseLookUp([{code: 3, description: 'ccc'}]),
            levelOfEducation: new PromiseLookUp([
                {code: 4, description: 'ddd', category: 'd'},
                {code: 5, description: 'eee', category: 'e'},
                {code: 6, description: 'fff', category: 'e'}
            ])

        };

        function initController(addStatus) {
            controller('EditEmploymentController', {
                $scope: scope,
                $routeParams: {product: 'current-account'},
                LookUps: LookUps,
                User: user,
                ApplicationParameters: applicationParameters,
                addStatus: addStatus || false
            });
            scope.$digest();
        }

        beforeEach(inject(function ($rootScope, $controller, $timeout, $window, $location, _mock_, _CustomerInformationData_,
                                    User, CancelConfirmationService) {
            var customerInformationData = {
                tertiaryQualificationCode: 4,
                employmentDetails: [{
                    startDate: '2014-12-17T00:00:00.000+0000',
                    endDate: '9999-12-30T22:00:00.000+0000',
                    employerName: 'ZYX Restaurant',
                    employmentStatusCode: 1
                }, {
                    startDate: '2010-11-11T00:00:00.000+0000',
                    endDate: '2012-12-17T00:00:00.000+0000',
                    employerName: 'Previous Restaurant',
                    employmentStatusCode: 1
                }]
            };
            CustomerInformationData = _CustomerInformationData_;

            scope = $rootScope.$new();
            scope.customerInformationData = CustomerInformationData.initialize(customerInformationData);
            CustomerInformationData.stash();

            controller = $controller;
            timeout = $timeout;
            location = $location;
            mock = _mock_;

            cancelConfirmationService = CancelConfirmationService;
            cancelConfirmationService.setEditForm({$pristine: true});
            spyOn(cancelConfirmationService, ['cancelEdit']).and.callThrough();
            window = spyOn($window.history, 'go');

            user = User;
            userHasDashboardsSpy = spyOn(User, 'hasDashboards').and.returnValue(false);

            applicationParameters = jasmine.createSpyObj('ApplicationParameters', ['pushVariable', 'popVariable']);

            clock = sinon.useFakeTimers(moment('2015-03-13').valueOf());

            initController();
        }));

        afterEach(function () {
            clock.restore();
        });

        describe("drop down options", function () {
            it("occupation industries", function () {
                expect(scope.occupationIndustries).toEqual([{code: 1, description: 'aaa'}]);
            });

            it("occupation levels", function () {
                expect(scope.occupationLevels).toEqual([{code: 2, description: 'bbb'}]);
            });

            it("levels of education", function () {
                expect(scope.allLevelsOfEducation).toEqual([
                    {code: 4, description: 'ddd', category: 'd'},
                    {code: 5, description: 'eee', category: 'e'},
                    {code: 6, description: 'fff', category: 'e'}]);

                expect(scope.levelsOfEducation).toEqual([
                    {code: 4, description: 'ddd', category: 'd'}]);
            });

            it("study type", function () {
                expect(scope.studyTypes).toEqual(['d', 'e']);
            });
        });

        describe("initialize", function () {
            it("should set latestEmploymentStartDate to current date", function () {
                expect(scope.latestEmploymentStartDate).toEqual("2015-03-13");
            });

            it("should know whether customer is currently employed", function () {
                expect(scope.isCustomerEmployed).toBeTruthy();
            });

            describe('with server error message', function () {
                it('should get otp error message for existing customer', function () {
                    userHasDashboardsSpy.and.returnValue(true);
                    initController();
                    expect(applicationParameters.popVariable).toHaveBeenCalledWith('otpErrorMessage');
                });

                it('should not get otp error message for new customer', function () {
                    userHasDashboardsSpy.and.returnValue(false);
                    expect(applicationParameters.popVariable).not.toHaveBeenCalled();
                });
            });

            describe('for isEmployed', function () {
                it("should set isEmployed to true when adding a new employment", function () {
                    initController(true);
                    expect(scope.isEmployed).toBeTruthy();
                });

                describe('when modifying existing employment', function () {
                    it('should set isEmployed to isCustomerEmployed if customer has unemployment reason', function () {
                        scope.customerInformationData = CustomerInformationData.initialize({unemploymentReason: 'A'});
                        scope.isCustomerEmployed = false;
                        initController(false);
                        expect(scope.isEmployed).toBe(scope.isCustomerEmployed);
                    });

                    it('should set isEmployed to undefined if customer lacks both employment details and unemployment reason', function () {
                        scope.customerInformationData = CustomerInformationData.initialize({});
                        initController(false);
                        expect(scope.isEmployed).toBeUndefined();
                    });
                });
            });

            describe("with previous employment", function () {
                it("should clear previous employment end date when it is in the future", function () {
                    scope.customerInformationData = CustomerInformationData.initialize({
                        employmentDetails: [{
                            startDate: '2014-12-17T00:00:00.000+0000',
                            endDate: '9999-12-30T22:00:00.000+0000',
                            employerName: 'ZYX Restaurant',
                            employmentStatusCode: 1
                        }]
                    });
                    initController(true);

                    expect(scope.previousEmployment().endDate).toBeUndefined();
                });

                it("should not clear previous employment end date when it is in the past", function () {
                    expect(scope.previousEmployment().endDate).not.toBeUndefined();
                });
            });
        });

        describe("on change study type", function () {
            beforeEach(function () {
                scope.customerInformationData = CustomerInformationData.initialize({tertiaryQualificationCode: 5});
            });

            it("should filter options in levelOfEducation", function () {
                scope.updateLevelOfEducation('e');
                timeout.flush();

                expect(scope.levelsOfEducation).toContain(jasmine.objectContaining(
                    {code: 5, description: 'eee', category: 'e'}));
                expect(scope.levelsOfEducation).toContain(jasmine.objectContaining(
                    {code: 6, description: 'fff', category: 'e'}
                ));
            });
        });

        describe("current employment", function () {
            it("should return an empty employment details when adding employment", function () {
                initController(true);

                expect(scope.currentEmployment()).toEqual(jasmine.objectContaining({
                    endDate: '9999-12-31',
                    employerName: '',
                    occupationIndustryCode: '',
                    occupationLevelCode: '',
                    employmentStatusCode: ''
                }));
            });

            describe("when modifying employment", function () {
                it("should return current employment details when customer has current employment details", function () {
                    expect(scope.currentEmployment()).toEqual(jasmine.objectContaining({
                        startDate: '2014-12-17T00:00:00.000+0000',
                        endDate: '9999-12-30T22:00:00.000+0000',
                        employerName: 'ZYX Restaurant'
                    }));
                });

                it("should return an empty employment details when customer has no current employment details", function () {
                    scope.customerInformationData.employmentDetails = [{}];
                    initController();

                    expect(scope.currentEmployment()).toEqual(jasmine.objectContaining({
                        endDate: '9999-12-31',
                        employerName: '',
                        occupationIndustryCode: '',
                        occupationLevelCode: '',
                        employmentStatusCode: ''
                    }));
                });

            });
        });

        describe("previous employment", function () {
            it("should return previous employment details when modifying a customer currently employed", function () {
                expect(scope.previousEmployment()).toEqual(jasmine.objectContaining({
                    startDate: '2010-11-11T00:00:00.000+0000',
                    endDate: '2012-12-17T00:00:00.000+0000',
                    employerName: 'Previous Restaurant'
                }));
            });

            it("should return current employment details when updating a customer moving from being employed to unemployed", function () {
                scope.isEmployed = false;
                expect(scope.previousEmployment()).toEqual(jasmine.objectContaining({
                    startDate: '2014-12-17T00:00:00.000+0000',
                    endDate: '9999-12-30T22:00:00.000+0000'
                }));
            });

            it("should return previous employment details when updating a customer who is already unemployed", function () {
                scope.customerInformationData = CustomerInformationData.initialize({
                    employmentDetails: [{
                        startDate: '2014-12-17T00:00:00.000+0000',
                        endDate: '2014-12-30T22:00:00.000+0000',
                        employmentStatusCode: 1
                    }]
                });
                initController(true);
                scope.isEmployed = false;

                expect(scope.previousEmployment()).toEqual(jasmine.objectContaining({
                    startDate: '2014-12-17T00:00:00.000+0000',
                    endDate: '2014-12-30T22:00:00.000+0000',
                    employmentStatusCode: 1
                }));
            });

        });

        describe("addEmployment", function () {
            it("should set scope isEmployed to true", function () {
                scope.addEmployment();
                expect(scope.isEmployed).toBeTruthy();
            });

            it("should set current employment end date to the end of time", function () {
                scope.currentEmployment().endDate = 'some date';
                scope.addEmployment();
                expect(scope.currentEmployment().endDate).toEqual('9999-12-31');
            });

            it("should delete unemployment reason", function () {
                scope.unemploymentReason.code = 'A';
                scope.addEmployment();
                expect(scope.unemploymentReason).toEqual({});
            });
        });

        describe("removeEmployment", function () {
            it("should set customer to unemployed", function () {
                scope.removeEmployment();
                expect(scope.isEmployed).toBeFalsy();
            });

            it("should reset current employment to its original state", function () {
                scope.currentEmployment().employerName = 'current employment';
                scope.removeEmployment();
                expect(scope.currentEmployment().employerName).toEqual('ZYX Restaurant');
            });

            it("should delete current employment end date", function () {
                scope.currentEmployment().endDate = 'some date';
                scope.removeEmployment();
                expect(scope.currentEmployment().endDate).toBeUndefined();
            });
        });

        describe('currentEmploymentIsLessThanAYear', function () {
            beforeEach(function () {
                initController(true);
            });

            it("should return false when current employment start date is empty", function () {
                delete scope.currentEmployment().startDate;
                expect(scope.currentEmploymentIsLessThanAYear()).toBeFalsy();
            });

            it("should return false when current employment start date is at least a year", function () {
                scope.currentEmployment().startDate = '2010-01-01';
                expect(scope.currentEmploymentIsLessThanAYear()).toBeFalsy();
            });

            it("should return true when current employment start date is less than a year", function () {
                scope.currentEmployment().startDate = moment();
                expect(scope.currentEmploymentIsLessThanAYear()).toBeTruthy();
            });
        });

        describe("needPreviousEmployment", function () {
            describe("when modifying", function () {
                it("should return true when customer is no longer employed but has employment details", function () {
                    scope.customerInformationData = CustomerInformationData.initialize({
                        employmentDetails: [{
                            startDate: '2014-12-17T00:00:00.000+0000',
                            endDate: '9999-03-13',
                            employmentStatusCode: 1
                        }]
                    });
                    scope.isEmployed = false;
                    expect(scope.needPreviousEmployment()).toBeTruthy();
                });

                it("should return false when modifying current employment details", inject(function (CustomerInformationData) {
                    scope.isEmployed = true;
                    scope.customerInformationData = CustomerInformationData.initialize({
                        employmentDetails: [{
                            startDate: '2010-12-17T00:00:00.000+0000',
                            endDate: '9999-12-30',
                            employmentStatusCode: 1
                        }]
                    });
                    initController();
                    expect(scope.needPreviousEmployment()).toBeFalsy();
                }));
            });

            describe("when adding", function () {
                beforeEach(function () {
                    initController(true);
                });

                it("should return true when a customer already has employment details", function () {
                    expect(scope.needPreviousEmployment()).toBeTruthy();
                });

                describe("for first time employment", function () {
                    it("should return true when it is less than a year", function () {
                        scope.customerInformationData.employmentDetails = [];
                        scope.currentEmployment().startDate = '2015-01-01';
                        expect(scope.needPreviousEmployment()).toBeTruthy();
                    });

                    it("should return true when customer has been employed before", function () {
                        scope.customerInformationData.employmentDetails = [];
                        scope.currentEmployment().startDate = '2015-01-01';
                        scope.isFirstEmployment = false;
                        expect(scope.needPreviousEmployment()).toBeTruthy();
                    });

                    it("should return false when customer has not been employed before", function () {
                        scope.customerInformationData.employmentDetails = [];
                        scope.currentEmployment().startDate = '2015-01-01';
                        initController();
                        scope.toggleFirstEmployment();
                        expect(scope.needPreviousEmployment()).toBeFalsy();
                    });
                });

                it("should return false for first employment that is at least a year", function () {
                    scope.customerInformationData.employmentDetails = [];
                    scope.currentEmployment().startDate = '2012-01-01';
                    expect(scope.needPreviousEmployment()).toBeFalsy();
                });

                it("should return false when current employment start date is still empty", function () {
                    scope.customerInformationData.employmentDetails = [];
                    delete scope.currentEmployment().startDate;
                    expect(scope.needPreviousEmployment()).toBeFalsy();
                });

            });
        });

        describe("getEarliestDateForCurrentEmployment", function () {
            it("should set earliest date to previous employment end date when end date is in the past", function () {
                expect(scope.getEarliestDateForCurrentEmployment()).toEqual(scope.customerInformationData.getPreviousEmploymentDetails().endDate);
            });

            it("should set earliest date one day after previous employment start date when end date is in the future", function () {
                scope.customerInformationData.getPreviousEmploymentDetails().startDate = '2010-11-11';
                scope.customerInformationData.getPreviousEmploymentDetails().endDate = '9999-12-31';
                expect(scope.getEarliestDateForCurrentEmployment()).toEqual('2010-11-12');
            });

            it("should return false when modifying current employment details", function () {
                scope.isEmployed = true;
                scope.customerInformationData = CustomerInformationData.initialize({
                    employmentDetails: [{
                        startDate: '2007-12-17T00:00:00.000+0000',
                        endDate: '9999-12-30',
                        employmentStatusCode: 1
                    }]
                });
                initController();
                expect(scope.needPreviousEmployment()).toBeFalsy();
            });

            it("should set earliest date one day after previous employment start date when there is no end date", function () {
                scope.customerInformationData.getPreviousEmploymentDetails().startDate = '2010-11-11';
                scope.customerInformationData.getPreviousEmploymentDetails().endDate = undefined;
                expect(scope.getEarliestDateForCurrentEmployment()).toEqual('2010-11-12');
            });

            it("should set earliest date to one day after previous employment end date when end date matches previous employment start date", function () {
                scope.customerInformationData.getPreviousEmploymentDetails().startDate = '2010-11-11';
                scope.customerInformationData.getPreviousEmploymentDetails().endDate = '2010-11-11';
                expect(scope.getEarliestDateForCurrentEmployment()).toEqual('2010-11-12');
            });

            it("should set earliest date to '01 Jan 1970' when there is no previous employment", function () {
                scope.customerInformationData = CustomerInformationData.initialize({});
                expect(scope.getEarliestDateForCurrentEmployment()).toEqual('1900-01-01');
            });
        });

        describe("getLatestDateForPreviousEmployment", function () {
            describe("when adding employment", function () {
                beforeEach(function () {
                    initController(true);
                });

                it("should set latest date to employment start date if start date is not empty", function () {
                    scope.currentEmployment().startDate = '2015-03-11';
                    expect(scope.getLatestDateForPreviousEmployment()).toEqual('2015-03-11');
                });

                it("should set latest date to employment to yesterday if start date is empty", function () {
                    scope.currentEmployment().startDate = undefined;
                    expect(scope.getLatestDateForPreviousEmployment()).toEqual('2015-03-12');
                });

                it("should return false when customer has not been employed before", function () {
                    scope.customerInformationData.employmentDetails = [];
                    scope.currentEmployment().startDate = '2015-01-01';
                    initController();
                    scope.toggleFirstEmployment();
                    expect(scope.needPreviousEmployment()).toBeFalsy();
                });
            });


            it("should set latest date to todays date when modifying employment", function () {
                expect(scope.getLatestDateForPreviousEmployment()).toEqual('2015-03-13');
            });
        });

        describe("canBeWithoutPreviousEmployment", function () {
            describe("when adding employment that is less than a year", function () {
                beforeEach(function () {
                    initController(true);
                });

                it("should return true if customer has no previous employment", inject(function (CustomerInformationData) {
                    scope.customerInformationData = CustomerInformationData.initialize({});
                    scope.currentEmployment().startDate = '2015-03-10';
                    expect(scope.canBeWithoutPreviousEmployment()).toBeTruthy();
                }));

                it("should return false if customer has previous employment", function () {
                    scope.currentEmployment().startDate = '2015-03-10';
                    expect(scope.canBeWithoutPreviousEmployment()).toBeFalsy();
                });
            });
        });

        describe("cleanPreviousEmployment", function () {
            beforeEach(function () {
                initController(true);
                scope.isFirstEmployment = true;
                scope.previousEmployment().startDate = '2009-03-31';
            });

            describe("when customer has been employed for more than a year", function () {
                it("should clean fields related to previous employment if customer has no employment details", function () {
                    scope.customerInformationData = CustomerInformationData.initialize({});
                    scope.currentEmployment().startDate = '2010-01-01';
                    scope.cleanPreviousEmployment();

                    expect(scope.isFirstEmployment).toBeFalsy();
                    expect(scope.previousEmployment().startDate).toBeUndefined();
                });

                it("should not clean fields related to previous employment if customer has employment details", function () {
                    scope.cleanPreviousEmployment();
                    expect(scope.previousEmployment().startDate).not.toBeUndefined();
                });
            });

            describe("when customer has been employed for less than a year", function () {
                it("should not clean fields related to previous employment", function () {
                    scope.currentEmployment().startDate = moment();
                    scope.cleanPreviousEmployment();

                    expect(scope.isFirstEmployment).toBeTruthy();
                    expect(scope.previousEmployment().startDate).not.toBeUndefined();

                });
            });
        });

        describe("canToggleEmploymentStatus", function () {
            it("should return true given isCustomerEmployed is true", function () {
                scope.isCustomerEmployed = true;
                expect(scope.canToggleEmploymentStatus()).toBeTruthy();
            });

            describe("with isCustomerEmployed set to false", function () {
                beforeEach(function () {
                    scope.isCustomerEmployed = false;
                });

                it("should return true given customer has no employment status", function () {
                    scope.customerInformationData.employmentDetails = [];
                    delete scope.customerInformationData.unemploymentReason;
                    expect(scope.canToggleEmploymentStatus()).toBeTruthy();
                });

                it("should return false given customer has employment status", function () {
                    scope.customerInformationData.unemploymentReason = 'A';
                    expect(scope.canToggleEmploymentStatus()).toBeFalsy();
                });
            });
        });

        describe("when toggling first employment", function () {
            beforeEach(function () {
                initController(true);
                scope.previousEmployment().startDate = '2015-03-31';
            });

            it("should clear previous employment fields if first employment", function () {
                scope.isFirstEmployment = false;
                scope.toggleFirstEmployment();
                expect(scope.previousEmployment().startDate).toBeUndefined();
            });

            it("should not clear previous employment fields if not first employment", function () {
                scope.isFirstEmployment = true;
                scope.toggleFirstEmployment();
                expect(scope.previousEmployment().startDate).toEqual('2015-03-31');
            });
        });

        describe("getValidationNotification", function () {
            it("should get customer info validation for employment", inject(function (CustomerInfoValidation) {
                spyOn(CustomerInfoValidation, ['getValidationNotificationForSection']);
                scope.getValidationNotification();
                expect(CustomerInfoValidation.getValidationNotificationForSection).toHaveBeenCalledWith('employment');
            }));
        });

        describe("getLabelFor", function () {
            it('should return label text followed by *', function () {
                scope.customerInformationData.hasPreviousEmployment = function () {
                    return false;
                };
                expect(scope.getLabelFor('Employment')).toEqual('Employment *');
            });

            it('should omit the * when the customer has previous employment', function () {
                scope.customerInformationData.hasPreviousEmployment = function () {
                    return true;
                };
                expect(scope.getLabelFor('Employment')).toEqual('Employment');
            });
        });

        describe("save", function () {
            var customerService, updateEmploymentSpy;

            beforeEach(inject(function (CustomerService) {
                customerService = CustomerService;
                updateEmploymentSpy = spyOn(CustomerService, 'updateEmployment').and.returnValue(mock.resolve());
            }));

            describe('when employment details have not been changed', function () {
                it('should not call update employment in Customer service', function () {
                    scope.save();
                    expect(customerService.updateEmployment).not.toHaveBeenCalled();
                });

                it('should cancel editing of customer employment', function () {
                    scope.cancel = spyOn(scope, 'cancel');
                    scope.save();

                    expect(customerService.updateEmployment).not.toHaveBeenCalled();
                    expect(scope.cancel).toHaveBeenCalled();
                });
            });

            describe('when employment details have been changed', function () {
                beforeEach(function () {
                    scope.product = 'current-account';
                    scope.currentEmployment().employerName = 'Edited Employer Name';
                    scope.currentEmployment().startDate = '2012-01-01';
                });

                describe('and customer is employed', function () {
                    beforeEach(function () {
                        scope.isEmployed = true;
                    });

                    it("should call update employment in CustomerService", function () {
                        scope.save();
                        expect(customerService.updateEmployment).toHaveBeenCalled();
                    });

                    it('should redirect to view employment page upon saving employment', function () {
                        scope.save();
                        scope.$digest();
                        expect(location.url()).toEqual('/apply/' + scope.product + '/employment');
                    });
                });

                describe('and customer is not employed', function () {
                    beforeEach(function () {
                        scope.removeEmployment();
                        scope.unemploymentReason.code = 'B';
                    });

                    it("should call update employment in CustomerService", function () {
                        scope.save();
                        expect(customerService.updateEmployment).toHaveBeenCalled();
                    });

                    it('should redirect to view employment page upon saving employment', function () {
                        scope.save();
                        scope.$digest();
                        expect(location.url()).toEqual('/apply/' + scope.product + '/employment');
                    });
                });

                describe('on error', function () {
                    beforeEach(function () {
                        updateEmploymentSpy.and.returnValue(mock.reject({message: 'some error'}));
                    });

                    it('should set server error message', function () {
                        scope.save();
                        scope.$digest();
                        expect(scope.serverErrorMessage).toEqual('some error');
                    });

                    it('should set otp error message when user has dashboards', function () {
                        userHasDashboardsSpy.and.returnValue(true);
                        scope.save();
                        scope.$digest();
                        expect(applicationParameters.pushVariable).toHaveBeenCalledWith('otpErrorMessage', 'some error');
                    });

                    it('should not set otp error message when user has no dashboard', function () {
                        userHasDashboardsSpy.and.returnValue(false);
                        scope.save();
                        scope.$digest();
                        expect(applicationParameters.pushVariable).not.toHaveBeenCalled();
                    });

                    it('should not navigate to view employment page', function () {
                        scope.save();
                        scope.$digest();
                        expect(location.url()).not.toEqual('/apply/current-account/employment');
                    });
                });

                describe("when customer is employed", function () {
                    it("should add current and previous employments to customer employment details", function () {
                        var addEmploymentSpy = spyOn(scope.customerInformationData, 'addEmployment');
                        scope.isEmployed = true;
                        scope.save();
                        expect(addEmploymentSpy).toHaveBeenCalledWith(scope.previousEmployment());
                        expect(addEmploymentSpy).toHaveBeenCalledWith(scope.currentEmployment());
                    });

                    it("should remove unemployment reason", function () {
                        scope.isEmployed = true;
                        scope.unemploymentReason = {code: 'A'};
                        scope.save();
                        expect(scope.customerInformationData.unemploymentReason).toBeUndefined();
                    });
                });

                describe("when customer is unemployed", function () {
                    it("should set unemployment reason", function () {
                        scope.isEmployed = false;
                        scope.unemploymentReason.code = 'B';
                        scope.save();
                        expect(scope.customerInformationData.unemploymentReason).toEqual(scope.unemploymentReason.code);
                    });
                });
            });
        });

        describe("cancel", function () {
            it("should cancel edit using CancelConfirmationService", function () {
                scope.cancel();
                expect(cancelConfirmationService.cancelEdit).toHaveBeenCalledWith(jasmine.any(Function));
            });

            it("should call cancel confirmation and go back one in history", function () {
                scope.cancel();

                expect(window).toHaveBeenCalledWith(-1);
            });
        });

        describe("next", function () {
            it('should cancel editing of customer information', function () {
                scope.next();
                expect(cancelConfirmationService.cancelEdit).toHaveBeenCalledWith(jasmine.any(Function));
            });

            it('should go to the income and expenses section', function () {
                scope.next();
                expect(location.path()).toEqual('/apply/' + scope.product + '/income');
            });
        });

        describe('analytics', function () {
            it('should set the unemployment analytics prefix for a new customer', function () {
                expect(scope.unemploymentAnalyticsPrefix).toBe('/New');
            });

            it('should set the unemployment analytics prefix for an existing customer that is employed', function () {
                user.hasDashboards.and.returnValue(true);
                initController();
                expect(scope.unemploymentAnalyticsPrefix).toBe('/Employed');
            });

            it('should set the unemployment analytics prefix for an existing customer that is unemployed', function () {
                user.hasDashboards.and.returnValue(true);
                scope.customerInformationData.employmentDetails = [];
                initController();
                expect(scope.unemploymentAnalyticsPrefix).toBe('/Unemployed');
            });
        });

        describe('canSave', function () {
            it('should return true when customer is employed', function () {
                scope.isEmployed = true;
                expect(scope.canSave()).toBeTruthy();
            });

            it('should return false when customer has not indicated whether they are employed or not', function () {
                scope.isEmployed = undefined;
                expect(scope.canSave()).toBeFalsy();
            });

            describe('when customer is not employed', function () {
                beforeEach(function () {
                    scope.isEmployed = false;
                });

                afterEach(function () {
                    customerManagementV4Feature = true;
                });

                it('should return true given customer management v4 is toggled on', function () {
                    expect(scope.canSave()).toBeTruthy();
                });

                it('should return false given customer management v4 is toggled off and there is no qualification details', function () {
                    customerManagementV4Feature = false;
                    scope.customerInformationData.tertiaryQualificationCode = '';
                    expect(scope.canSave()).toBeFalsy();
                });
            });


        });
    });
});
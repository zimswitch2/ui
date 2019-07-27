describe('Cancel confirmation', function () {
    'use strict';

    beforeEach(module('refresh.accountOrigination.common.directives.cancelConfirmation'));

    describe('Service', function () {
        var cancelService, CustomerInformationData;

        beforeEach(inject(function (CancelConfirmationService, _CustomerInformationData_) {
            cancelService = CancelConfirmationService;
            CustomerInformationData = _CustomerInformationData_;
            spyOn(CustomerInformationData, ['revert']);
        }));

        it('should know whether modal should be shown', function () {
            cancelService.cancelEdit();
            expect(cancelService.shouldShowModal()).toBeTruthy();
        });

        describe('when cancelling editing of customer information', function () {
            describe('given edit form has been set', function () {
                var navigateSpy;

                beforeEach(function () {
                    navigateSpy = jasmine.createSpy('navigate');
                });

                describe('and it is pristine', function () {
                    beforeEach(function () {
                        cancelService.setEditForm({$pristine: true});
                    });

                    it('should navigate to the set location', function () {
                        cancelService.cancelEdit(navigateSpy);
                        expect(navigateSpy).toHaveBeenCalled();
                        expect(cancelService.shouldShowModal()).toBeFalsy();
                    });

                    it('should revert customer information', function () {
                        cancelService.cancelEdit(navigateSpy);
                        expect(CustomerInformationData.revert).toHaveBeenCalled();
                    });
                });
            });

            describe('given edit form has not been set', function () {
                it('should not navigate', function () {
                    var navigateMock = jasmine.createSpy('navigate');
                    cancelService.cancelEdit(navigateMock);

                    expect(navigateMock).not.toHaveBeenCalled();
                });

                it('should set cancel confirmation modal to true', function () {
                    cancelService.cancelEdit();
                    expect(cancelService.shouldShowModal()).toBeTruthy();
                });
            });
        });

        describe('hide()', function () {
            it('should set show modal to false', function () {
                cancelService.cancelEdit();
                cancelService.hide();
                expect(cancelService.shouldShowModal()).toBeFalsy();
            });
        });

        describe('confirmCancel()', function () {
            it('should set show modal to false', function () {
                cancelService.cancelEdit();
                cancelService.confirmCancel();
                expect(cancelService.shouldShowModal()).toBeFalsy();
            });

            it('should revert customer information data', function () {
                cancelService.confirmCancel();
                expect(CustomerInformationData.revert).toHaveBeenCalled();
            });

            it('should navigate if navigate callback has been set', function () {
                var navigateSpy = jasmine.createSpy('navigate');
                cancelService.cancelEdit(navigateSpy);
                cancelService.confirmCancel();
                expect(navigateSpy).toHaveBeenCalled();
            });

            it('should navigate to location specified in the $routeParams', inject(function ($location, $routeParams) {
                $routeParams.product = 'current-account';
                $routeParams.section = 'employment';
                var locationUrlSpy = spyOn($location, 'url').and.callThrough();

                cancelService.confirmCancel();

                expect(locationUrlSpy).toHaveBeenCalledWith('/apply/current-account/employment');
            }));
        });
    });

    describe('Controller', function () {
        var scope, controller, cancelService;

        function initController() {
            controller('CancelConfirmationController', {
                $scope: scope,
                CancelConfirmationService: cancelService
            });
            scope.$digest();
        }

        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            cancelService = jasmine.createSpyObj('CancelConfirmationService', ['shouldShowModal', 'hide', 'confirmCancel', 'setEditForm']);
            controller = $controller;

            initController();
        }));

        it('should rely on cancel confirmation service to cancel editing of customer information', function () {
            scope.confirm();
            expect(cancelService.confirmCancel).toHaveBeenCalled();
        });

        it('should rely on cancel confirmation service to find out when modal should be shown', function () {
            scope.showModal();
            expect(cancelService.shouldShowModal).toHaveBeenCalled();
        });

        it('should rely on cancel confirmation service to navigate back', function () {
            scope.back();
            expect(cancelService.hide).toHaveBeenCalled();
        });

        describe('with edit form', function () {
            it('should set the form in cancel confirmation service given it exists', function () {
                scope.editForm = {name: 'something'};
                initController();
                expect(cancelService.setEditForm).toHaveBeenCalledWith(scope.editForm);
            });

            it('should not set the form in cancel confirmation service given it does not exist', function () {
                initController();
                expect(cancelService.setEditForm).not.toHaveBeenCalled();
            });
        });
    });

    describe('Directive', function () {
        var cancelService, test;

        beforeEach(inject(function ($rootScope, _TemplateTest_, CancelConfirmationService) {
            test = _TemplateTest_;
            test.allowTemplate('features/accountorigination/common/directives/partials/cancelConfirmation.html');
            cancelService = CancelConfirmationService;
        }));

        describe('when show modal is true', function () {
            it('should display cancel confirmation modal', function () {
                cancelService.cancelEdit();
                var template = test.compileTemplate('<cancel-confirmation></cancel-confirmation>', true);
                expect(template.find('#confirm-save-modal')).not.toBeHidden();
            });
        });

        describe('when show modal is false', function () {
            it('should hide cancel confirmation modal', function () {
                cancelService.hide();
                var template = test.compileTemplate('<cancel-confirmation></cancel-confirmation>', true);
                expect(template.find('#confirm-save-modal').length).toEqual(0); // element is not present
            });
        });
    });

});
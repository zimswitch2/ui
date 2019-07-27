describe('apply for account directive', function () {
    'use strict';

    beforeEach(module('refresh.accountOrigination.common.directives.applyForAccount'));

    var test, element, Flow, CurrentAccountApplication, scope;

    beforeEach(inject(function (_TemplateTest_, _CurrentAccountApplication_, _Flow_) {
        test = _TemplateTest_;
        test.allowTemplate('features/accountorigination/common/directives/partials/applyForAccount.html');
        scope = test.scope;

        Flow = _Flow_;
        CurrentAccountApplication = _CurrentAccountApplication_;
    }));

    describe('is enabled behaviour', function () {

        beforeEach(function () {
            element = test.compileTemplate('<apply-for-account product-type="pure-save" is-disabled="applyButtonIsDisabled"></apply-for-account>');
            scope.$digest();
        });

        it('should be enabled by default', function () {
            expect(element.find('button')[0].disabled).toBeFalsy();
        });

        it('should be disabled when the bound property to is-disabled is set to true', function () {
            scope.applyButtonIsDisabled = true;
            scope.$digest();
            expect(element.find('button')[0].disabled).toBeTruthy();
        });
    });

    describe('button text', function () {
        it('should be Next if pure-save provider', function () {
            element = test.compileTemplate('<apply-for-account product-type="pure-save">Apply NOW!</apply-for-account>');
            scope.$digest();
            expect(element.find('button')[0].innerText).toBe('Next');
        });

        it('should be Apply now if rcp provider', function () {
            element = test.compileTemplate('<apply-for-account product-type="rcp"></apply-for-account>');
            scope.$digest();
            expect(element.find('button')[0].innerText.trim()).toBe('Apply now');
        });
    });

    describe('Current Account Type', function () {

        beforeEach(function () {
            element = test.compileTemplate('<apply-for-account product-type="current-account"></apply-for-account>');
            element.find('button').click();
            scope.$digest();
        });

        it('should start current account application', function () {
            expect(CurrentAccountApplication.isNew()).toBeTruthy();
        });

        it('should create the flow with the current account application steps', function () {
            expect(_.map(Flow.steps(), 'name')).toEqual(['Details', 'Offer', 'Accept', 'Finish']);
        });

        it('should have the flow header as Your Details', function () {
            expect(Flow.get().headerName).toEqual('Your Details');
        });

        it('should go to current account pre-screen page', inject(function ($location) {
            expect($location.path()).toEqual('/apply/current-account/pre-screen');
        }));

    });


});


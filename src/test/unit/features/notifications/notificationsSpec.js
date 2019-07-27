describe('Notifications', function () {
    'use strict';

    var scope, test;

    beforeEach(module('refresh.notifications'));

    beforeEach(inject(function (_TemplateTest_) {
        scope = _TemplateTest_.scope;
        test = _TemplateTest_;
    }));

    it('should render the info notification markup', function () {
        var element = test.compileTemplate('<div notification></div>');
        expect(element.hasClass('notification')).toBeTruthy();
        expect(scope.hideNotification).toBeFalsy();
    });

    it('should display info message inside notification markup', function() {
        var element = test.compileTemplate('<div notification>This is a message</div>');
        expect(element.text()).toEqual('This is a message');
    });

    describe('close button', function() {
        it('should have a close button', function(){
            var element = test.compileTemplate('<div notification>This is a message</div>');
            expect(element.find('.icon-times-circle').length).toEqual(1);
        });

        it('should add closing class when clicked', function() {
            var element = test.compileTemplate('<div notification>Some message</div>');
            expect(element.hasClass('closing')).toBeFalsy();
            element.find('.icon-times-circle').trigger('click');
            expect(element.hasClass('closing')).toBeTruthy();
        });

        it('should unset is successful in success message when clicked', function() {
            scope.isSuccessful = true;
            var element = test.compileTemplate('<div notification class="success">Some message</div>');
            element.find('.icon-times-circle').trigger('click');
            expect(scope.isSuccessful).toBeFalsy();
        });

        it('should unset error message in error message when clicked', function() {
            scope.errorMessage = 'asd';
            var element = test.compileTemplate('<div notification class="error">Some message</div>');
            element.find('.icon-times-circle').trigger('click');
            expect(scope.errorMessage).toBeFalsy();
        });

        it('should unset has info in info message when clicked', function() {
            scope.hasInfo = true;
            var element = test.compileTemplate('<div notification class="info">Some message</div>');
            element.find('.icon-times-circle').trigger('click');
            expect(scope.hasInfo).toBeFalsy();
        });

        it('should unset cancel field on parent scope', function() {
            scope.thisIsACancelField = true;
            var element = test.compileTemplate('<div notification class="success" cancelField="thisIsACancelField">Some message</div>');
            element.find('.icon-times-circle').trigger('click');
            expect(scope.thisIsACancelField).toBeFalsy();
        });
    });

    describe('info', function () {
        it('should render the info notification markup', function () {
            var element = test.compileTemplate('<div info notification></div>');
            expect(element.hasClass('info')).toBeTruthy();
        });
    });

    describe('error', function () {
        it('should render the error notification markup', function () {
            var element = test.compileTemplate('<div error notification></div>');
            expect(element.hasClass('error')).toBeTruthy();
        });
    });

    describe('success', function () {
        it('should render the success notification markup', function () {
            var element = test.compileTemplate('<div success notification></div>');
            expect(element.hasClass('success')).toBeTruthy();
        });
    });
});


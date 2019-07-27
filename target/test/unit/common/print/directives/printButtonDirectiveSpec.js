describe('Print button directive', function () {
    'use strict';

    beforeEach(module('refresh.printButtonDirective', 'refresh.test'));

    var templateTest, scope;

    beforeEach(inject(function (TemplateTest) {
        templateTest = TemplateTest;
        scope = templateTest.scope;
        templateTest.allowTemplate('common/print/partials/printButton.html');
    }));

    it('should show a print button with and id of print', function () {
        var document = templateTest.compileTemplate('<print-button></print-button>');
        expect(document.find('button#print').length).toBe(1);
    });

    it('should have a title', function () {
        var document = templateTest.compileTemplate('<print-button></print-button>');
        expect(document.find('button').attr('title')).toBe('print');
    });

    it ('should default the button text to Print', function () {
        var document = templateTest.compileTemplate('<print-button></print-button>');
        expect(document.find('button').text()).toBe('Print');
    });

    it('should set the button text', function () {
        var document = templateTest.compileTemplate('<print-button button-text="Other Text"></print-button>');
        expect(document.find('button').text()).toBe('Other Text');
    });

    it('should add any additional classes to the button', function () {
        var document = templateTest.compileTemplate('<print-button button-class="bob john"></print-button>');
        expect(document.find('button').hasClass('bob')).toBeTruthy();
        expect(document.find('button').hasClass('john')).toBeTruthy();
    });

    it('should render an icon action button instead of a normal button when actionButton is specified', function () {
        var document = templateTest.compileTemplate('<print-button action-button="true"></print-button>');
        expect(document.find('button').length).toBe(0);
        expect(document.find('a.action i').length).toBe(1);
    });

    it('should not render an icon action button unless actionButton is specified', function () {
        var document = templateTest.compileTemplate('<print-button></print-button>');
        expect(document.find('button').length).toBe(1);
        expect(document.find('a.action i').length).toBe(0);
    });

    it('should call window.print on click', inject(function ($window) {
        var windowSpy = spyOn($window, 'print');
        var document = templateTest.compileTemplate('<print-button></print-button>');
        document.find('button').click();
        expect(windowSpy).toHaveBeenCalled();
    }));

    it('should pass through the track-click attribute to the button', function () {
        var document = templateTest.compileTemplate('<print-button button-track-click="{{\'something\' + \'clicky\'}}"></print-button>');
        expect(document.find('button').attr('track-click')).toBe('somethingclicky');
    });

    it('should bind a click event if passed through', function () {
        scope.id = 10;
        scope.printDifferent = jasmine.createSpy('printDifferent');
        var document = templateTest.compileTemplate('<print-button button-click="printDifferent(id)"></print-button>');
        document.find('button').click();
        expect(scope.printDifferent).toHaveBeenCalledWith(10);
    });

    it('should be hidden on mobile devices', inject(function ($rootScope) {
        $rootScope.isMobileDevice = true;
        var document = templateTest.compileTemplate('<print-button></print-button>');
        expect(document.find('button#print').length).toBe(0);
    }));

    it('should be shown on not mobile devices', inject(function ($rootScope) {
        $rootScope.isMobileDevice = false;
        var document = templateTest.compileTemplate('<print-button></print-button>');
        expect(document.find('button#print').length).toBe(1);
    }));

});

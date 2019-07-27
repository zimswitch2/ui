describe('convertToInt', function () {
    beforeEach(module('refresh.directives.converttoint'));
    var scope, test;

    beforeEach(inject(function ($rootScope, _TemplateTest_) {
        scope = $rootScope.$new();
        test = _TemplateTest_;
    }));

    it('should parse view as integer', function () {
        var document = test.compileTemplate('<input type="text" ng-model="intField" convert-to-int/>');
        test.scope.$digest();
        test.changeInputValueTo(document, '500');
        expect(test.scope.intField).toEqual(500);
    });

    it('should parse view as integer', function () {
        var document = test.compileTemplate('<input type="text" ng-model="intField" convert-to-int/>');
        test.scope.$digest();
        test.changeInputValueTo(document, '500.00');
        expect(test.scope.intField).toEqual(500);
    });

    it('should not parse invalid integer', function () {
        var document = test.compileTemplate('<input type="text" ng-model="intField" convert-to-int/>');
        test.scope.$digest();
        test.changeInputValueTo(document, '500foo');
        expect(test.scope.intField).toEqual(undefined);
    });
});

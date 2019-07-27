describe('walkInBranches directive', function () {
    'use strict';

    beforeEach(module('refresh.bankAndBranch.walkInBranches', 'refresh.test'));

    var test, scope, customerInformationData;

    var branches = [
        {name: 'Branch 113', code: '113'},
        {name: 'Branch 114', code: '114'},
        {name: 'Branch 115', code: '115'}
    ];

    beforeEach(inject(function (_TemplateTest_, BankService, CustomerInformationData, mock) {
        test = _TemplateTest_;
        customerInformationData = CustomerInformationData;

        test.allowTemplate('common/bankAndBranch/partials/walkInBranches.html');

        spyOn(BankService, ['walkInBranches']).and.returnValue(mock.resolve(branches));
    }));

    it('should require an ng-model', function () {
        var template = '<walk-in-branches id="myItem" ng-required="true"></walk-in-branches>';
        var error;
        try {
            test.compileTemplate(template);
        }
        catch (e) {
            error = e;
        }

        expect(error).toMatch("Controller 'ngModel', required by directive 'walkInBranches', can't be found!");
    });

    it('should set placeholder on type ahead', function () {
        var autocomplete = '<walk-in-branches placeholder="Test" ng-required="true" ng-model="the.model"></walk-in-branches>';
        var element = test.compileTemplate(autocomplete);

        expect(element.find('sb-typeahead').attr('placeholder')).toEqual('Test');
    });

    describe('when loading branches', function () {
        it('should set type ahead items to list of branches from BankService', function () {
            var autocomplete = '<walk-in-branches ng-model="the.model"></walk-in-branches>';
            var element = test.compileTemplate(autocomplete);
            var directiveScope = element.isolateScope();

            var itemsAttribute = element.find('sb-typeahead').attr('items');
            expect(directiveScope[itemsAttribute]).toEqual(branches);
        });

        it ("should set selected item to customer's preferred branch if default-to-preferred-branch is true", function () {
            customerInformationData.initialize({branchCode: 115});

            var autocomplete = '<walk-in-branches ng-model="externalModel" default-to-preferred-branch="true" default-branch-selected="hasDefaultBranch"></walk-in-branches>';
            var element = test.compileTemplate(autocomplete);
            var directiveScope = element.isolateScope();

            expect(directiveScope.values.modelValue).toEqual({name: 'Branch 115', code: '115'});
            expect(test.scope.externalModel).toEqual({name: 'Branch 115', code: '115'});
        });

        it ("should not set selected item to customer's preferred branch if default-to-preferred-branch is false", function () {
            customerInformationData.initialize({branchCode: 115});

            var autocomplete = '<walk-in-branches ng-model="externalModel" default-to-preferred-branch="false"></walk-in-branches>';
            var element = test.compileTemplate(autocomplete);
            var directiveScope = element.isolateScope();

            expect(directiveScope.values.modelValue).toBeUndefined();
            expect(test.scope.externalModel).toBeUndefined();
        });

        it ("should not set selected item to customer's preferred branch if it isn't on the branch list", function () {
            customerInformationData.initialize({branchCode: 300});

            var autocomplete = '<walk-in-branches ng-model="externalModel" default-to-preferred-branch="true"></walk-in-branches>';
            var element = test.compileTemplate(autocomplete);
            var directiveScope = element.isolateScope();

            expect(directiveScope.values.modelValue).toBeUndefined();
            expect(test.scope.externalModel).toBeUndefined();
        });

        it ("should not set selected item to customer's preferred branch if it isn't defined", function () {
            customerInformationData.initialize({branchCode: undefined});

            var autocomplete = '<walk-in-branches ng-model="externalModel" default-to-preferred-branch="true"></walk-in-branches>';
            var element = test.compileTemplate(autocomplete);
            var directiveScope = element.isolateScope();

            expect(directiveScope.values.modelValue).toBeUndefined();
            expect(test.scope.externalModel).toBeUndefined();
        });

        it ('should set defaultBranchSelected to true if preferred branch has been selected', function () {
            customerInformationData.initialize({branchCode: 115});

            var autocomplete = '<walk-in-branches ng-model="the.model" default-to-preferred-branch="true" default-branch-selected="hasDefaultBranch"></walk-in-branches>';
            var element = test.compileTemplate(autocomplete);
            var directiveScope = element.isolateScope();

            expect(directiveScope.defaultBranchSelected).toBeTruthy();
            expect(test.scope.hasDefaultBranch).toBeTruthy();
        });

        it ('should set defaultBranchSelected to false if preferred branch has not been selected', function () {
            var autocomplete = '<walk-in-branches ng-model="the.model" default-to-preferred-branch="true" default-branch-selected="hasDefaultBranch"></walk-in-branches>';
            var element = test.compileTemplate(autocomplete);
            var directiveScope = element.isolateScope();

            expect(directiveScope.defaultBranchSelected).toBeFalsy();
            expect(test.scope.hasDefaultBranch).toBeFalsy();
        });
    });

    describe('model changes', function () {
        it('should change external scope value when type ahead selection changes', function () {
            var testOnChange = '<walk-in-branches ng-model="externalModel" default-to-preferred-branch="false" default-branch-selected="hasDefaultBranch"></walk-in-branches>';
            var element = test.compileTemplate(testOnChange);
            var directiveScope = element.isolateScope();

            var ngModelController = element.find('sb-typeahead').controller('ngModel');
            ngModelController.$setViewValue(directiveScope.walkInBranches[0]);

            expect(test.scope.externalModel).toBe(directiveScope.walkInBranches[0]);
        });

        it('should set external scope to code property when use-branchcode-value attribue is set to true', function(){
            var testOnChange = '<walk-in-branches use-branchcode-value="true" ng-model="externalModel" default-to-preferred-branch="false" default-branch-selected="hasDefaultBranch"></walk-in-branches>';
            var element = test.compileTemplate(testOnChange);
            var directiveScope = element.isolateScope();

            var ngModelController = element.find('sb-typeahead').controller('ngModel');
            ngModelController.$setViewValue(directiveScope.walkInBranches[0]);

            expect(test.scope.externalModel).toBe(parseInt(directiveScope.walkInBranches[0].code));
        });

        it('should change type ahead selection value when external scope value changes', function () {
            var testOnChange = '<walk-in-branches ng-model="externalModel" default-to-preferred-branch="false" default-branch-selected="hasDefaultBranch"></walk-in-branches>';
            var element = test.compileTemplate(testOnChange);
            var directiveScope = element.isolateScope();

            test.scope.externalModel = directiveScope.walkInBranches[0];
            test.scope.$digest();

            expect(directiveScope.values.modelValue).toBe(directiveScope.walkInBranches[0]);
        });
    });
});
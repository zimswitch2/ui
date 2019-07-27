describe('parameters', function () {
    'use strict';

    var applicationParameterService;
    beforeEach(module('refresh.parameters'));

    beforeEach(inject(function (ApplicationParameters) {
        applicationParameterService = ApplicationParameters;
    }));

    describe('when a global parameter needs to be defined', function () {
        it('should have a global key when one is pushed', function () {
            applicationParameterService.pushVariable('beneficiaryName', 'Name1');
            expect(applicationParameterService.getVariable('beneficiaryName')).toEqual('Name1');
        });

        it('should know how to get the second key when two variables have been pushed', function () {
            applicationParameterService.pushVariable('variable1', 'Variable 1');
            applicationParameterService.pushVariable('variable2', 'Variable 2');

            expect(applicationParameterService.getVariable('variable1')).toEqual('Variable 1');
            expect(applicationParameterService.getVariable('variable2')).toEqual('Variable 2');
        });

        it('should know how to pop a variable off the parameters,', function () {
            applicationParameterService.pushVariable('variable1', 'Variable 1');
            expect(applicationParameterService.popVariable('variable1')).toEqual('Variable 1');
        });
        it('should know a variable can only be popped once', function () {
            applicationParameterService.pushVariable('variable1', 'Variable 1');
            applicationParameterService.popVariable('variable1');
            expect(applicationParameterService.popVariable('variable1')).toBeUndefined();
        });

    });
});

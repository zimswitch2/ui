describe('flow constructor', function () {
    'use strict';

    beforeEach(module('flow.flowConstructor', 'test.mockFunctionObjConstructor'));

    describe('When FlowConstructor({name: \'newFlow\'}) is called, ', function () {
        it(', it should return a flow instance with the name \'newFlow\'', inject(function (FlowConstructor) {
            expect(FlowConstructor({name: 'newFlow'}).getName()).toBeDefined();
        }));
    });

    describe('Given a \'newFlow\' object has been constructed with a start function', function () {
        var newFlow, mockedStartFuncObj;

        beforeEach(inject(function (FlowConstructor, MockFunctionObjConstructor) {
            mockedStartFuncObj = MockFunctionObjConstructor();
            newFlow = FlowConstructor({name: 'newFlow', start: mockedStartFuncObj.getMockedFunc()});
        }));

        var promiseResolutionScenarioList = ['success', 'failure'];

        beforeEach(function () {
            newFlow.addPromiseResolutionScenarios(promiseResolutionScenarioList);
        });


        describe('When the flow is started', function () {
            var argumentsList = [];
            beforeEach(function () {
                newFlow.start.apply(argumentsList);
            });

            it('it should have called the mockedStartFuncObj with' + argumentsList, function () {
                expect(mockedStartFuncObj.getArguments()).toEqual(argumentsList);
            });
        });

        describe('Given a list of resolution scenarios have been added', function () {

            using(promiseResolutionScenarioList, function (promiseResolutionScenario) {
                it(', it should add the ' + promiseResolutionScenario + ' promise resolution scenario to \'newFlow\' as a function', function () {
                    expect(newFlow[promiseResolutionScenario]).toBeDefined();
                });

                describe('Given the resolution behavior for the ' + promiseResolutionScenario + ' promise resolution scenario has been defined', function () {
                    var mockedTestFuncObj;
                    beforeEach(inject(function (MockFunctionObjConstructor) {
                        mockedTestFuncObj = MockFunctionObjConstructor();
                        var testFunc = mockedTestFuncObj.getMockedFunc();
                        newFlow[promiseResolutionScenario](testFunc);
                    }));
                    describe('. When resolution of the ' + promiseResolutionScenario + ' promise resolution scenario occurs', function () {
                        it(', it should execute the defined function', function () {
                            newFlow.resolve(promiseResolutionScenario);
                            expect(mockedTestFuncObj.getCallCount()).toBe(1);
                        });

                        describe('. Given an Array resolution arguments where provided', function () {
                            it(', it should pass the arguments to the defined function', function () {
                                var argumentsList = ['car', 'monkey', 'el loco'];
                                newFlow.resolve(promiseResolutionScenario, argumentsList);
                                expect(mockedTestFuncObj.getArguments()).toEqual(argumentsList);
                            });
                        });
                        describe('. Given one resolution argument', function () {
                            it(', it should pass the argument to the defined function', function () {
                                var argument = 'Magic Monkey';
                                newFlow.resolve(promiseResolutionScenario, argument);
                                expect(mockedTestFuncObj.getArguments()).toEqual([argument]);
                            });
                        });
                    });
                });
            });
        });
    });

    describe('Given a \'newFlow\' object has been constructed without a start function', function () {
        var newFlow;

        beforeEach(inject(function (FlowConstructor) {
            newFlow = FlowConstructor({name: 'newFlow'});
        }));

        describe('When the newFlow is started', function () {
            it(', it should throw an error', function () {
                expect(newFlow.start).toThrow(new Error('newFlow: Start function not defined, flow will do nothing'));
            });
        });

    });
});

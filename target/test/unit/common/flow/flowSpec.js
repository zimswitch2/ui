describe('Flow directive', function () {

    beforeEach(module('refresh.flow', 'refresh.fixture', 'refresh.test'));

    var scope, Flow, directive;

    beforeEach(inject(function (_TemplateTest_, _Flow_) {
        scope = _TemplateTest_.scope;
        Flow = _Flow_;
        _TemplateTest_.allowTemplate('common/flow/partials/flow.html');
        directive = _TemplateTest_.compileTemplate('<flow></flow>', false);
    }));

    describe('initialization', function () {
        it('should display the flow steps when a flow is active', function () {
            Flow.create(['one', 'two', 'three']);
            scope.$apply();
            expect(directive.find('.steps li').length).toEqual(3);
        });

        it('display nothing when no flow is active', function () {
            Flow.create();
            scope.$apply();
            expect(directive.find('.steps li').length).toEqual(0);
        });
    });
});

describe('Flow', function () {
    var location, QueryStringUtility, Navigator;

    beforeEach(function () {
        location = jasmine.createSpyObj('$location', ['path']);
        location.path.and.returnValue(jasmine.createSpyObj('path', ['replace']));
        module(function ($provide) {
            $provide.value('$location', location);
        }, 'refresh.flow');
    });

    beforeEach(module('refresh.flow'));

    beforeEach(module(function ($provide) {
        QueryStringUtility = jasmine.createSpyObj('QueryStringUtility', ['getParameter']);
        Navigator = jasmine.createSpyObj('Navigator', ['redirect']);

        $provide.value('QueryStringUtility', QueryStringUtility);
        $provide.value('Navigator', Navigator);
    }));

    var Flow, DigitalId;
    beforeEach(inject(function (_Flow_, _DigitalId_) {
        Flow = _Flow_;
        DigitalId = _DigitalId_;
    }));

    describe('headerName', function () {
        it('should get header name', function () {
            var expectedName = 'header name';
            var flow = Flow.create([], expectedName);
            expect(flow.getHeaderName()).toEqual(expectedName);
        });
    });

    describe('create', function () {
        it('should not have data when given empty steps', function () {
            var flow = Flow.create([]);
            expect(flow.steps()).toEqual([]);
        });

        it('should have data when given steps with data', function () {
            var flow = Flow.create(['Step 1', 'Step 2']);
            expect(flow.steps()).toEqual([
                {name: 'Step 1', current: true, complete: false},
                {name: 'Step 2', current: false, complete: false}
            ]);
        });
    });

    describe('next', function () {
        it('should complete the earliest step that is not completed', function () {
            var flow = Flow.create(['Step 1', 'Step 2', 'Step 3']);
            flow.next();
            expect(flow.steps()).toEqual([
                {name: 'Step 1', current: false, complete: true},
                {name: 'Step 2', current: true, complete: false},
                {name: 'Step 3', current: false, complete: false}
            ]);
        });

        it('should know when there are no current steps in the next flow', function () {
            var flow = Flow.create(['Step 1'], 'Test');
            flow.next();
            flow.next();

            expect(Flow.steps()).toEqual([{name: 'Step 1', complete: true, current: true}]);
        });

        it('should keep the last step current when it is completed', function () {
            var flow = Flow.create(['Step 1', 'Step 2', 'Step 3']);
            flow.next();
            flow.next();
            flow.next();
            expect(flow.steps()).toEqual([
                {name: 'Step 1', current: false, complete: true},
                {name: 'Step 2', current: false, complete: true},
                {name: 'Step 3', current: true, complete: true}
            ]);
        });
    });

    describe('destroy', function () {
        it('should destroy flow when destroy function is called', function () {
            var flow = Flow.create(['Step 1', 'Step 2', 'Step 3'], 'Flow Header');
            expect(Flow.getHeaderName()).toEqual('Flow Header');

            flow.destroy();
            expect(Flow.steps()).toEqual([]);
            expect(Flow.getHeaderName()).toBeUndefined();
        });
    });

    describe('modify', function () {
        it('should modify flow - the current step', function () {
            var flow = Flow.create(['Step 1', 'Step 2', 'Step 3']);
            flow.modify('Step 1', 'Changed');
            expect(Flow.steps()).toEqual([
                {"name": "Changed", "complete": false, "current": true},
                {"name": "Step 2", "complete": false, "current": false },
                {"name": "Step 3","complete": false,"current": false}
            ]);
        });

        it('should modify flow - not current step', function () {
            var flow = Flow.create(['Step 1', 'Step 2', 'Step 3']);
            flow.modify('Step 2', 'Changed');
            expect(Flow.steps()).toEqual([
                {"name": "Step 1", "complete": false, "current": true},
                {"name": "Changed", "complete": false, "current": false },
                {"name": "Step 3","complete": false,"current": false}
            ]);
        });
        it('should modify flow - the last step', function () {
            var flow = Flow.create(['Step 1', 'Step 2', 'Step 3']);
            Flow.next();
            Flow.next();
            flow.modify('Step 3', 'Changed');
            expect(Flow.steps()).toEqual([
                {"name": "Step 1", "complete": true, "current": false},
                {"name": "Step 2", "complete": true, "current": false },
                {"name": "Changed","complete": false,"current": true}
            ]);
        });

        it('should not modify flow - step does not exist', function () {
            var flow = Flow.create(['Step 1', 'Step 2', 'Step 3']);
            flow.modify('Step 4', 'Changed');
            expect(Flow.steps()).toEqual([
                {"name": "Step 1", "complete": false, "current": true},
                {"name": "Step 2", "complete": false, "current": false },
                {"name": "Step 3","complete": false,"current": false}
            ]);
        });
    });

    describe('previous', function () {
        it('should complete the earliest step that is not completed', function () {
            Flow.create(['Step 1', 'Step 2', 'Step 3'], 'Test');
            Flow.next();
            Flow.next();
            Flow.previous();

            expect(Flow.steps()).toEqual([
                {name: 'Step 1', current: false, complete: true},
                {name: 'Step 2', current: true, complete: false},
                {name: 'Step 3', current: false, complete: false}
            ]);
        });

        it('should not complete the step that is not completed', function () {
            Flow.create(['Step 1', 'Step 2', 'Step 3'], 'Test');
            Flow.previous();

            expect(Flow.steps()).toEqual([
                {name: 'Step 1', complete: false, current: true},
                {name: 'Step 2', complete: false, current: false},
                {name: 'Step 3', complete: false, current: false}
            ]);
        });

        it('should return an empty list when there are no steps', function () {
            Flow.previous();
            expect(Flow.steps()).toEqual([]);
        });
    });

    describe('currentStep', function () {
        it('should return the current step', function () {
            Flow.create(['Step 1', 'Step 2', 'Step 3'], 'Test');
            Flow.next();

            expect(Flow.currentStep()).toEqual({name: 'Step 2', complete: false, current: true});
        });
    });

    describe('cancel', function () {
        describe('When the referer parameter is not in the url', function () {
            beforeEach(function () {
                QueryStringUtility.getParameter.and.returnValue(undefined);
            });

            it('should navigate to the default page if no page is specified', function () {
                DigitalId.authenticate('token');
                Flow.create(['Step 1'], 'Flow Header');
                Flow.cancel();
                expect(location.path).toHaveBeenCalledWith('/transaction/dashboard');
            });

            it('should navigate to the specified page', function () {
                DigitalId.authenticate('token');
                Flow.create(['Step 1'], 'Flow Header', 'testUrl');
                Flow.cancel();
                expect(location.path).toHaveBeenCalledWith('testUrl');
            });

            it('should navigate to login page when not authenticated', function () {
                Flow.create(['Step 1'], 'Flow Header');
                Flow.cancel();
                expect(location.path).toHaveBeenCalledWith('/login');
            });


        });

        describe('When the referer parameter is in the url', function () {
            var url = 'www.google.com';

            beforeEach(function () {
                QueryStringUtility.getParameter.and.returnValue(url);
            });

            it('it should navigate to the referer', function () {
                Flow.cancel();
                expect(Navigator.redirect).toHaveBeenCalledWith(url);
            });
        });

        it('should be able to set cancelable', function () {
            var canceleable = true;
            Flow.create(['Step 1'], 'Flow Header', '', canceleable);
            expect(Flow.cancelable()).toBeTruthy();

            canceleable = false;
            Flow.create(['Step 1'], 'Flow Header', '', canceleable);
            expect(Flow.cancelable()).toBeFalsy();

            canceleable = undefined;
            Flow.create(['Step 1'], 'Flow Header', '', canceleable);
            expect(Flow.cancelable()).toBeTruthy();
        });
    });
});

describe('ViewModel', function () {
    beforeEach(module('refresh.flow'));

    var ViewModel;
    beforeEach(inject(function (_ViewModel_) {
        ViewModel = _ViewModel_;
    }));

    it('should return an empty object when initializing', function () {
        expect(ViewModel.initial()).toEqual({});
    });

    it('should return the model that has been set previously', function () {
        ViewModel.current({hey: 'ho'});
        expect(ViewModel.current()).toEqual({hey: 'ho'});
    });

    it('should return object when initializing after an error has happened', function () {
        ViewModel.current({something: true});
        ViewModel.error({message: 'oops'});

        expect(ViewModel.initial()).toEqual({something: true, error: 'oops'});
    });

    it('should know if it is in an initial state', function () {
        expect(ViewModel.isInitial()).toBeTruthy();
        ViewModel.current({hey: 'ho'});
        expect(ViewModel.isInitial()).toBeFalsy();
    });

    it('should mark view model for modification', function () {
        ViewModel.current({hey: 'ho'});
        expect(ViewModel.initial()).toEqual({});

        ViewModel.current({hey: 'ho'});
        ViewModel.modifying();
        expect(ViewModel.initial()).toEqual({hey: 'ho'});
    });

    it('should forget about the past when initializing', function () {
        ViewModel.current({hey: 'ho'});
        ViewModel.initial();
        expect(ViewModel.isInitial()).toBeTruthy();
    });

    it('should clear error when explicitly modifying', function () {
        ViewModel.initial();
        ViewModel.current({hey: 'ho'});
        ViewModel.error({message: 'oops'});
        expect(ViewModel.initial()).toEqual(jasmine.objectContaining({error: 'oops'}));
        ViewModel.current({hey: 'heyheyhey', error: 'oops'});
        ViewModel.modifying();
        expect(ViewModel.initial()).not.toEqual(jasmine.objectContaining({error: 'oops'}));
    });
});

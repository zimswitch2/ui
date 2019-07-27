describe('form tracker service with DTM loaded', function() {
    var formTrackerSpy = jasmine.createSpyObj('formtracker', ['trigger']);
    window.formtracker = formTrackerSpy;

    beforeEach(module('refresh.formtracker'));

    beforeEach(inject(function(_formTrackerService_) {
        var formTrackerService = _formTrackerService_;    
        formTrackerService.triggerChangeOn('input-name');
    }));

    it('should call trigger on the formtracker', function() {
        expect(formTrackerSpy.trigger).toHaveBeenCalled();
    });
});

describe('form tracker service without DTM loaded', function() {
    var formTrackerSpy = jasmine.createSpyObj('formtracker', ['trigger']);

    beforeEach(module('refresh.formtracker'));

    beforeEach(function() {
        delete window.formtracker;
    });

    beforeEach(inject(function(_formTrackerService_) {
        var formTrackerService = _formTrackerService_;    
        formTrackerService.triggerChangeOn('input-name');
    }));

    it('should not call trigger on the formtracker', function() {
        expect(formTrackerSpy.trigger).not.toHaveBeenCalled();
    });
});


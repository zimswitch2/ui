describe('ErrorLogger', function () {

    beforeEach(module('refresh.errorLogger'));

    var ServiceEndpoint, ServiceTest, ErrorLogger;

    beforeEach(inject(function (_ServiceEndpoint_, _ServiceTest_, _ErrorLogger_) {
        ServiceEndpoint = _ServiceEndpoint_;
        ServiceTest = _ServiceTest_;
        ErrorLogger = _ErrorLogger_;
    }));

    it('should send error to error service', function () {
        ServiceTest.spyOnEndpoint('errorFeedback');
        ErrorLogger.send('Test Error');
        expect(ServiceEndpoint['errorFeedback'].makeRequest).toHaveBeenCalledWith({ error: 'Test Error'});
    });
});

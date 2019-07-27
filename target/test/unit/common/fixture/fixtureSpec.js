describe('Fixture', function () {
    var xhr;

    beforeEach(module('refresh.fixture'));

    beforeEach(inject(function ($window) {
        xhr = jasmine.createSpyObj('xhr', ['open', 'send', 'onload']);
        spyOn($window, 'XMLHttpRequest').and.returnValue(xhr);
    }));

    it('should switch base/main/features/security/fixtures/cardNumberResponse.json to base/main/features/security/fixtures/cardNumberAndPersonIdResponse.json if personal finance management feature is toggled on', inject(function (_Fixture_) {
        personalFinanceManagementFeature = true;
        _Fixture_.load('base/main/features/security/fixtures/cardNumberResponse.json');
        expect(xhr.open).toHaveBeenCalledWith('GET', 'base/main/features/security/fixtures/cardNumberAndPersonIdResponse.json', false);
    }));

    it('should not switch base/main/features/security/fixtures/cardNumberResponse.json if personal finance management feature is toggled off', inject(function (_Fixture_) {
        personalFinanceManagementFeature = false;
        _Fixture_.load('base/main/features/security/fixtures/cardNumberResponse.json');
        expect(xhr.open).toHaveBeenCalledWith('GET', 'base/main/features/security/fixtures/cardNumberResponse.json', false);
        personalFinanceManagementFeature = true;
    }));

    it('should make a get call to load the fixture', inject(function (_Fixture_) {
        _Fixture_.load('url');
        expect(xhr.open).toHaveBeenCalledWith('GET', 'url', false);
        expect(xhr.send).toHaveBeenCalled();
    }));
});
describe('Unit - LithiumHelper', function () {
    var LithiumHelper,
        ssoUrl = 'http://community.stage.standardbank.co.za/kfxpy69559/sso?sso_value=~2oglfpX5vDqwQvUya~pro_usNSTZ4pVZ0kyy43Gyc0lSp5OKTzYKhEx8WBFGLr1vYWB0_355ZeSiE_LqFEghtzuNi1TkLH3G19qiPII9MQjTNmIuCmJ-L5Vo21A1RocVhWStV4aed1uj_73rDuvJGzVYaFZ39ufkOiTSRTOyMS65zJHAcZtGNJhVMep12TUXoHMX28qYhYw5akre44dwl29Lm5iM3F11_G22Kp4nWtTfRZBXW6m35jRrocGKgiJocEdntpkSU5FiIYn2W9Yn0evCSDFCS0inckIuN-al_lKFypNH2-BZRoumQh7moZ-kUnWlHynFyP5kWwgAPJanBlAjl3RLJMl3USzJTQZFxDJY_5ocBqCZ1RusK2gfRbZYOBk3JHCw2HTaSv3cqZfYx0FPpED0jPt9SEIR2wjw..',
        validLithiumUrlList = ['http://community.stage.standardbank.co.za/t5/Ideas/idb-p/Stories/monkey/car', 'http://community.stage.standardbank.co.za/t5/Mobile-Apps/ct-p/Mobile','https://community.stage.standardbank.co.za/'],
        invalidReferrerUrlList = ['\'\'', '\'www.google.com\''];



    beforeEach(module('lithium.lithiumHelper'));

    using(validLithiumUrlList, function (validLithiumUrl) {

        describe('Given the valid Lithium url: ' + validLithiumUrl, function () {
            beforeEach(function () {
                var queryStringUtility = jasmine.createSpyObj('QueryStringUtility', ['getParameter']);

                module(function ($provide) {
                    $provide.value('QueryStringUtility', queryStringUtility);
                    $provide.constant('Referrer', validLithiumUrl);
                });
            });

            beforeEach(inject(function (_LithiumHelper_) {
                LithiumHelper = _LithiumHelper_;
            }));

            describe('When LithiumHelper.isFromLithium(' + validLithiumUrl + ')', function () {
                it(', it should return true', function () {
                    expect(LithiumHelper.isFromLithium()).toEqual(true);
                });
            });
        });
    });

    using(invalidReferrerUrlList, function (invalidLithiumUrl) {

        describe('Given the invalid Lithium url: ' + invalidLithiumUrl, function () {

            beforeEach(function () {
                var queryStringUtility = jasmine.createSpyObj('QueryStringUtility', ['getParameter']);

                module(function ($provide) {
                    $provide.value('QueryStringUtility', queryStringUtility);
                    $provide.constant('Referrer', invalidLithiumUrl);
                });
            });

            beforeEach(inject(function (_LithiumHelper_) {
                LithiumHelper = _LithiumHelper_;
            }));

            describe('When LithiumHelper.isFromLithium(' + invalidLithiumUrl + ')', function () {
                it(', it should return false', function () {
                    expect(LithiumHelper.isFromLithium(invalidLithiumUrl)).toBe(false);
                });
            });
        });
    });

    describe('Given the redirect url has been set', function () {
        var referrer, Navigator, QueryStringUtility, $rootScope;

        describe(', when redirectToLithium() is called with a url', function () {

            beforeEach(function () {
                var queryStringUtility = jasmine.createSpyObj('QueryStringUtility', ['getParameter']),
                    navigator = jasmine.createSpyObj('Navigator', ['redirect']);

                module(function ($provide) {
                    $provide.value('QueryStringUtility', queryStringUtility);
                    $provide.value('Navigator', navigator);
                });
            });

            beforeEach(inject(function (_Navigator_, _QueryStringUtility_, _$rootScope_, _LithiumHelper_) {
                referrer = 'http://community.stage.standardbank.co.za/t5/Ideas/idb-p/Stories';
                Navigator = _Navigator_;
                QueryStringUtility = _QueryStringUtility_;
                LithiumHelper = _LithiumHelper_;
                QueryStringUtility.getParameter.and.returnValue(referrer);
                $rootScope = _$rootScope_;
            }));

            beforeEach(function () {
               LithiumHelper.redirectToLithium(ssoUrl);
            });

            it(', it should append the referer url as a parameter at the end of the ssoUrl', function () {
                $rootScope.$digest();
                expect(Navigator.redirect).toHaveBeenCalledWith(ssoUrl + '&referer=' + referrer);
            });

            it(', it should call QueryStringUtility.getParameter(\'referer\')', function () {
                $rootScope.$digest();
                expect(QueryStringUtility.getParameter).toHaveBeenCalledWith('referer');
            });
        });
    });
});
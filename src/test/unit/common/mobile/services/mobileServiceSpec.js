describe('mobile', function () {
    beforeEach(module('refresh.mobile'));

    var mobileService, originalUserAgent, originalVendor, originalOpera, dollarWindow;

    beforeEach(inject(function ($window, MobileService) {
        mobileService = MobileService;
        dollarWindow = $window;
        originalUserAgent = $window.navigator.userAgent;
        originalVendor = $window.navigator.userAgent;
        originalOpera = $window.opera;
    }));

    using(['generic_winmo_opera_sub1000beta',
        'nokia_generic_symbian3',
        'opwv_v63_generic',
        'generic_netfront_ver4_0',
        'generic_netfront_ver4_1',
        'nokia_generic_maemo',
        'blackberry_generic_ver6',
        'blackberry_generic_ver5',
        'android',
        'ipad',
        'playbook',
        'silk'], function (value) {
        it('should identify device as mobile when the device is ' + value, function () {
            dollarWindow.navigator.__defineGetter__('userAgent', function () {
                return value;
            });
            expect(mobileService.isMobileDevice()).toBeTruthy();
        });
    });

    using(['Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/36.0',
        'Mozilla/5.0 (compatible, MSIE 11, Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko'], function (value) {
        it('should identify device as not mobile when the device is ' + value, function () {
            dollarWindow.navigator.__defineGetter__('userAgent', function () {
                return value;
            });
            expect(mobileService.isMobileDevice()).toBeFalsy();
        });
    });

    it('should identify device as not mobile based on navigator.vendor', function () {
        dollarWindow.navigator.__defineGetter__('userAgent', function () {
            return undefined;
        });
        dollarWindow.navigator.__defineGetter__('vendor', function () {
            return 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';
        });
        expect(mobileService.isMobileDevice()).toBeFalsy();
    });

    it('should identify device as not mobile based on window.opera', function () {
        dollarWindow.navigator.__defineGetter__('userAgent', function () {
            return undefined;
        });
        dollarWindow.navigator.__defineGetter__('vendor', function () {
            return undefined;
        });
        dollarWindow.__defineGetter__('opera', function () {
            return 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';
        });
        expect(mobileService.isMobileDevice()).toBeFalsy();
    });

    afterEach(function () {
        dollarWindow.navigator.__defineGetter__('userAgent', function () {
            return originalUserAgent;
        });
        dollarWindow.navigator.__defineGetter__('vendor', function () {
            return originalVendor;
        });
        dollarWindow.__defineGetter__('opera', function () {
            return originalOpera;
        });
    });
});
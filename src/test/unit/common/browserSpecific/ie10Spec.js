describe('Event fire on IE 10', function () {
    // SEE http://unknownerror.org/Problem/index/1219099649/angularjs-form-field-is-dirty-and-invalid-when-page-loads-on-ie10-only/
    // IE 10 bug, fixed with this hack
    'use strict';

    function setUserAgent($provide, userAgent) {
        $provide.value('$window', {
            navigator: {userAgent: userAgent},
            document: window.document,
            addEventListener: function () {
            }
        });
    }

    describe('standards compliant browsers', function () {
        beforeEach(module('hacks', function ($provide) {
            setUserAgent($provide, "Firefox");
        }));

        it('should indicate input event is available', inject(function ($sniffer) {
            expect($sniffer.hasEvent("input")).toBeTruthy();
        }));
    });

    describe('IE10', function () {
        beforeEach(module('hacks', function ($provide) {
            setUserAgent($provide, "msie 10");
        }));

        it('should indicate input event is NOT available', inject(function ($sniffer) {
            expect($sniffer.hasEvent("input")).toBeFalsy();
        }));
    });
});

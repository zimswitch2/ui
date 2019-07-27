/**
 * Custom Jasmine Matchers for IBR.
 *
 */

beforeEach(function () {

    var jasmineInstance = jasmine.addMatchers ? jasmine : this;

    jasmineInstance.addMatchers({
        toBeAFunction: function () {
            return {
                compare: function (actual) {
                    return {
                        pass: typeof(actual) === 'function'
                    };
                }
            };
        },
        toBeAnyOf: function (expecteds) {
            var result = false;
            for (var i = 0, l = expecteds.length; i < l; i++) {
                if (this.actual === expecteds[i]) {
                    result = true;
                    break;
                }
            }
            return result;
        },
        toBeHidden: function () {
            return {
                compare: function (actual) {
                    return {
                        pass: actual.hasClass('ng-hide')
                    };
                }
            };
        },
        toBePresent: function () {
            return {
                compare: function (actual) {
                    return {
                        pass: actual.length > 0
                    };
                }
            };
        }
    });
});

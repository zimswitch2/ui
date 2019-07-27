describe('Base Url Helper', function () {
    'use strict';

    beforeEach(module('refresh.baseUrlHelper'));

    var location;
    beforeEach(function () {
        location = jasmine.createSpyObj('$location', ['absUrl']);
        module(function ($provide) {
            $provide.value('$location', location);
        });
    });

    beforeEach(inject(function (BaseUrlHelper) {
        this.BaseUrlHelper = BaseUrlHelper;
    }));

    var urlTests = [
        {
            description: 'really complex URL',
            url: 'https://server.bank.com:8080/sub/index.html?argument#/angular/route',
            baseUrl: 'https://server.bank.com:8080/sub'
        },
        {
            description: 'simple url',
            url: 'http://server.bank.com/index.html',
            baseUrl: 'http://server.bank.com'
        },
        {
            description: 'simple example with main',
            url: 'http://server.bank.com/main/index.html',
            baseUrl: 'http://server.bank.com/main'
        }
    ];

    using(urlTests, function(current){
        it('should use the current URL to create download URLs with ' + current.description, function () {
            location.absUrl.and.returnValue(current.url);
            expect(this.BaseUrlHelper.getBaseUrl()).toBe(current.baseUrl);
        });
    });

});

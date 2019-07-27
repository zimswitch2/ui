var dtmAnalytics = false;
if (feature.dtmAnalytics) {
    dtmAnalytics = true;
}

describe('AnalyticsContainer', function () {
    'use strict';
    beforeEach(module('refresh.analytics.container'));

    var baseUrlHelper;
    beforeEach(function () {
        baseUrlHelper = jasmine.createSpyObj('BaseUrlHelper', ['getBaseUrl']);
        module(function ($provide) {
            $provide.value('BaseUrlHelper', baseUrlHelper);
        });
    });

    beforeEach(inject(function ($location, AnalyticsContainer) {
        this.hostnameSpy = spyOn($location, 'host');
        this.AnalyticsContainer = AnalyticsContainer;
    }));

    afterEach(inject(function ($rootScope) {
        $rootScope.$digest();
    }));

    describe('when using analytics scripts hosted by us', function () {

        beforeEach(function () {
            baseUrlHelper.getBaseUrl.and.returnValue('base');
        });

        it('should return the live container on experience.standardbank.co.za host', function () {
            dtmAnalyticsFeature = false;
            this.hostnameSpy.and.returnValue('experience.standardbank.co.za');
            expect(this.AnalyticsContainer.containerUrlForHost()).toBeResolvedWith('base/assets/js/analytics/analyticsProduction.js');
        });

        it('should return the live container on encrypt1.experience.standardbank.co.za host', function () {
            dtmAnalyticsFeature = false;
            this.hostnameSpy.and.returnValue('encrypt1.experience.standardbank.co.za');
            expect(this.AnalyticsContainer.containerUrlForHost()).toBeResolvedWith('base/assets/js/analytics/analyticsProduction.js');
        });

        it('should return the live container on any.thing.experience.standardbank.co.za host', function () {
            dtmAnalyticsFeature = false;
            this.hostnameSpy.and.returnValue('any.thing.experience.standardbank.co.za');
            expect(this.AnalyticsContainer.containerUrlForHost()).toBeResolvedWith('base/assets/js/analytics/analyticsProduction.js');
        });

        it('should return the test container on umcafhtp01.standardbank.co.za host', function () {
            this.hostnameSpy.and.returnValue('umcafhtp01.standardbank.co.za');
            dtmAnalyticsFeature = false;

            expect(this.AnalyticsContainer.containerUrlForHost()).toBeResolvedWith('base/assets/js/analytics/analyticsStaging.js');
        });

        it('should return the test container on umcafhtp01.standardbank.co.za host for dtm feature', function () {
            this.hostnameSpy.and.returnValue('umcafhtp01.standardbank.co.za');
            dtmAnalyticsFeature = true;
            expect(this.AnalyticsContainer.containerUrlForHost()).toBeResolvedWith('base/assets/js/analytics/dtmstaging/f0fc90c88f0ee2cd4471f2a2a4139c66b636f5d8/satelliteLib-f4e880ba8d2357acd299d59e39458e2b1fee263c-staging.js');
        });

        it('should return the test container on umcafhtp01.standardbank.co.za host', function () {
            this.hostnameSpy.and.returnValue('umcafhtp01.standardbank.co.za');
            dtmAnalyticsFeature = false;
            expect(this.AnalyticsContainer.containerUrlForHost()).toBeResolvedWith('base/assets/js/analytics/analyticsStaging.js');
        });

        it('should return the test container on umcafhtp01.standardbank.co.za host for dtm analytics feature', function () {
            this.hostnameSpy.and.returnValue('umcafhtp01.standardbank.co.za');
            dtmAnalyticsFeature = true;
            expect(this.AnalyticsContainer.containerUrlForHost()).toBeResolvedWith('base/assets/js/analytics/dtmstaging/f0fc90c88f0ee2cd4471f2a2a4139c66b636f5d8/satelliteLib-f4e880ba8d2357acd299d59e39458e2b1fee263c-staging.js');
        });

        it('should return the test container on sbg-chop-s1.standardbank.co.za host', function () {
            this.hostnameSpy.and.returnValue('sbg-chop-s1.standardbank.co.za');
            dtmAnalyticsFeature = false;
            expect(this.AnalyticsContainer.containerUrlForHost()).toBeResolvedWith('base/assets/js/analytics/analyticsStaging.js');
        });

        it('should return the test container on sbg-chop-s1.standardbank.co.za host for dtm analytics feature', function () {
            this.hostnameSpy.and.returnValue('sbg-chop-s1.standardbank.co.za');
            dtmAnalyticsFeature = true;
            expect(this.AnalyticsContainer.containerUrlForHost()).toBeResolvedWith('base/assets/js/analytics/dtmstaging/f0fc90c88f0ee2cd4471f2a2a4139c66b636f5d8/satelliteLib-f4e880ba8d2357acd299d59e39458e2b1fee263c-staging.js');

        });

        it('should reject a container on local host', function () {
            this.hostnameSpy.and.returnValue('localhost');
            dtmAnalyticsFeature = false;
            expect(this.AnalyticsContainer.containerUrlForHost()).toBeRejected();

        });

        it('should reject a container on local host for dtm analytics feature', function () {
            this.hostnameSpy.and.returnValue('localhost');
            dtmAnalyticsFeature = true;
            expect(this.AnalyticsContainer.containerUrlForHost()).toBeRejected();

        });

        it('should reject a container on any subdomain on local host', function () {
            this.hostnameSpy.and.returnValue('some.localhost.domain:12345');
            dtmAnalyticsFeature = false;
            expect(this.AnalyticsContainer.containerUrlForHost()).toBeRejected();

        });

        it('should reject a container on any subdomain on local host for dtm analytics feature', function () {
            this.hostnameSpy.and.returnValue('some.localhost.domain:12345');
            dtmAnalyticsFeature = true;
            expect(this.AnalyticsContainer.containerUrlForHost()).toBeRejected();

        });
    });
});

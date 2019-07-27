'use strict';

describe('idleTimer', function () {
    var DEFAULT_IDLE_DURATION = 4 * 60 * 1000;
    var DEFAULT_KEEPALIVE_INTERVAL = 3 * 60 * 1000;

    var $interval, $log, $document, $keepalive, $idleProvider, $idle, $rootScope;

    beforeEach(module('refresh.idleTimer'));

    describe('idle', function () {

        beforeEach(function () {
            angular.module('app', [], _.noop).config(['$idleProvider',
                function (_$idleProvider_) {
                    $idleProvider = _$idleProvider_;
                }
            ]);

            module('app');
        });

        var create = function (keepalive) {
            if (angular.isDefined(keepalive)) {
                $idleProvider.keepalive(keepalive);
            }
            return $idleProvider.$get($interval, $log, $rootScope, $document, $keepalive);
        };

        describe('with a real $window object', function () {
            beforeEach(function () {
                $('body').append('<canvas id="countdown-circle" width="200" height="200"></canvas>');

                inject(function (_$interval_, _$log_, _$rootScope_, _$document_) {
                    $rootScope = _$rootScope_;
                    $interval = _$interval_;
                    $log = _$log_;
                    $document = _$document_;
                });
            });

            it('document event should reset idle timer when not in warning period', function () {
                $idle = create(false);
                $idle.watch();

                $interval.flush(DEFAULT_IDLE_DURATION - 30);
                expect($idle.idlePeriodElapsed()).toBe(false);

                var e = $.Event('keydown');
                $('body').trigger(e);

                $interval.flush(DEFAULT_IDLE_DURATION + 30);
                expect($idle.idlePeriodElapsed()).toBe(true);
            });

            it('document event should NOT reset idle timer during warning period', function () {
                $idle = create(false);
                $idle.watch();

                $interval.flush(DEFAULT_IDLE_DURATION + 30);
                expect($idle.idlePeriodElapsed()).toBe(true);

                var e = $.Event('keydown');
                $('body').trigger(e);

                expect($idle.idlePeriodElapsed()).toBe(true);
            });
        });

        describe('with a fake $window object', function () {

            beforeEach(function () {
                module('app', function ($provide) {
                    var windowMock = {
                        location: jasmine.createSpyObj('location', ['reload']),
                        addEventListener: function () {}
                    };

                    $provide.value('$window', windowMock);
                });

                inject(function (_$interval_, _$log_, _$rootScope_, _$document_) {
                    $rootScope = _$rootScope_;
                    $interval = _$interval_;
                    $log = _$log_;
                    $document = _$document_;
                });

                $keepalive = {
                    start: _.noop,
                    stop: _.noop,
                    ping: _.noop
                };

                spyOn($keepalive, 'start');
                spyOn($keepalive, 'stop');
                spyOn($keepalive, 'ping');
            });

            describe('$idleProvider', function () {

                it('activeOn() should update defaults', function () {
                    expect($idleProvider).not.toBeUndefined();

                    $idleProvider.activeOn('click');

                    expect(create()._options().events).toBe('click');
                });

                it('idleDuration() should update defaults', function () {
                    expect($idleProvider).not.toBeUndefined();

                    $idleProvider.idlePeriod(500);

                    expect(create()._options().idlePeriod).toBe(500);
                });

                it('idleDuration() should throw if argument is less than or equal to zero.', function () {
                    var expected = new Error('idleDuration must be a value in seconds, greater than 0.');
                    expect(function () {
                        $idleProvider.idlePeriod(0);
                    }).toThrow(expected);

                    expect(function () {
                        $idleProvider.idlePeriod(-1);
                    }).toThrow(expected);
                });

                it('warningDuration() should update defaults', function () {
                    expect($idleProvider).not.toBeUndefined();

                    $idleProvider.warningPeriod(500);

                    expect(create()._options().warningPeriod).toBe(500);
                });

                it('warningDuration() should throw if argument is less than zero.', function () {
                    var expected = new Error('warningDuration must be a value in seconds, greater than or equal to 0.');
                    expect(function () {
                        $idleProvider.warningPeriod(-1);
                    }).toThrow(expected);
                });

                it('keepalive() should update defaults', function () {
                    $idleProvider.keepalive(false);

                    expect(create()._options().keepalive).toBe(false);
                });
            });

            describe('$idle', function () {
                var $idle;

                beforeEach(function () {
                    $idleProvider.warningPeriod(3);
                    $idle = create();
                });

                it('should not change idling state if watch is called again before the idle duration elapses', function () {
                    $idle.watch();
                    expect($idle.idlePeriodElapsed()).toBe(false);
                    expect($idle.running()).toBe(true);

                    $interval.flush(DEFAULT_IDLE_DURATION - 1);

                    $idle.watch();
                    expect($idle.idlePeriodElapsed()).toBe(false);
                    expect($idle.running()).toBe(true);
                });

                it('watch() should clear timeouts and start running', function () {
                    spyOn($interval, 'cancel');

                    $idle.watch();

                    expect($interval.cancel).toHaveBeenCalled();
                    expect($idle.running()).toBe(true);
                    expect($keepalive.start).toHaveBeenCalled();
                });

                it('watch() should not start keepalive if disabled', function () {
                    $idle = create(false);

                    $idle.watch();
                    expect($keepalive.start).not.toHaveBeenCalled();
                });

                it('should not stop keepalive when idle if keepalive integration is disabled', function () {
                    $idle = create(false);

                    $idle.watch();

                    $interval.flush(DEFAULT_IDLE_DURATION);

                    expect($keepalive.stop).not.toHaveBeenCalled();
                });

                it('should not start or ping keepalive when returning from idle if integration is disabled', function () {
                    $idle = create(false);

                    $idle.watch();
                    $interval.flush(DEFAULT_IDLE_DURATION);
                    $idle.watch();

                    expect($keepalive.ping).not.toHaveBeenCalled();
                    expect($keepalive.start).not.toHaveBeenCalled();
                });

                it('unwatch() should clear timeouts and stop running', function () {
                    $idle.watch();

                    spyOn($interval, 'cancel');

                    $idle.unwatch();

                    expect($interval.cancel).toHaveBeenCalled();
                    expect($idle.running()).toBe(false);
                });

                it('unwatch() should stop the keepalive', function () {
                    $idle.watch();

                    spyOn($interval, 'cancel');

                    $idle.unwatch();

                    expect($keepalive.stop).toHaveBeenCalled();
                });

                it('should broadcast $idleStart and stop keepalive', function () {
                    spyOn($rootScope, '$broadcast').and.callThrough();

                    $idle.watch();

                    $interval.flush(DEFAULT_IDLE_DURATION);

                    expect($rootScope.$broadcast).toHaveBeenCalledWith('$idleStart');
                    expect($keepalive.stop).toHaveBeenCalled();
                });

                it('should broadcast $idleEnd, start keepalive and ping', function () {
                    spyOn($rootScope, '$broadcast').and.callThrough();

                    $idle.watch();

                    $interval.flush(DEFAULT_IDLE_DURATION);

                    $idle.watch();

                    expect($rootScope.$broadcast).toHaveBeenCalledWith('$idleEnd');
                    expect($keepalive.ping).toHaveBeenCalled();
                    expect($keepalive.start).toHaveBeenCalled();
                });

                /*global moment:true */
                describe("count down", function () {
                    var realMoment = moment;
                    function mockMoment(second) {
                        moment = function () {
                            return realMoment('Mar 10, 2013 11:11:' + second);
                        };
                    }

                    beforeEach(function () {
                        spyOn($rootScope, '$broadcast').and.callThrough();

                        $idle.watch();

                        mockMoment('9');
                        $interval.flush(DEFAULT_IDLE_DURATION);
                    });

                    afterEach(function () {
                        // ensure idle interval doesn't keep executing after $idleStart
                        $rootScope.$broadcast.calls.reset();
                        $interval.flush(DEFAULT_IDLE_DURATION);
                        $interval.flush(DEFAULT_IDLE_DURATION);
                        expect($rootScope.$broadcast).not.toHaveBeenCalledWith('$idleStart');

                        moment = realMoment;
                    });

                    it('should count down warning and then signal timeout', function () {
                        expect($rootScope.$broadcast).toHaveBeenCalledWith('$idleStart');
                        expect($rootScope.$broadcast).toHaveBeenCalledWith('$idleWarn', 3);
                        mockMoment('10');
                        $interval.flush(1000);
                        expect($rootScope.$broadcast).toHaveBeenCalledWith('$idleWarn', 2);
                        mockMoment('11');
                        $interval.flush(1000);
                        expect($rootScope.$broadcast).toHaveBeenCalledWith('$idleWarn', 1);

                        mockMoment('12');
                        $interval.flush(1000);
                        expect($rootScope.$broadcast).toHaveBeenCalledWith('$idleTimeout');
                    });

                    it('should continue counting down warning when the device is sleeping/locked', function () {
                        mockMoment('11');
                        $interval.flush(1000);
                        expect($rootScope.$broadcast).toHaveBeenCalledWith('$idleWarn', 1);
                    });
                });

                it('watch() should interrupt countdown', function () {
                    spyOn($rootScope, '$broadcast').and.callThrough();

                    $idle.watch();
                    $interval.flush(DEFAULT_IDLE_DURATION);

                    $interval.flush(1000);

                    expect($idle.idlePeriodElapsed()).toBe(true);

                    $idle.watch();
                    expect($idle.idlePeriodElapsed()).toBe(false);
                });
            });
        });
    });

    describe('keepalive', function () {
        var $keepaliveProvider, $rootScope, $log, $interval, $http;

        beforeEach(function () {
            angular
                .module('app', [], _.noop)
                .config(['$keepaliveProvider',
                    function (_$keepaliveProvider_) {
                        $keepaliveProvider = _$keepaliveProvider_;
                    }
                ]);

            module('app');

            inject(function (_$rootScope_, _$log_, _$interval_, _$http_) {
                $rootScope = _$rootScope_;
                $log = _$log_;
                $interval = _$interval_;
                $http = _$http_;
            });
        });

        var create = function () {
            return $keepaliveProvider.$get($rootScope, $log, $interval, $http);
        };

        describe('$keepaliveProvider', function () {
            it('interval() should update options', function () {
                $keepaliveProvider.interval(10);

                expect(create()._options().interval).toBe(10);
            });

            it('interval() should throw if nan or less than or equal to 0', function () {
                expect(function () {
                    $keepaliveProvider.interval('asdsad');
                }).toThrow(new Error('Interval must be expressed in seconds and be greater than 0.'));

                expect(function () {
                    $keepaliveProvider.interval(0);
                }).toThrow(new Error('Interval must be expressed in seconds and be greater than 0.'));

                expect(function () {
                    $keepaliveProvider.interval(-1);
                }).toThrow(new Error('Interval must be expressed in seconds and be greater than 0.'));
            });
        });

        describe('$keepalive', function () {
            var $keepalive;

            beforeEach(function () {
                $keepalive = create();
                spyOn($rootScope, '$broadcast').and.callFake(function () {
                    return {defaultPrevented: true};
                });
            });

            it('start() should schedule ping timeout that broadcasts $keepalive event when it expires.', function () {
                $keepalive.start();

                $interval.flush(DEFAULT_KEEPALIVE_INTERVAL);

                expect($rootScope.$broadcast).toHaveBeenCalledWith('$keepalive');
            });

            it('stop() should cancel ping timeout.', function () {
                $keepalive.start();
                $keepalive.stop();

                $interval.flush(DEFAULT_KEEPALIVE_INTERVAL);

                expect($rootScope.$broadcast).not.toHaveBeenCalledWith('$keepalive');
            });

            it('ping() should immediately broadcast $keepalive event', function () {
                $keepalive.ping();

                $interval.flush(DEFAULT_KEEPALIVE_INTERVAL);

                expect($rootScope.$broadcast).toHaveBeenCalledWith('$keepalive');
            });
        });
    });

});

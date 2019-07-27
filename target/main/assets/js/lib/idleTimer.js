(function (app) {
    'use strict';

    var KEEPALIVE_INTERVAL = 3 * 60;
    var IDLE_PERIOD = 4 * 60;
    var WARNING_PERIOD = 60;

    function $KeepaliveProvider() {
        var options = {
            interval: KEEPALIVE_INTERVAL
        };

        this.interval = function (seconds) {
            seconds = parseInt(seconds);

            if (isNaN(seconds) || seconds <= 0) throw new Error('Interval must be expressed in seconds and be greater than 0.');
            options.interval = seconds;
        };

        this.$get = function ($rootScope, $log, $interval) {

            var state = {
                ping: null
            };

            function ping() {
                $rootScope.$broadcast('$keepalive');
            }

            return {
                _options: function () {
                    return options;
                },
                start: function () {
                    $interval.cancel(state.ping);

                    state.ping = $interval(ping, options.interval * 1000);
                },
                stop: function () {
                    $interval.cancel(state.ping);
                },
                ping: function () {
                    ping();
                }
            };
        };
        this.$get.$inject = ['$rootScope', '$log', '$interval', '$http'];
    }

    function $IdleProvider() {
        var options = {
            idlePeriod: IDLE_PERIOD,
            warningPeriod: WARNING_PERIOD,
            events: 'mousemove keydown DOMMouseScroll mousewheel mousedown touchstart',
            keepalive: true
        };

        this.activeOn = function (events) {
            options.events = events;
        };

        this.idlePeriod = function (seconds) {
            if (seconds <= 0) throw new Error("idleDuration must be a value in seconds, greater than 0.");

            options.idlePeriod = seconds;
        };

        this.warningPeriod = function (seconds) {
            if (seconds < 0) throw new Error("warningDuration must be a value in seconds, greater than or equal to 0.");

            options.warningPeriod = seconds;
        };

        this.keepalive = function (enabled) {
            options.keepalive = enabled === true;
        };

        this.$get = function ($interval, $log, $rootScope, $document, $keepalive) {
            var state = {
                idleTimer: null,
                warningTimer: null,
                idlePeriodElapsed: false,
                running: false,
                countdown: null,
                lastActivity: null
            };

            function setLastActivity(){
                return state.lastActivity = getCurrentSecond();
            }
            function startKeepalive() {
                if (!options.keepalive) return;

                if (state.running) $keepalive.ping();

                $keepalive.start();
            }

            function stopKeepalive() {
                if (!options.keepalive) return;

                $keepalive.stop();
            }

            function toggleState() {
                state.idlePeriodElapsed = !state.idlePeriodElapsed;
                var eventName = state.idlePeriodElapsed ? '$idleStart' : '$idleEnd';

                $rootScope.$broadcast(eventName);

                if (state.idlePeriodElapsed) {
                    stopKeepalive();
                    state.countdown = options.warningPeriod;
                    state.countdownStart = getCurrentSecond();
                    countdown();
                    state.warningTimer = $interval(countdown, 1000, options.warningPeriod);

                    var myCanvas = document.getElementById('countdown-circle');

                    var circle = new ProgressCircle({
                        canvas: myCanvas,
                        minRadius: 60,
                        arcWidth: 10,
                        centerX: 0,
                        centerY: 0
                    });

                    circle.addEntry({
                        fillColor: '#0496FD',
                        progressListener: function() {
                            return countdownTimer/60;
                        }
                    });

                    circle.start(0);
                } else {
                    startKeepalive();
                }

                $interval.cancel(state.idleTimer);
            }

            function countdown() {
                state.countdown = options.warningPeriod - (getCurrentSecond() - state.countdownStart);

                if (state.countdown <= 0) {
                    $rootScope.$broadcast('$idleTimeout');
                } else {
                    $rootScope.$broadcast('$idleWarn', state.countdown);
                }
            }

            function getCurrentSecond() {
                return moment().format('X');
            }

            function resetInterval(interval) {
                var intervalStart = setLastActivity();
                $interval.cancel(state.idleTimer);

                state.idleTimer = $interval(function() { intervalComplete(intervalStart); }, interval);
            }

            function intervalComplete (intervalStart) {
                if (state.lastActivity > intervalStart) {
                    var timeDelta = getCurrentSecond() - state.lastActivity;

                    resetInterval((options.idlePeriod - timeDelta) * 1000);
                } else {
                    toggleState();
                }
            }

            var svc = {
                _options: function () {
                    return options;
                },
                running: function () {
                    return state.running;
                },
                idlePeriodElapsed: function () {
                    return state.idlePeriodElapsed;
                },
                watch: function () {
                    $interval.cancel(state.idleTimer);
                    $interval.cancel(state.warningTimer);

                    if (state.idlePeriodElapsed) {
                        toggleState();
                    }
                    else if (!state.running) {
                        startKeepalive();
                    }

                    state.running = true;
                    resetInterval(options.idlePeriod * 1000);
                },
                unwatch: function () {
                    $interval.cancel(state.idleTimer);
                    $interval.cancel(state.warningTimer);

                    state.idlePeriodElapsed = false;
                    state.running = false;
                    stopKeepalive();
                }
            };

            var interrupt = function () {
                if (state.running && !state.idlePeriodElapsed) {
                    setLastActivity();
                }
            };

            $document.find('body').on(options.events, interrupt);

            return svc;
        };
        this.$get.$inject = ['$interval', '$log', '$rootScope', '$document', '$keepalive'];
    }

    app.provider('$keepalive', $KeepaliveProvider);
    app.provider('$idle', $IdleProvider);

})(angular.module('refresh.idleTimer', []));

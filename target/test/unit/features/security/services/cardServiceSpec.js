'use strict';

describe('Card Service', function () {
    describe('when feature toggle:', function () {
        describe('Meniga Services', function () {
            describe('is toggled off', function () {
                describe('with meniga services feature toggled off', function () {
                    var CardService;

                    beforeEach(function () {
                        personalFinanceManagementFeature = false;
                        module('refresh.card', 'refresh.test');
                        inject(function (_CardService_) {
                            CardService = _CardService_;
                        });
                    });

                    describe('fetch card', function () {
                        var response, test, location;

                        beforeEach(inject(function (ServiceTest, $location) {
                            test = ServiceTest;
                            test.spyOnEndpoint('cards');
                            location = $location;
                        }));

                        describe('on successful service return', function () {
                            beforeEach(function () {
                                test.stubResponse('cards', 200, {
                                    card: null,
                                    keyValueMetadata: [],
                                    stepUp: null,
                                    cards: [
                                        {
                                            cardNumber: '005222502360335109',
                                            systemPrincipalId: '956',
                                            statusCode: '0000'
                                        }
                                    ]
                                });
                            });

                            it('should be resolved with the service response', function () {
                                expect(CardService.fetchCards([])).toBeResolvedWith([{ cardNumber : '005222502360335109', systemPrincipalId : '956', statusCode : '0000' } ]);
                                test.resolvePromise();
                            });
                        });
                    });

                    afterEach(function () {
                        personalFinanceManagementFeature = true;
                    });
                });
            });
            describe('Toggled on', function () {
                var CardService;

                beforeEach(function () {
                    module('refresh.card', 'refresh.test');
                    inject(function (_CardService_) {
                        CardService = _CardService_;
                    });
                });

                describe('fetch card', function () {
                    var response, test, location;

                    beforeEach(inject(function (ServiceTest, $location) {
                        test = ServiceTest;
                        test.spyOnEndpoint('cards');
                        location = $location;
                    }));

                    describe('on successful service return', function () {
                        beforeEach(function () {
                            test.stubResponse('cards', 200, {
                                card: null,
                                keyValueMetadata: [],
                                stepUp: null,
                                cards: [
                                    {
                                        cardNumber: '005222502360335109',
                                        personalFinanceManagementId: 9,
                                        systemPrincipalId: '956',
                                        statusCode: '0000'
                                    }
                                ]
                            });
                        });

                        it('should be resolved with the service response', function () {
                            expect(CardService.fetchCards([])).toBeResolvedWith([{ cardNumber : '005222502360335109', personalFinanceManagementId: 9, systemPrincipalId : '956', statusCode : '0000' }]);
                            test.resolvePromise();
                        });
                    });
                });
            });
        });
    });
});

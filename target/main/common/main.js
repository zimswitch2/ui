var overviewFeature = false;


(function (app) {
    'use strict';

    app.config(function ($routeProvider) {
        $routeProvider.when('/home', {
            redirectTo: function () {
                /*
                if (overviewFeature) {
                    return '/overview';
                } else {
                    return '/account-summary';
                }
                */
                return '/transaction/dashboard'
            }
        });

        $routeProvider.otherwise({redirectTo: '/home'});
    });

    app.run(function ($rootScope, MobileService) {
        $rootScope.isMobileDevice = MobileService.isMobileDevice();
    });

})(angular.module('refresh', [
    'hacks',
    'refresh.devicedna',
    'refresh.otp',
    'refresh.otp.activate',
    'ngRoute',
    'ngAnimate',
    'ngMessages',
    'angular-data.DSCacheFactory',
    'refresh.transfers',
    'refresh.transaction',
    'refresh.beneficiaries',
    'refresh.beneficiaries.pay-multiple',
    'refresh.prepaid',
    'refresh.statements',
    'refresh.registration',
    'refresh.login',
    'refresh.navigation',
    'refresh.accountSummary',
    'refresh.sbForm',
    'refresh.flow',
    'refresh.payment',
    'refresh.notifications',
    'refresh.beneficiaries.groups',
    'refresh.typeahead',
    'refresh.datepicker',
    'refresh.inlineAction',
    'refresh.amount',
    'refresh.directives.converttoint',
    'refresh.logout',
    'refresh.textValidation',
    'refresh.accountDropdown',
    'refresh.filterBox',
    'refresh.idleTimeout',
    'refresh.limits',
    'refresh.payments.limits',
    'refresh.transfers.limits',
    'refresh.validators.limits',
    'refresh.payment-notification-history',
    'refresh.header',
    'refresh.changePassword',
    'refresh.resetPasswordCtrl',
    'refresh.notificationCost',
    'refresh.security-software.controller',
    'refresh.analytics',
    'refresh.analytics.trackclick',
    'refresh.dtmanalytics',
    'refresh.statementTransactions',
    'refresh.security.user',
    'refresh.profileAndSettings.dashboards',
    'refresh.goToAnchorController',
    'refresh.switch-dashboard',
    'refresh.accordion',
    'refresh.accountOrigination',
    'refresh.monthlyPaymentLimits.directives',
    'refresh.profileAndSettings',
    'refresh.filters',
    'refresh.mapFilter',
    'refresh.common.backDirective',
    'refresh.common.homeDirective',
    'refresh.printButtonDirective',
    'refresh.newRegistered',
    'refresh.mobile',
    'refresh.profileAndSettings',
    'refresh.serviceError',
    'refresh.version',
    'refresh.overview',
    'refresh.overview.controller',
    'refresh.addDashboard.controller',
    'refresh.meniga',
    'refresh.charts',
    'refresh.addDashboardName.controller',
    'refresh.secure.message',
    'routing.forAllowedFrom',
    'refresh.modalMessage',
    'refresh.userTermsLink',
    'refresh.InstantMoneyService',
    'refresh.instantMoney',
    'refresh.passwordReset',
    'refresh.targetedOffers',
    'refresh.common.homeDirective',
    'refresh.common.hiddenFormButtonDirective',
    'refresh.feedback',
    'refresh.dailyPaymentLimits.directives',
    'refresh.formalStatement',
    'refresh.internationalPayment',
    'refresh.accountSharing',
    'refresh.invitationMenu',
    'refresh.permissions',
    'refresh.messenger'
    //'refresh.dashboard'
]));

window.Offline.options = {
    checkOnLoad: false,
    interceptRequests: false,
    requests: false,
    checks: {xhr: {url: '/assets/images/logo.png'}},
    game: false
};

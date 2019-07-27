(function (app) {
    'use strict';

    app.config(function ($routeProvider) {
        $routeProvider.when('/beneficiaries/list',
            {templateUrl: 'features/beneficiaries/partials/view.html'}
        );
    });

    app.factory('BeneficiariesState', function () {
        return {
            addBeneficiaryFlow: false,
            beneficiary: undefined,
            card: undefined,
            editBeneficiary: false,
            editing: false,
            errorMessage: null,
            latestBeneficiaryRecipientID: undefined,
            modifiedBeneficiary: undefined,
            paymentConfirmation: undefined
        };
    });

})(angular.module('refresh.beneficiaries', ['refresh.beneficiaries.flow', 'refresh.beneficiaries.beneficiariesService',
    'refresh.beneficiaries.beneficiariesFlowService', 'refresh.beneficiaries.beneficiary', 'refresh.beneficiaries.edit',
    'refresh.beneficiaries.add', 'ngRoute', 'refresh.configuration', 'refresh.parameters', 'refresh.filters',
    'refresh.navigation', 'refresh.sorter', 'refresh.mcaHttp', 'refresh.flow', 'refresh.metadata', 'refresh.typeahead',
    'refresh.payment.future.services', 'refresh.beneficiaries.groupsService', 'refresh.branchLazyLoadingService',
    'refresh.errorMessages', 'refresh.beneficiaries.filters.beneficiaryFilter',
    'refresh.beneficiaries.filters.sentenceCaseForNotificationTypeFilter',
    'refresh.beneficiaries.filters.prepositionForNotificationTypeFilter',
    'refresh.beneficiaries.directives.multipleBeneficiaries',
    'refresh.beneficiaries.controllers.beneficiariesTable',
    'refresh.beneficiaries.directives.beneficiariesTable',
    'refresh.beneficiaries.directives.beneficiariesList',
    'refresh.beneficiaries.controllers.viewBeneficiaryDetails',
    'refresh.beneficiaries.controllers.viewBeneficiaryGroups']));
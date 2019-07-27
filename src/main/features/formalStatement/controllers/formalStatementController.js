(function () {
    var app = angular.module('refresh.formalStatement.controller',
        [
            'refresh.configuration',
            'refresh.accountsService',
            'refresh.card',
            'refresh.formalStatement.service',
            'refresh.customizedFilter',
            'refresh.common.hiddenFormButtonDirective',
            'refresh.digitalId'
        ]);

    app.config(function ($routeProvider) {
        $routeProvider.when('/formal-statements', {
            controller: 'FormalStatementController',
            templateUrl: 'features/formalStatement/partials/formalStatements.html'
        });
    });

    app.controller('FormalStatementController', function ($scope, $timeout, AccountsService, Card, DigitalId,
                                                          FormalStatementService, URL) {
        var card = Card.current();
        var digitalId = DigitalId.current();
        $scope.emailAddress = digitalId.username;
        var listOfFormalStatementAccountTypes = ['CURRENT','HOME_LOAN', 'CREDIT_CARD'];

        var updateStatements = function() {
            FormalStatementService.viewFormalStatementList($scope.selectedAccount.number, $scope.selectedAccount.accountType, card).then(function (statements) {
                $scope.formalStatements = statements;
            }).catch(function (errorMessage) {
                $scope.errorMessage = errorMessage;
            });
        };

        AccountsService.list(card).then(function (response) {
            $scope.accounts = [];

            _.find(response.accounts, function (account) {
                if(_.indexOf(listOfFormalStatementAccountTypes, account.accountType)!== -1) {
                    $scope.accounts.push(account);
                }
            });

            if ($scope.accounts.length > 0) {
                $scope.selectedAccount = $scope.accounts[0];
                updateStatements();
            }
        }).catch(function (errorMessage) {
            $scope.errorMessage = errorMessage;
        });

        $scope.changeAccountTo = function () {
            updateStatements();
        };

        $scope.openDownloadModal = function (downloadStatement) {
            $scope.isDownloadModalOpen = true;
            $scope.downloadUrl =  URL.downloadFormalStatement;
            $scope.downloadFormalStatement = [
                {
                    name: 'cardNumber',
                    value: card.number
                },
                {
                    name: 'statementId',
                    value: downloadStatement.accountStatementId
                },
                {
                    name: 'accountNumber',
                    value: $scope.selectedAccount.number
                },
                {
                    name: 'accountType',
                    value: $scope.selectedAccount.accountType
                }
            ];
        };

        $scope.openEmailModal = function (emailStatement) {
            $scope.isEmailModalOpen = true;
            $scope.statementDateDetails = {
                startDate: emailStatement.statementTimeFrame.startDate,
                endDate: emailStatement.statementTimeFrame.endDate
            };
            $scope.emailFormalStatement = emailStatement;
        };

        $scope.closeDownloadModal = function () {
            $timeout(function(){
                $scope.isDownloadModalOpen = undefined;
            },3000);
        };

        $scope.closeEmailModal = function () {
            $scope.isEmailModalOpen = undefined;
        };

        $scope.emailStatement = function () {
            $scope.closeEmailModal();
            FormalStatementService.emailFormalStatement(
                card.number, $scope.emailFormalStatement.accountStatementId, $scope.selectedAccount.number, $scope.selectedAccount.accountType, $scope.emailAddress)
                .then(function () {
                    $scope.isSuccessful = true;
                }).catch(function (error) {
                    $scope.errorMessage = error;
                });
        };
    });

    app.filter('formalStatementFilter', function ($filter, CustomizedFilterService) {
        return CustomizedFilterService.create([
            {path: 'statementTimeFrame.startDate', type: 'date'},
            {path: 'statementTimeFrame.endDate', type: 'date'}
        ]);
    });
}());

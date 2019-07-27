(function (app) {
    'use strict';
    app.config(function($routeProvider) {
      $routeProvider.when('/payment/onceoff/confirm', {
          templateUrl: 'features/payment/partials/payBeneficiaryOnceOffConfirm.html',
          controller: 'OnceOffPaymentConfirmController'
      });
    });

    app.controller('OnceOffPaymentConfirmController',
        function ($scope, $location, OnceOffPaymentService, Card, BeneficiaryPaymentService, BeneficiariesService, Flow,
                  ApplicationParameters, OnceOffPaymentModel) {

            function setup() {
              $scope.onceOffPaymentModel = OnceOffPaymentModel.getOnceOffPaymentModel();
              $scope.flow = Flow.get();
              $scope.latestTimestampFromServer = ApplicationParameters.getVariable('latestTimestampFromServer');
            }


            $scope.confirm = function () {
                Flow.next();
                if ($scope.onceOffPaymentModel.saveAsBeneficiary ) {
                    delete $scope.onceOffPaymentModel.beneficiary.recipientId;

                    BeneficiariesService.addOrUpdate($scope.onceOffPaymentModel.beneficiary, Card.current()).then(function (response) {
                        OnceOffPaymentModel.setBeneficiaryAdded( true);
                        $scope.onceOffPaymentModel.recipientId = response.data.beneficiaries[0].recipientId;
                        OnceOffPaymentModel.setBeneficiary($scope.onceOffPaymentModel.beneficiary);
                        BeneficiaryPaymentService.payBeneficiary(
                            {
                                account: $scope.onceOffPaymentModel.account,
                                amount: $scope.onceOffPaymentModel.amount,
                                beneficiary: response.data.beneficiaries[0],
                                date: moment($scope.latestTimestampFromServer).format("DD MMMM YYYY")
                            }
                        ).then(paymentSuccess, function () {
                            failure('Could not process payment: We are experiencing technical problems. Please try again later');
                        });
                    }, function (error) {
                        if(error.message === 'Your OTP service has been locked. Please call Customer Care on 0860 123 000'){
                            failure(error.message);
                        }else{
                            failure('There was a problem with the beneficiary details entered. The beneficiary was not saved and payment was unsuccessful');
                        }
                    });
                } else {
                    OnceOffPaymentService.payPrivateBeneficiaryOnceOff(
                        $scope.onceOffPaymentModel.beneficiary,
                        $scope.onceOffPaymentModel.account,
                        $scope.onceOffPaymentModel.amount).then(paymentSuccess, function (error) {
                        failure('Could not process payment' + error.message);
                    });
                }
            };

            $scope.modify = function () {
                Flow.previous();
                $scope.flow = Flow.get();
            };

            function paymentSuccess(result) {
                OnceOffPaymentModel.setErrorMessage( (result.isWarning)? 'Your notification could not be delivered because the email address was invalid' : null );
                OnceOffPaymentModel.setIsSuccessful( true);
                Flow.next();
                $scope.flow = Flow.get();

                $location.path('/payment/onceoff/success');
            }

            function failure(errorMessage) {
                OnceOffPaymentModel.setErrorMessage( errorMessage);

                Flow.previous();
                $scope.flow = Flow.get();
                $location.path('/payment/onceoff');
            }

            setup();
        });
}) (angular.module('refresh.onceOffPayment') );

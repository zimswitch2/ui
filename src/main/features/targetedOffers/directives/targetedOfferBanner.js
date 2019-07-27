var dynamicTargetOfferTemplates = false;
if (feature.dynamicTargetOfferTemplates) {
    dynamicTargetOfferTemplates = true;
}
(function () {
    var app = angular.module('refresh.targetedOffers.targetedOffersBanner', ['refresh.digitalId']);

    app.directive('targetedOfferBanner', function ($compile, $location, TargetedOffersService, DigitalId) {


        function getOfferSubject(offerSubjectText) {
            var preferredName = DigitalId.current().preferredName;

            if (preferredName && preferredName.length > 0 && offerSubjectText && offerSubjectText.length > 0) {
                offerSubjectText = offerSubjectText.substr(0, 1).toLowerCase() + offerSubjectText.substr(1);
                return DigitalId.current().preferredName + ', ' + offerSubjectText;
            }
            return offerSubjectText;

        }

        function oldTemplates(scope, element) {
            TargetedOffersService.getOffer().then(function (offer) {
                if (_.isEmpty(offer)) {
                    scope.offerAndTemplateExist = false;
                    return;
                }
                var productClasses = {
                    'CURRENT': 'transaction',
                    'CREDIT_CARD': 'creditcard',
                    'TERM_LOAN': 'loan',
                    'SAVINGS': 'investment'
                };
                scope.productClass = productClasses[offer.productType];
                scope.offer = offer;
                var templateName = offer.mappedProductCode + "_TARGETED_OFFER";
                if (scope.templateNameSuffix) {
                    templateName += "_" + scope.templateNameSuffix;
                }
                TargetedOffersService.getTemplate(templateName).then(function (template) {
                    scope.offerAndTemplateExist = true;
                    var subjectElement = element.find('h4.offerSubject');
                    var bodyElement = element.find('div.offerBody');
                    subjectElement.html(getOfferSubject(template.subject));
                    bodyElement.html(template.body);
                    $compile(subjectElement.contents())(scope);
                    $compile(bodyElement.contents())(scope);
                }).catch(function () {
                    scope.offerAndTemplateExist = false;
                });
            }).catch(function () {
                scope.offerAndTemplateExist = false;
            });
        }

        function dynamicTemplates(scope) {
            TargetedOffersService.getOfferForDynamicTemplate().then(function (data) {
                if (_.isEmpty(data)) {
                    scope.offerAndTemplateExist = false;
                    return;
                }
                var productClasses = {
                    'CURRENT': 'transaction',
                    'CREDIT_CARD': 'creditcard',
                    'TERM_LOAN': 'loan',
                    'SAVINGS': 'investment'
                };
                scope.productClass = productClasses[data.offer.productType];
                scope.offer = data.offer;
                scope.templateData = data.templateData;
                scope.templateData.qualifyingText = getOfferSubject(data.templateData.qualifyingText);
                scope.offerAndTemplateExist = true;

            }).catch(function () {
                scope.offerAndTemplateExist = false;
            });
        }

        return {
            restrict: 'E',
            templateUrl: 'features/targetedOffers/directives/partials/targetedOfferBanner.html',
            replace: true,
            scope: {
                templateNameSuffix: '@'
            },
            controller: function ($scope) {
                $scope.acceptOffer = function () {
                    $location.path($scope.offer.acceptUrl);
                };
            },
            link: function (scope, element) {
                if (scope.templateNameSuffix === undefined) {
                    scope.templateNameSuffix = "";
                }

                if (dynamicTargetOfferTemplates) {
                    dynamicTemplates(scope);
                } else {
                    oldTemplates(scope, element);
                }

                element.find('.decline-offer').on('click', function () {
                    TargetedOffersService.actionOffer('No thanks').then(function () {
                        angular.element(element).addClass('closing');
                        scope.offerAndTemplateExist = false;
                    });
                });
            }
        };
    });
})();
var SavingsPrescreeningWidget = function() {
    'use strict';
    var helpers = require('../helpers.js');
    this.baseActions = require('../baseActions.js');

    function prescreening(product) {
        return element.all(by.css('savings-prescreening[product-type="' + product + '"]')).first();
    }

    function fraudCheckModal(product) {
        return prescreening(product).element(by.css('.fraud-check'));
    }

    function fraudCheckModalNextButton(product) {
        return fraudCheckModal(product).element(by.css('apply-for-account[product-type="' + product + '"]')).element(by.css('button'));
    }

    function fraudCheckModalCancelButton(product) {
        return fraudCheckModal(product).element(by.css('.secondary'));
    }

    function notKycCompliantModal(product) {
        return prescreening(product).element(by.css('.not-kyc-compliant'));
    }

    this.actions = {
        apply: function (product) {
            return helpers.scrollThenClick(prescreening(product));
        },

        kycNonCompliantMessageModalClose: function (product) {
            return helpers.scrollThenClick(notKycCompliantModal(product).element(by.css('.modal-container .actions button')));
        },

        fraudCheckConsentCheckBoxClick: function (product) {
            return helpers.scrollThenClick(fraudCheckModal(product).element(by.css('input#creditAndFraudCheckConsent')));
        },

        fraudCheckConsentFormNextClick: function (product) {
            return helpers.scrollThenClick(fraudCheckModalNextButton(product));
        },

        fraudCheckConsentFormCancelClick: function(product){
            return helpers.scrollThenClick(fraudCheckModalCancelButton(product));
        }
    };

    this.applyButtonVisible = function (product) {
        return element.all(by.css('savings-prescreening[product-type="' + product + '"]'));
    };

    this.getFraudCheckModal = function (product) {
        return fraudCheckModal(product);
    };

    this.getFraudCheckModalNextButton = function(product){
        return fraudCheckModalNextButton(product);
    };

    this.getKycNonCompliantMessageModal = function (product) {
        return notKycCompliantModal(product);
    };
};

module.exports = new SavingsPrescreeningWidget();
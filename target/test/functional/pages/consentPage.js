var consentPage = function () {
    this.baseActions = require('./baseActions.js');
    this.helpers = require('./helpers.js');
    var helpers = require('./helpers.js');  

    this.saveButton = element(by.id('save-consent'));

    this.actions = {
        selectReceiveMarketing: function () {
            this.clickCheckBox('edit-consent-01');
        }.bind(this),
        uncheckAllConsent: function () {
            this.clickCheckBox('edit-consent-01');
            this.clickCheckBox('edit-consent-02');
            this.clickCheckBox('edit-consent-03');
            this.clickCheckBox('edit-consent-04');
        }.bind(this),
        saveConsent: function () {
            this.helpers.scrollThenClick(this.save());
        }.bind(this),       
        cancel: function () {
            this.helpers.scrollThenClick(this.cancel());
        }.bind(this),
        submit: function () {
            this.helpers.scrollThenClick(this.submit());
        }.bind(this)
    };

    this.clickCheckBox = function (id) {
        var e = element(by.id(id));
        browser.wait(function () {
            return e.isPresent();
        }, 10000);
        e.click();
    };

    this.clickEditButton = function () {
        this.helpers.scrollThenClick(element(by.id('edit-consent-button')));
    };

    this.save = function () {
        return element(by.id('save-consent'));
    };

    this.cancel = function () {
        return element(by.id('cancel'));
    };   

    this.submit = function () {
        return element(by.id('submit'));
    };    

    this.receiveMarketing = function () {
        return element(by.id('view-consent-01'));
    };

    this.shareCustomerData = function () {
        return element(by.id('view-consent-04'));
    };

    this.contactForResearch = function () {
        return element(by.id('view-consent-02'));
    };

    this.contactForSpecialOffers = function () {
        return element(by.id('view-consent-03'));
    };

    this.receiveMarketingEdit = function () {
        return element(by.id('edit-consent-01'));
    };

    this.shareCustomerDataEdit = function () {
        return element(by.id('edit-consent-04'));
    };

    this.contactForResearchEdit = function () {
        return element(by.id('edit-consent-02'));
    };

    this.contactForSpecialOffersEdit = function () {
        return element(by.id('edit-consent-03'));
    };   
    
};

module.exports = new consentPage();


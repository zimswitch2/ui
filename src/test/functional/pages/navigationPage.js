var navigationPage = function () {
    var helpers = require('./helpers.js');
    this.baseActions = require('./baseActions.js');

    this.redirectLinkVisible = function () {
        return element(by.id('link-to-full-site')).isDisplayed();
    };

    this.redirectToFullSite = function () {
        this.baseActions.clickOnTab("Switch to old site");
    };

    this.modalPaneVisible = function () {
        return element(by.id('cant-find-modal')).isDisplayed();
    };

    this.cancel = function () {
      helpers.scrollThenClick(element(by.css('#modal-cancel')));
    };

    this.confirm = function () {
      helpers.scrollThenClick(element(by.css('#modal-confirm')));
    };
};

module.exports = new navigationPage();
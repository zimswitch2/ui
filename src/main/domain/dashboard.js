var personalFinanceManagementFeature = false;
if (feature.personalFinanceManagement) {
    personalFinanceManagementFeature = true;
}

function Dashboard(properties) {
    'use strict';

    var requiresActivateOTPCodes = ['7506', '7516', '7501'];
    var requiresAmendAccessDirectCodes = ['7515'];
    var canBeActivatedCodes = _.flatten([requiresActivateOTPCodes, requiresAmendAccessDirectCodes]);
    var blockedCodes = ['2003', '2004', '7509', '7510', '7513'];
    var hotCardedCode = '2004';
    var cardErrorResponses = {
        '2003': 'The card linked to this Standard Bank ID has been inactive for more than 18 months. Please link another card to continue',
        '2004': 'Your card has been deactivated for security reasons. Please call Customer Care on 0860 123 000 or visit your nearest branch',
        '7501': 'Please register for your one-time password (OTP) service to activate your profile',
        '7506': 'Please register for your one-time password (OTP) service to activate your profile',
        '7509': 'Your profile has been locked. Please call Customer Care on 0860 123 000',
        '7510': 'There is a problem with your profile. Please call Customer Care on 0860 123 000 or visit your nearest branch',
        '7513': 'This card or service is not available on Internet banking',
        '7516': 'Please register for your one-time password (OTP) service to activate your profile',
        '7515': 'Please activate your internet banking'
    };

    var maskNineDigitCardNumber = function (cardNumber) {
        if (cardNumber.length === 9) {
            cardNumber = '******' + cardNumber + '***';
        }
        return cardNumber;
    };

    var cardHolder = function (card) {
        return card.isCardHolder;
    };
    var isBlockedCode = function (code) {
        return _.includes(blockedCodes, code);
    };

    return {
        permissions: properties.permissions || [],
        profileId: properties.profileId,
        dashboardName: properties.dashboardName,
        systemPrincipalId: properties.systemPrincipalId,
        systemPrincipalKey: properties.systemPrincipalKey,
        profileType: properties.profileType,

        isHotCarded: function () {
            return this.cardError && this.cardError.code === hotCardedCode;
        },
        isBlocked: function () {
            return this.cardError && (isBlockedCode(this.cardError.code) || this.cardError.code === 500);
        },

        canBeActivated: function () {
            return this.cardError && _.includes(canBeActivatedCodes, this.cardError.code);
        },

        requiresActivateOTP: function () {
            return this.cardError && _.includes(requiresActivateOTPCodes, this.cardError.code);
        },

        requiresAmendAccessDirect: function () {
            return this.cardError && _.includes(requiresAmendAccessDirectCodes, this.cardError.code);
        },

        cardStatus: function () {
            if (this.card) {
                return 'Active';
            } else if (this.cardError && isBlockedCode(this.cardError.code)) {
                return 'Blocked';
            } else if (this.requiresActivateOTP()) {
                return 'Activate OTP';
            } else if (this.requiresAmendAccessDirect()) {
                return 'Activate internet banking';
            } else {
                return 'There was a problem retrieving this dashboard';
            }
        },

        setCard: function (card) {
            if (card) {
                delete this.card;
                if (personalFinanceManagementFeature) {
                    delete this.personalFinanceManagementId;
                }
                delete this.cardNumber;
                delete this.cardError;

                if (card.cardNumber) {

                    this.cardNumber = maskNineDigitCardNumber(card.cardNumber);
                }

                this.customerSAPBPID = card.sapBpId;

                if (card.statusCode === '0000' && card.cardNumber) {
                    this.card = card.cardNumber;
                    if (personalFinanceManagementFeature) {
                        this.personalFinanceManagementId = card.personalFinanceManagementId;
                    }

                    this.isCardHolder = card.isCardHolder;
                } else {
                    this.cardError = {
                        message: cardErrorResponses[card.statusCode] || 'An error occurred, please try again later',
                        code: card.statusCode
                    };

                }
            }
        }
    };
}

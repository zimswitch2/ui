module.exports = {
    "credentials": {
        "username": process.env.MCA_USERNAME,
        "password": process.env.MCA_PASSWORD
    },
    "RCP": {
        "canApply": {
            "username": "rcpcanapply@sb.co.za",
            "password": "password"
        },
        "canApplyNoTA": {
            "username": "rcpcanapplynota@sb.co.za",
            "password": "password"
        },
        "canApplyNoTANotKYC": {
            "username": "rcpcanapplynotanotkyc@sb.co.za",
            "password": "password"
        },
        "canApplyNoBranch": {
            "username": "rcpcanapplynobranch@sb.co.za",
            "password": "password"
        },
        "cannotApplyRcp": {
            "username": "rcpcannotapply@sb.co.za",
            "password": "password"
        },
        "getCustomerError": {
            "username": "getcustomererror@sb.co.za",
            "password": "password"
        },
        "hasExistingUnlinkedRcp": {
            "username": "hasexistingunlinkedrcp@sb.co.za",
            "password": "password"
        },
        "hasExistingLinkedRcp": {
            "username": "ibrefresh@sb.co.za",
            "password": "password"
        },
        "hasAcceptedOffer": {
            "username": "acceptedrcpoffer@sb.co.za",
            "password": "password"
        },
        "pendingNotAboutToExpireRcpWithTransactionalAccount": {
            "username": "rcppendingnotexpire@sb.co.za",
            "password": "password"
        },
        "pendingRcpWithTransactionalAccount": {
            "username": "rcppending@sb.co.za",
            "password": "password"
        },
        "newToBankRcpPending": {
            "username": "newtobankrcppending@sb.co.za",
            "password": "password"
        },
        "newToBankHasAcceptedOffer": {
            "username": "newtobankacceptedrcpoffer@sb.co.za",
            "password": "password"
        },
        "debitOrderDetails": {
            "nonBankCustomer": {
                "bankName": "ABS",
                "branchCode": "63200500",
                "accountNumber": "123456789"
            }
        },
        "preferredBranchName": 'Rosebank',
        "cannotApplyRCPID": '8203235277086',
        "bank": "ABSA",
        "bankBranch": "63200500",
        "accountNumber": "123456789"
    },
    "Current": {
        "canApply": {
            "username": "canapply@sb.co.za",
            "password": "password"
        },
        "aoReject": {
            "username": "aoreject@sb.co.za",
            "password": "password"
        },
        "hasPendingOffer": {
            "username": "pendingoffer@sb.co.za",
            "password": "password"
        },
        "hasPendingOfferNotAboutToExpire": {
            "username": "currentpendingnotexpire@sb.co.za",
            "password": "password"
        },
        "hasAcceptedOffer": {
            "username": "acceptedoffer@sb.co.za",
            "password": "password"
        },
        "onlyHasBasicInfo": {
            "username": "onlybasicinfo@sb.co.za",
            "password": "password"
        },
        "unsupportedOffer": {
            "username": "unsupportedoffer@sb.co.za",
            "password": "password"
        },
        "overdraftStatementsConsentDetails": {
            "bankName": "ABS",
            "branchCode": "63200500",
            "accountNumber": "123456789",
            "accountType": 'SAVINGS'
        }
    },
    "accountOrigination": {
        "unemployed": {
            "username": "unemployed@sb.co.za",
            "password": "password"
        },
        "notKYC": {
            "username": "notkyc@sb.co.za",
            "password": "password"
        },
        "amlIncompleteCountryOfBirth": {
            "username": "cobblank@sb.co.za",
            "password": "password"
        },
        "amlIncompleteNonSACitizen": {
            "username": "not_sa_aml_blanks@sb.co.za",
            "password": "password"
        },
        "amlIncompleteNoSAID": {
            "username": "no_sa_id_aml_blanks@sb.co.za",
            "password": "password"
        },
        "amlIncompleteWithPermitDetailsNoSAID": {
            "username": "no_sa_id_aml_permit_details@sb.co.za",
            "password": "password"
        },
        "amlIncompleteNoEmploymentInformation": {
            "username": "no_employment_aml_blanks@sb.co.za",
            "password": "password"
        },
        "amlIncompleteNoIncomeInformation": {
            "username": "no_income_aml_blanks@sb.co.za",
            "password": "password"
        },
        "accountApplicationRejected": {
            "username": "account_application_rejected@test.com",
            "password": "password"
        }
    },
    "targetedOffer": {

        "privateBankingOffer": {
            "username": "private_banking_targeted_offer@sb.co.za",
            "password": "password"
        },

        "consolidatorCurrentAccountOffer": {
            "username": "consolidator_current_offer@sb.co.za",
            "password": "Pro123"
        },

        "prestigeBanking": {
            "username": "prestige_offer@sb.co.za",
            "password": "Pro123"
        },


        "eliteBanking": {
            "username": "elite_banking_targeted_offer@sb.co.za",
            "password": "Pro123"
        },

        "graduateAndProfessionalBanking": {
            "username": "graduate_banking_targeted_offer@sb.co.za",
            "password": "Pro123"
        },

        "dayNoticeDepositOffer": {
            "username": "32day_notice_deposit_targeted_offer@sb.co.za",
            "password": "Pro123"
        },

        "accessSaveOffer": {
            "username": "access_save_targeted_offer@sb.co.za",
            "password": "Pro123"
        },

        "callDepositOffer": {
            "username": "call_deposit_targeted_offer@sb.co.za",
            "password": "Pro123"
        },
        "contractSaveOffer": {
            "username": "contract_save_targeted_offer@sb.co.za",
            "password": "Pro123"
        },

        "fixedDepositOffer": {
            "username": "fixed_deposit_targeted_offer@sb.co.za",
            "password": "Pro123"
        },

        "marketLinkOffer": {
            "username": "market_link_targeted_offer@sb.co.za",
            "password": "Pro123"
        },

        "societySchemeOffer": {
            "username": "society_scheme_targeted_offer@sb.co.za",
            "password": "Pro123"
        },
        "taxFreeCallOffer": {
            "username": "tax_free_call_targeted_offer@sb.co.za",
            "password": "Pro123"
        },

        "overdraftIncreaseOffer": {
            "username": "overdraft_limit_targeted_offer@sb.co.za",
            "password": "Pro123"
        },

        "overdraftFacility": {
            "username": "overdraft_targeted_offer@sb.co.za",
            "password": "Pro123"
        },

        "noTargetedOfferTemplate": {
            "username": "no_targeted_offer_template@sb.co.za",
            "password": "Pro123"
        },

        "platinumcreditCard": {
            "username": "platinum_credit_targeted_offer@sb.co.za",
            "password": "password"
        },

        "titaniumCreditCard": {
            "username": "titanium_credit_targeted_offer@sb.co.za",
            "password": "Pro123"
        },

        "goldCreditCard": {
            "username": "gold_credit_targeted_offer@sb.co.za",
            "password": "Pro123"
        },

        "blueCreditCard": {
            "username": "blue_credit_targeted_offer@sb.co.za",
            "password": "Pro123"
        },

        "accessCreditCard": {
            "username": "access_credit_targeted_offer@sb.co.za",
            "password": "Pro123"
        },

        "rcpcurrentAccount": {
            "username": "rcpcanapply@sb.co.za",
            "password": "password"
        },

        "pureSaveAccount": {
            "username": "puresave_account_targeted_offer@sb.co.za",
            "password": "password"
        },

        "moneyMarketCallAccount": {
            "username": "money_market_targeted_offer@sb.co.za",
            "password": "password"
        }
    },
    // SIT2 test data for sap products.
    "sapproductAccountOrigination": {
        "notKYC": {
            "username": "sapdata15@sb.co.za",
            "password": "Pro123"
        },
        "amlIncompleteCountryOfBirth": {
            "username": "nonamldata6@sb.co.za",
            "password": "Pro123"
        },
        "amlIncompleteNonSACitizen": {
            "username": "sapdata15@sb.co.za",
            "password": "password"
        },
        "amlIncompleteNoSAID": {
            "username": "no_sa_id_aml_blanks@sb.co.za",
            "password": "password"
        },
        "amlIncompleteNoEmploymentInformation": {
            "username": "no_employment_aml_blanks@sb.co.za",
            "password": "password"
        },
        "amlIncompleteNoIncomeInformation": {
            "username": "no_income_aml_blanks@sb.co.za",
            "password": "password"
        },
        "accountApplicationRejected": {
            "username": "account_application_rejected@test.com",
            "password": "password"
        },

        "amlComplaintWithSaID": {
            "username": "sapdata34@sb.co.za",
            "password": "Pro12345"
        },

        "amlComplaintWithNonSaIDWithPassport": {
            "username": "sapdata33@sb.co.za",
            "password": "Pro12345"
        }
    },
    "newToBank": {
        "username": "conc@sb.co.za",
        "password": "password"
    },
    "newToBankCaptured": {
        "username": "coc@sb.co.za",
        "password": "password"
    },
    "badCredentials": {
        "username": "badcredentials@standardbank.co.za",
        "password": "password"
    },
    "hotCarded": {
        "username": "hotcarded@sb.co.za",
        "password": "password"
    },
    "credentialsWithZeroBeneficiaries": {
        "username": "zerobeneficiaries@standardbank.co.za",
        "password": "password"
    },
    "credentialsWithZeroEAPLimit": {
        "username": "zeroeap@sbsa.co.za",
        "password": "password"
    },
    "credentialsForPasswordRelated": {
        "username": process.env.AUTH_CONTRACTS_USERNAME,
        "password": process.env.AUTH_CONTRACTS_PASSWORD,
        "newPassword": "passwordW456"
    },
    "credentialsForNoFutureTransactions": {
        "username": "nofuturetransactions@sb.co.za",
        "password": "passwordJ123"
    },
    "credentialsForActivateOTP": {
        "username": "reactivateotp@standardbank.co.za",
        "password": "passwordJ123"
    },
    "noCurrentOrCreditCardAccounts": {
        "username": "no_current_or_credit_card@test.com",
        "password": "Pro123"
    },
    "netIncomeChartError": {
        "username": "net_income_chart_error@test.com",
        "password": "Pro123"
    },
    "cashflowChartError": {
        "username": "cashflow_chart_error@test.com",
        "password": "Pro123"
    },
    "personalBusinessBankingCredentials": {
        "username": "personalandbusiness@sb.co.za",
        "password": "password"
    },
    "seo": {
        "username": "joanna@sb.co.za",
        "password": "password"
    },
    "seodata": {
            "username": "seodata1@sb.co.za",
            "password": "Pro12345"
        },

    "delinksit": {
             "username": "sl2@sb.co.za",
             "password": "Pro12345"

        },

    "foreignNationalWithWorkPermit": {
        "username": "foreignnational_workpermit_xbp@sb.co.za",
        "password": "password"
    },
    "foreignNationalWithForeignId": {
        "username": "foreignnational_foreignid_xbp@sb.co.za",
        "password": "password"
    },
    "netIncomeChartHardError": {
        "username": "hard_net_income_chart_error@test.com",
        "password": "Pro123"
    },
    "cashflowChartHardError": {
        "username": "hard_cashflow_chart_error@test.com",
        "password": "Pro123"
    },
    "instantMoney": {
        "username": "instantmoney@sb.co.za",
        "password": "Pro123"
    },
    "customAccountName":{
        "username": "custom_account_name@sb.co.za",
        "password": "Pro123"
    },
    "beneficiaryInformation": {
        "hasScheduledPayments": {
            "name": "Demo",
            "bank": "Standard Bank",
            "accountNumber": "445435606",
            "beneficiaryReference": "Invoice 123",
            "myReference": "I can not edit",
            "lastPaymentDate": "12 November 2013",
            "recipientGroupName": "Alegtest",
            "branchCode": "51001"
        },
        "sbsaBank": {
            "name": "Danielle Ward",
            "bank": "Standard Bank",
            "accountNumber": "421884606",
            "beneficiaryReference": "Invoice 123",
            "myReference": "Sister",
            "lastPaymentDate": "12 November 2013",
            "recipientGroupName": "Alegtest",
            "branchCode": "51001"
        },
        "absaBank": {
            "name": "Tammy Diaz",
            "bank": "ABS",
            "accountNumber": "4047264120",
            "beneficiaryReference": "Invoice 123",
            "myReference": "Mother",
            "recipientGroupName": "Groups Test",
            "branchCode": "63200500"
        },
        "listed": {
            "name": "Edgars",
            "beneficiaryReference": "My shoes",
            "myReference": "Fancy shoes",
            "lastPaymentDate": ""
        },
        "truworths": {
            "name": "TRUWORTHS LTD ALL BRANCHES",
            "nameForSearch": "truwor",
            "initialMyReference": "TruTru",
            "editedMyReference": "REF4TRUWORTH",
            "invalidBeneficiaryReference": "not valid",
            "validBeneficiaryReference": "10100178344687",
            "myReference": "Fancy shoes",
            "lastPaymentDate": ""
        },
        "badBeneficiary": {
            "name": "Bad Beneficiary",
            "bank": "ABS",
            "accountNumber": "4047264120",
            "beneficiaryReference": "Invoice 123",
            "myReference": "Mother",
            "recipientGroupName": "Groups Test",
            "branchCode": "63200500"
        }
    },
    "emailPaymentConfirmation": {
        "successInformation": {
            "address": "user@standardbank.co.za",
            "confirmationType": "Email",
            "recipientName": "ben",
            "sendFutureDated": null
        },
        "wrongPatterns": {
            "address": "user@standardbank",
            "confirmationType": "Email",
            "recipientName": "$_",
            "sendFutureDated": null
        },
        "exceedCharacterLimits": {
            "address": "thisis@averylongemailaddressanditwillnotwork.co.za",
            "confirmationType": "Email",
            "recipientName": "averylongbeneficiarynamethatwillnotworkbecauseitistoolong",
            "sendFutureDated": null
        },
        "invalidEmailAddress": {
            "address": "invalidEmail@some.company",
            "confirmationType": "Email",
            "recipientName": "beneficiary",
            "sendFutureDated": null
        }

    },
    "faxPaymentConfirmation": {
        "successInformation": {
            "address": "0123456789",
            "confirmationType": "Fax",
            "recipientName": "ben",
            "sendFutureDated": null
        },
        "wrongPatterns": {
            "address": "012345678",
            "confirmationType": "Fax",
            "recipientName": "#_",
            "sendFutureDated": null
        },
        "exceedCharacterLimits": {
            "address": "01147573909759829047230875",
            "confirmationType": "Fax",
            "recipientName": "averylongbeneficiarynamethatwillnotworkbecauseitistoolong",
            "sendFutureDated": null
        }

    },
    "smsPaymentConfirmation": {
        "successInformation": {
            "address": "0782345678",
            "confirmationType": "SMS",
            "recipientName": "ben",
            "sendFutureDated": null
        },
        "wrongPatterns": {
            "address": "0112345678",
            "confirmationType": "SMS",
            "recipientName": "@_",
            "sendFutureDated": null
        },
        "exceedCharacterLimits": {
            "address": "07847573909759829047230875",
            "confirmationType": "SMS",
            "recipientName": "averylongbeneficiarynamethatwillnotworkbecauseitistoolong",
            "sendFutureDated": null
        }
    },
    "badBeneficiaryInformation": {
        "wrongPattern": {
            "name": "12345!",
            "bank": "Not a bank",
            "accountNumber": "abcdefg",
            "beneficiaryReference": "12345!",
            "myReference": "12345!",
            "branchCode": "20091zzz"
        },
        "charactersLimit": {
            "name": "Beneficiary Name longer than 20 characters",
            "accountNumber": "40472641204047264120",
            "beneficiaryReference": "Reference longer than 12 characters",
            "myReference": "My reference longer than 25 characters"
        },
        "wrongDetails": {
            "name": "Danielle Ward",
            "bank": "Standard Bank",
            "accountNumber": "12345678",
            "beneficiaryReference": "Invoice",
            "myReference": "Sister",
            "branchCode": "51001"
        }
    },
    "paymentInformation": {
        "account": {
            "accountType": "CURRENT",
            "accountNumber": "06-130-184-3"
        },
        "amount": {
            "valid": "100.00",
            "invalid": "00.00",
            "specialChar": "@@$$",
            "negative": "-10.00",
            "error": "555.55",
            "invalidEmail": "101.00"
        }
    },
    "oneTimePassword": "12345",
    "incorrectOneTimePassword": "54321",
    "numberOfBeneficiaries": 7,
    "numberOfBeneficiaryGroups": 4,
    "registrationInformation": {
        "userDetails": {
            "username": "happy@smoke.com",
            "password": "Zxcvbnm123",
            "confirmPassword": "Zxcvbnm123",
            "preferredName": "Happy User"
        },
        "userDetailsSit": {
            "username": "happysit7@smoke.com",
            "password": "Pro12345",
            "confirmPassword": "Pro12345",
            "preferredName": "Happy User"
        },
        "wrongPattern": {
            "username": "not an email address",
            "password": "does not conform",
            "confirmPassword": "does not match",
            "preferredName": "12345"
        },
        "existingInfo": {
            "username": "existing@standardbank.co.za",
            "password": "Pro12345",
            "confirmPassword": "Pro12345",
            "preferredName": "Pro12345"
        },
        "charactersLimit": {
            "username": "abcdabcdabcdabcdabcdabcabcdabcdabcdabcdabcdabcabcdabcdabcdabcdabcdabcabcdabcdabcdabcdabcdabc@abcd.com",
            "password": "Zxcvbnmasdfghjklqwertyuiop123567890",
            "confirmPassword": "Zxcvbnmasdfghjklqwertyuiop123567890",
            "preferredName": "If your name is this long it really should not be preferred"
        },
        "dotAtTheEnd": {
            "username": "me@thebank.com.",
            "password": "Pro123",
            "confirmPassword": "Pro123",
            "preferredName": "Name"
        }
    },
    "migrationInformation": {
        "userDetails": {
            "cardNumber": "1234567890123456",
            "password": "Zxcvbnm123",
            "csp": "12345"
        },
        "wrongUserDetails": {
            "cardNumber": "1234567890123456",
            "password": "Zxcvbnm123",
            "csp": "1234"
        },
        "incorrectCSPUserDetails": {
            "cardNumber": "1234567890123456",
            "password": "Zxcvbnm123",
            "csp": "12344"
        },
        "serviceTemporarilyUnavailableDetails": {
            "cardNumber": "1234567890123456",
            "password": "Zxcvbnm123",
            "csp": "12355"
        },
        "inactivateOTPMigrateUserDetails": {
            "cardNumber": "1234567890123456",
            "password": "Zxcvbnm123",
            "csp": "89898"
        }
    },
    "cardInformation": {
        "validDetails": {
            "cardNumber": process.env.CARD_NUMBER,
            "atmPIN": process.env.ATM_PIN,
            "cellPhoneNumber": process.env.CELLPHONE_NUMBER
        },
        "invalidDetails": {
            "cardNumber": "1111222233334444",
            "atmPIN": "33333",
            "cellPhoneNumber": "0714445555"
        },
        "wrongPatterns": [
            {
                "cardNumber": "1s234",
                "atmPIN": "asdsa",
                "cellPhoneNumber": "asdbr0492"
            }
        ], "hotCard": {
            "cardNumber": "9999888877776666",
            "atmPIN": process.env.ATM_PIN,
            "cellPhoneNumber": process.env.CELLPHONE_NUMBER
        },
        "charactersLimit": {
            "cardNumber": "1234",
            "atmPIN": "1356458",
            "cellPhoneNumber": "07361234662"
        },
        "incorrectCardDetails": {
            "cardNumber":"1111222233336666",
            "atmPIN": "33333",
            "cellPhoneNumber": "0714445555"

        },
        "serviceErrorCardDetails": {
            "cardNumber":"2222333344445555",
            "atmPIN": "33333",
            "cellPhoneNumber": "0714445555"

        },

        "sitCardDetails": {
            "cardNumber":"5221346360078751",
            "atmPIN": "41646",
            "cellPhoneNumber": "629248481"
    },
    "incorrectCardDetailsSit": {
            "cardNumber":"5221346360078694",
            "atmPIN": "00564",
            "cellPhoneNumber": "629248480"
    }
    },
    "serviceUnavailable": {
        "username":"tempunavailable@sb.co.za",
        "password":"test"
    }
    
};

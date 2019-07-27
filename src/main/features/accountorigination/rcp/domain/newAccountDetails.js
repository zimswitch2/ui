function NewAccountDetails(productNumber, applicationNumber, preferredBranch, requestedLimit) {
    'use strict';
    return {
        productNumber: productNumber,
        selectedOffer: 1,
        applicationNumber: applicationNumber,
        preferredBranch: preferredBranch,
        requestedLimit: requestedLimit || 0

    };
}
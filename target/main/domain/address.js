function Address(properties, usage) {
    'use strict';

    var usageCode = usage;
    return _.merge(properties, {
        getUsage: function () {
            return _.find(properties.addressUsage, {usageCode: usageCode});
        }
    });
}
(function(app) {
    var builders = {};

    var merge = function(defaults, overrides) {
        return _.merge({}, defaults, overrides);
    };

    builders.prepaidProduct = function(overrides) {
        return merge({name: chance.sentence({words: 2}), bundles: [this.bundle(), this.bundle()]}, overrides);
    };

    builders.bundle = function(overrides){
        return merge({amount:{ }, name: chance.sentence({words: 2}), productCode: chance.word()}, overrides);
    };

    app.factory('builders', function() {
        return builders;
    });
})(angular.module('refresh.test'));

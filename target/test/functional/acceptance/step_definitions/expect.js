var chai = require('chai');
var chai_string = require('chai-string');
chai.use(chai_string);
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

module.exports = chai.expect;
module.exports = function () {
    return {
        all: ['reports/*', 'target/*', 'distri/*'],
        unit: ['reports/unit', 'reports/coverage', 'target/*'],
        functional: ['reports/acceptance', 'reports/e2e', 'target/*']
    };
};

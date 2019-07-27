module.exports = function (grunt) {
    var _ = require('lodash');

    function Metric(options) {
        var width = options.width || 600;
        var height = options.height || 400;
        var min = options.min || 0;
        var max = options.max || '*';

        return _.merge({
            size: width + ',' + height,
            dataFile: options.id + '.txt',
            imageFile: options.id + '.png',
            yrange: '[' + min + ':' + max + ']'
        }, options);
    }

    function metricsFromConfig() {
        return _.map(grunt.config('metrics.custom.metrics'), function (metric) {
            return new Metric(metric);
        });
    }

    grunt.registerTask('metrics:collect', 'Collect data for custom metrics', function () {
        var moment = require('moment');
        var fs = require('fs');

        var dataDir = grunt.config('metrics.custom.dataDir');
        grunt.file.mkdir(dataDir);

        _.forEach(metricsFromConfig(), function (metric) {
            var value = metric.value();
            var dataLine = moment().format('DD/MMM') + "\t" + value;
            fs.appendFileSync(dataDir + metric.dataFile, dataLine);
        });
    });

    grunt.registerTask('metrics:plot', 'Plot graph for custom metrics', function () {
        var gnuplot = require('gnuplot');

        var dataDir = grunt.config('metrics.custom.dataDir');
        var imageDir = grunt.config('metrics.custom.imageDir');
        grunt.file.mkdir(imageDir);

        _.forEach(metricsFromConfig(), function (metric) {

            var gp = gnuplot();
            gp.set('terminal png size ' + metric.size);
            gp.set('output "' + imageDir + metric.imageFile + '"');
            gp.set('title "' + metric.title + '"');
            gp.set('nogrid');
            gp.set('style data lines');
            gp.set('yrange ' + metric.yrange);

            gp.plot('"' + dataDir + metric.dataFile +'" using 2:xticlabel(1) lw 3 title "' + metric.id + '"');
            gp.end();
        });
    });

    grunt.registerTask('metrics:custom:ci', [
        'metrics:collect',
        'metrics:plot',
        'exec:package_metrics_data'
    ]);
};

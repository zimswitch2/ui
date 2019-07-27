module.exports = function (grunt) {
    grunt.registerTask('metrics:plato:ci', [
        'plato',
        'exec:package_metrics_plato'
    ]);

    return {
        tasks: {
            plato: {
                metrics: {
                    files: {
                        'target/metrics/plato': ['src/main/**/*.js', 'src/test/**/*.js', '!src/main/assets/**/*.js', '!src/test/lib/**/*.js']
                    }
                }
            },
            exec: {
                package_metrics_plato: {
                    cmd: "mkdir -p distri && tar -C target/metrics -f distri/metrics_plato.tgz -cz plato"
                }
            }
        }
    };
};

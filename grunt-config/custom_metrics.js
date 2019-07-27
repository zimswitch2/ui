module.exports = function () {
    var execSync = require('child_process').execSync;
    var dataDir = "target/metrics/custom/data/";
    var imageDir = "target/metrics/custom/image/";

    var metrics = [
        {
            id: 'watches',
            title: '$watch count',
            value: function () {
                return execSync("grep '$watch' -r src/main/common src/main/features | wc -l");
            },
            max: 50
        },
        {
            id: 'old-toggles',
            title: 'number of toggles that can be removed',
            value: function () {
                return execSync("grep '\"target\": \"nymph\"' src/toggle/releaseToggles.json | wc -l");
            },
            max: 12
        }
    ];

    return {
        tasks: {
            "exec": {
                "package_metrics_data": {
                    "cmd": "mkdir -p distri && zip -j -r distri/metrics.zip " + dataDir
                }
            },
            "metrics": {
                "custom": {
                    "dataDir": dataDir,
                    "imageDir": imageDir,
                    "metrics": metrics
                }
            }
        }
    };
};

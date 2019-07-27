var feature = {};

(function (feature) {
    function loadToggles(file) {
        var response = null;

        var xhr = new window.XMLHttpRequest();
        xhr.onload = function () {
            response = this.responseText;
        };
        xhr.open('GET', file, false);
        xhr.send();

        for (var toggle in JSON.parse(response)) {
            feature[toggle] = true;
        }
    }

    loadToggles('base/toggle/releaseToggles.json');
    loadToggles('base/toggle/developmentToggles.json');
})(feature);
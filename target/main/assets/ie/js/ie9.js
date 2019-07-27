(function() {
    var angle = 0;
    setInterval(function(){
        angle+=8;
        $(".pace-activity").rotate(angle);
    }, 10);

    setInterval(function(){
        var fadeInterval = 500;
        var lightBlue = '#017cdb';
        var white = '#FFF';
        var gray = '#787878';
        var animationIterationCount = 2;

        function bgColorAnimation(obj, count) {
            var animationCycle = obj.animate({backgroundColor: lightBlue}, fadeInterval).animate({backgroundColor: white}, fadeInterval);
            if (count > 1) {
                return bgColorAnimation(animationCycle, count - 1);
            }
            return animationCycle;
        }

        function colorAnimation(obj, count) {
            var animationCycle = obj.animate({color: white}, fadeInterval).animate({color: gray}, fadeInterval);
            if (count > 1) {
                return colorAnimation(animationCycle, count - 1);
            }
            return  animationCycle;
        }

        bgColorAnimation($("li.highlight"), animationIterationCount);
        colorAnimation($("li.highlight>div>div"), animationIterationCount);
        $("li.highlight").removeClass('highlight');
    }, 100);
})();
function using(values, func){
    for (var i = 0, count = values.length; i < count; i++) {
        var args = values[i];
        if (Object.prototype.toString.call(args) !== '[object Array]') {
            args = [args];
        }
        func.apply(this, args);
    }
}

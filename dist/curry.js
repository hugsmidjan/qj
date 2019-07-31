// Super-simple, minimal, non-recursive function currier
// Complex typings
function curry(func) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return function () {
        var args2 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args2[_i] = arguments[_i];
        }
        return func.apply(this, args.concat(args2));
    };
}

module.exports = curry;

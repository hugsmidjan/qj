// Super-simple, minimal, non-recursive function currier
// Complex typings
function curryRight(func) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return function () {
        var args2 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args2[_i] = arguments[_i];
        }
        return func.apply(this, args2.concat(args));
    };
}
/* eslint-disable  @typescript-eslint/no-unused-vars */
var foo = function (a, b, c) {
    return /./;
};
var foo1 = curryRight(foo, 1, true);

module.exports = curryRight;

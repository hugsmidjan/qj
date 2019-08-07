// Simple String templating (variable injection) that accepts either arrays or hash-maps.
// Usage:
// var output = inject('Hello %{1}! Hava a %{0}', ['banana', 'John']);                           // Returns  'Hello John! Have a banana'
// var output = inject('Hello %{name}! Hava a %{food}', { food : 'banana', person : 'John' });   // Returns  'Hello John! Have a banana'
//
var hasOwnProperty = Object.prototype.hasOwnProperty;
function inject(template, vars) {
    return template.replace(/%\{([^%{}}]+?)\}/g, function (m, key) {
        if (!hasOwnProperty.call(vars, key)) {
            return m;
        }
        // @ts-ignore  (Bah)
        var value = vars[key];
        if (typeof value === 'function') {
            return value(key);
        }
        return value;
    });
}

module.exports = inject;

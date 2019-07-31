// Simple String templating (variable injection) that accepts either arrays or hash-maps.
var hasOwnProperty = Object.prototype.hasOwnProperty;
function inject(template, _vars) {
    return template.replace(/%\{([^%{}}]+?)\}/, function (m, key) {
        if (!hasOwnProperty.call(_vars, key)) {
            return m;
        }
        // @ts-ignore  (Bah)
        var value = _vars[key];
        if (typeof value === 'function') {
            return value(key);
        }
        return value;
    });
}

module.exports = inject;

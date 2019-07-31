// Convert an array-like list into an object containing the items
// grouped by some `prop` – where `prop` can be a custom function
function groupArrayBy(list, prop) {
    var getProp = typeof prop === 'function' ?
        prop :
        function (item) { return item[prop] + ''; };
    var grouped = {};
    [].forEach.call(list, function (item) {
        var name = getProp(item);
        if (!grouped[name]) {
            grouped[name] = [];
        }
        grouped[name].push(item);
    });
    return grouped;
}
function asArray(list, prop) {
    // @ts-ignore  (tsc doesn't know this is safe because the two functions have the same signature overload)
    var grouped = groupArrayBy(list, prop);
    return Object.keys(grouped).map(function (name) { return ({
        name: name,
        items: grouped[name],
    }); });
}
groupArrayBy.asArray = asArray;

module.exports = groupArrayBy;

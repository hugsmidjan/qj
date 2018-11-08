// Convert an array-like list into an object containing the items
// grouped by some `prop` – where `prop` can be a custom function
var groupArrayBy = function (list, prop) {
    var getProp = typeof prop === 'string' ?
        function (item) { return item[prop]; }:
        prop;

    var grouped = {};

    [].forEach.call(list, function (item) {
        var name = getProp(item);
        if (!grouped[name]) {
            grouped[name] = [];
        }
        grouped[name].push(item);
    });

    return grouped;
};

groupArrayBy.asArray = function (list, prop) {
    var grouped = groupArrayBy(list, prop);
    return Object.keys(grouped).map(function (name) { return ({
        name: name,
        items: grouped[name],
    }); });
};

module.exports = groupArrayBy;

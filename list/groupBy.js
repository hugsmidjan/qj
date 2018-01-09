// Convert an array-like list into an object containing the items
// grouped by some `prop` – where `prop` can be a custom function
const groupBy = (list, prop) => {
    const getProp = typeof prop === 'string' ?
        (item) => item[prop]:
        prop;

    const grouped = {};

    [].forEach.call(list, (item) => {
        const name = getProp(item);
        if (!grouped[name]) {
            grouped[name] = [];
        }
        grouped[name].push(item);
    });

    return grouped;
};

groupBy.asArray = (list, prop) => {
    const grouped = groupBy(list, prop);
    return Object.keys(grouped).map((name) => ({
        name,
        items: grouped[name],
    }));
};


export default groupBy;

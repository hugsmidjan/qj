function q(selectors, root) {
    return (!selectors || root === null) ? null : (root || document).querySelector(selectors);
}

module.exports = q;

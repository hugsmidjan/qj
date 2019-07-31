function qq(selectors, root) {
    return (!selectors || root === null) ? [] : [].slice.call((root || document).querySelectorAll(selectors));
}

module.exports = qq;

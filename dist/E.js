function E(tagName, attrs) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    var elm = document.createElement(tagName);
    if (attrs) {
        for (var name_1 in attrs) {
            var value = attrs[name_1];
            if (value != null) {
                if (name_1 === 'style') {
                    for (var cssProp in value) {
                        if (cssProp in elm.style) {
                            // @ts-ignore
                            elm.style[cssProp] = value[cssProp];
                        }
                    }
                }
                else if (name_1 in elm) {
                    // Note: This includes lowercased `onevent` attrs
                    // @ts-ignore
                    elm[name_1] = value;
                }
                else if ((/^on[A-Z]/).test(name_1)) {
                    // Camel-cased onEvent attrs
                    elm.addEventListener(name_1.substr(2).toLowerCase(), value);
                }
                else if (name_1.charAt(0) === '_') {
                    // Prefixing ambigious prop/attr names with an underscore
                    // signals they should be treated as properties
                    // @ts-ignore
                    elm[name_1.substr(1)] = value;
                }
                else {
                    // Default to setAttribute()
                    elm.setAttribute(name_1, value);
                }
            }
        }
    }
    var _appendChildren = function (child) {
        if (child instanceof Array || child instanceof NodeList) {
            child.forEach(_appendChildren);
        }
        else if (child || child === 0) {
            if (!(child instanceof Node)) {
                child = document.createTextNode(typeof child === 'string' ? child : String(child));
            }
            elm.appendChild(child);
        }
    };
    children.forEach(_appendChildren);
    return elm;
}

module.exports = E;

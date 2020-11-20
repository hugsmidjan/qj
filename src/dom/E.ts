// Hyperscript function that spits out DOM nodes.
interface Attrs {
	[attrName: string]: any;
	style?: CSSStyleDeclaration;
}
type Child = Node | string | number | null | undefined | false;
type ChildOrChildren = Child | Array<Child> | NodeList;

interface HyperScriptDOM {
	<T extends keyof HTMLElementTagNameMap>(
		tagName: T,
		attrs?: Attrs | null,
		...children: Array<ChildOrChildren>
	): HTMLElementTagNameMap[T];
	make: EMaker;
}

type EMaker = (
	document: Pick<Document, 'createElement' | 'createTextNode'>
) => HyperScriptDOM;

// ---------------------------------------------------------------------------

const makeE: EMaker = (document) => {
	const E: HyperScriptDOM = (tagName, attrs, ...children) => {
		const elm = document.createElement(tagName);
		if (attrs) {
			for (const name in attrs) {
				const value = attrs[name];
				if (value != null) {
					if (name === 'style') {
						for (const cssProp in value) {
							if (cssProp in elm.style) {
								// @ts-ignore
								elm.style[cssProp] = value[cssProp];
							}
						}
					} else if (name in elm) {
						// Note: This includes lowercased `onevent` attrs
						// @ts-ignore
						elm[name] = value;
					} else if (/^on[A-Z]/.test(name)) {
						// Camel-cased onEvent attrs
						elm.addEventListener(name.substr(2).toLowerCase(), value);
					} else if (name.charAt(0) === '_') {
						// Prefixing ambigious prop/attr names with an underscore
						// signals they should be treated as properties
						// @ts-ignore
						elm[name.substr(1)] = value;
					} else {
						// Default to setAttribute()
						elm.setAttribute(name, value);
					}
				}
			}
		}
		const _appendChildren = (child: ChildOrChildren) => {
			if (child instanceof Array || child instanceof NodeList) {
				child.forEach(_appendChildren);
			} else if (child || child === 0) {
				if (!(child instanceof Node)) {
					child = document.createTextNode(
						typeof child === 'string' ? child : String(child)
					);
				}
				elm.appendChild(child);
			}
		};
		children.forEach(_appendChildren);

		return elm;
	};
	E.make = makeE;
	return E;
};

export default makeE(
	typeof document !== 'undefined' ? document : ((undefined as unknown) as Document)
);

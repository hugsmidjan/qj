/**
 * **Usage:**
 *
 * `aquireId();`
 * – returns a valid unique DOM id string that can be safely assigned to an element.
 *
 * `aquireId(prefDefaultIdString);`
 * – returns a valid unique DOM id based on `prefDefaultIdString` (appending/autoincrementing a trailing integer if needed)
 *
 * `aquireId(elm);`
 * – returns the value of elm.id -- automatically assigning a unique id first, if needed.
 *
 * `aquireId(elm, prefDefaultIdString);`
 * – returns the value of elm.id -- if needed automatically assigning a unique id based on `prefDefaultIdString`.
 */

// suffix and prefix used to generate temporary @id-values for HTMLelements without an @id
const _guidPrefix = 'tmp_' + Date.now() + '_';
// a counter that should be incremented with each use.
let _guid = 1;

// aquireId
export default function aquireId(
	el?: Element | Array<Element> | NodeListOf<Element> | null,
	prefDefaultId?: string
) {
	// el is an optional parameter.
	if (typeof el === 'string') {
		prefDefaultId = el;
		el = undefined;
	}
	if (el) {
		el = 'nodeType' in el ? el : el[0];
	}
	if (!el || !el.id) {
		let id = prefDefaultId || _guidPrefix + _guid++;
		if (prefDefaultId) {
			let count;
			let idPrefix = prefDefaultId;
			while (document.getElementById(id)) {
				if (count === undefined) {
					const m = prefDefaultId.match(/\d+$/);
					count = m ? parseInt(m[0]) : 1;
					idPrefix = m ? prefDefaultId.replace(/\d+$/, '') : prefDefaultId;
				}
				count++;
				id = idPrefix + count;
			}
		}
		if (!el) {
			return id;
		}
		if (!el.id) {
			el.id = id;
		}
	}
	return el.id;
}

// Sets the document.location.hash while suppressing the viewport scrolling
// Accepts a plaintext fragment - and URI encodes it automatically - unless the `_isEncoded` flag is set.
// Usage:
//   setFrag('myid');
//   setFrag('#myid');
//   setFrag('Fraîce 18%');
//   setFrag('Fra%C3%AEce%2018%25', true);
//   setFrag('');    // unset
//   setFrag(null);  // unset

// encodes a plain-text string to a URL #fragment friendly format (compatible with .get())
const encodeFrag = (_fragment: string) => {
	return encodeURI(_fragment).replace(/#/g, '%23').replace(/%7C/g, '|');
};

const setFrag = (_fragment?: string, _isEncoded?: boolean): void => {
	_fragment = (_fragment || '').replace(/^#/, '');
	// check if there exists an element with .id same as _fragment
	const _elm =
		_fragment &&
		document.getElementById(_isEncoded ? decodeURIComponent(_fragment) : _fragment);
	const _prePos =
		window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
	const _tmpId = _elm && _elm.id;

	// temporaily defuse the element's id
	_elm && (_elm.id = '');

	// set the damn hash... (Note: Safari 3 & Chrome barf if frag === '#'.)
	document.location.hash = _isEncoded ? _fragment : encodeFrag(_fragment);

	// Always reset scrollpos
	// (because Chrome ~v34 seems to scroll to the element which had -
	// that ID on page load regardless of wheter its id has changed
	// or if another element has now received that id. weird.)
	window.scrollTo(0, _prePos);

	// put the old DOM id back in it's place
	_elm && (_elm.id = _tmpId || '');
};

// returns the #fragment portion of `url` (defaulting to using `document.location.href`)
// returns a plaintext (decodeURIComponent) version of the fragment - unless a `_returnRaw` argument is passed.
const getFrag = (url?: string, _returnRaw?: boolean): string => {
	const _fragment = (url || document.location.href).split('#')[1] || '';
	return _returnRaw ? _fragment : decodeURIComponent(_fragment);
};

const frag = {
	get: getFrag,
	set: setFrag,
	encode: encodeFrag,
};

export { setFrag, getFrag, encodeFrag, frag as default };

export default function reloadPage(url) {
  const _docLoc = document.location;
  const _docHref = _docLoc.href;
  url = url || _docHref;
  // juggling ?/& suffixes is neccessary to 100% guarantee a reload.
  if ( url === _docHref ) {
    const blah =  !/\?/.test(url) ?
                    '?':
                  !/[&?](?:#|$)/.test(url) ?
                    '&':
                    '';
    url = url.replace(/[&?]?(#.*)?$/, blah+'$1');
  }
  _docLoc.replace( url );
}

// parseParams( queryString )
//
// Convert queryString type Strings into a neat object
// where each named value is an Array of URL-decoded Strings.
// Defaults to parsing the current document URL if no paramString is passed.
//
// Example:
//    var obj = parseParamS( "?foo=1&=bar&baz=&foo=2&" );
//      ==>  {  'foo':['1','2'],  '':['bar'],  'baz':['']  }
//    var obj = parseParamS( "" );
//      ==>  { }
export default function parseParams(paramString) {
  var map = {};
  paramString = ( paramString!=null ? paramString : document.location.search )
                    .trim()
                    .replace(/^[?&]/, '')
                    .replace(/&$/, '');
  if ( paramString ) {
    paramString
        .replace(/\+/g, ' ')
        .split('&')
        .forEach((paramBit) => {
          let [name, value] = paramBit.split('=');
          name = decodeURIComponent(name);
          const values = map[name] || (map[name] = []);
          values.push( decodeURIComponent(value||'') );
        });
  }
  return map;
}

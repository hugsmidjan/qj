type Params<P extends string> = Record<P, Array<string> | undefined>;

/**
 * Convert queryString type Strings into a neat object
 * where each named value is an Array of URL-decoded Strings.
 * Defaults to parsing the current document URL if no paramString is passed.
 *
 * Example:
 *    var obj = parseParamS( "?foo=1&=bar&baz=&foo=2&" );
 *      ==>  {  'foo':['1','2'],  '':['bar'],  'baz':['']  }
 *    var obj = parseParamS( "" );
 *      ==>  { }
 *
 */
export default function parseParams<P extends string>(
  queryString?: string | undefined
): Params<P> {
  const map: Record<string, Array<string> | undefined> = {};
  const paramString = (
    arguments.length === 0 ? document.location.search : queryString || ''
  )
    .trim()
    .replace(/^[?&]/, '')
    .replace(/&$/, '');

  if (paramString) {
    paramString
      .replace(/\+/g, ' ')
      .split('&')
      .forEach((paramBit) => {
        // eslint-disable-next-line prefer-const
        let [name, value] = paramBit.split('=');
        name = decodeURIComponent(name);
        const values = map[name] || (map[name] = []);
        values.push(decodeURIComponent(value || ''));
      });
  }
  return map as Params<P>;
}

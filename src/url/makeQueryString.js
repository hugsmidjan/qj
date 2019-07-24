export default function makeQueryString/*:: <T = boolean | number | string | null | undefined>*/(paramsObj/*: Record<string, T | Array<T>>*/)/*: string*/ {
    return Object.keys(paramsObj)
        .reduce((acc, key) => {
            let param = paramsObj[key];
            if (!Array.isArray(param) ) {
              param = [param];
            }
            param.forEach(value => {
              if ( param != null ) {
                acc.push(key+'='+encodeURIComponent(String(param)))
              }
            });
            return acc;
        }, [])
        .join('&');
}

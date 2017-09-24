export default function makeQueryString(paramsObj) {
  return Object.keys(paramsObj)
      .map((key) => {
        const param = paramsObj[key];
        return (param!=null ? key+'='+encodeURIComponent(''+param) : '');
      })
      .join('&');
}

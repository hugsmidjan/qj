export default function makeQueryString(paramsObj) {
  return Object.keys(paramsObj)
      .map((key) => {
        const param = paramsObj[key];
        return key +'='+ (param!=null ? encodeURIComponent(param) : '');
      })
      .join('&');
}

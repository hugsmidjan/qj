//@flow

const _paramREs = {};

export default function getUrlParam(name/*:string*/, url/*:?string*/)/*:?string*/ {
  let re = _paramREs[name];
  if ( !re ) {
    const safeName = name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    re = new RegExp('(?:^|&)'+safeName+'=([^&]+)');
    _paramREs[name] = re;
  }
  url = url!=null ? url.split('#')[0].split('?')[1] : document.location.search.substr(1);
  return ( re.exec(url) || [] )[1];
}

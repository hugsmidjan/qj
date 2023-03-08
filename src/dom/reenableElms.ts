import qq from '../select/qq';

import { HtmlToDivDisableds } from './htmlToDiv';

// reenable selected HTML elements that were disbbled by htmlToDiv()
export default function reenableElms(elm: Element, tagName: HtmlToDivDisableds) {
  const disabledTagName = tagName + '--disabled';
  const re = new RegExp('(<\\/?' + tagName + ')--disabled([ >])', 'gi');
  const enable = (elm: Element) => {
    elm.outerHTML = elm.outerHTML.replace(re, '$1$2');
  };
  if (elm.tagName.toLowerCase() === disabledTagName) {
    enable(elm);
  } else {
    // Since none of the elements disabled by htmlToDiv() may be nested
    // we can assume this is an either or case.
    qq(disabledTagName, elm).forEach(enable);
  }
  return elm;
}

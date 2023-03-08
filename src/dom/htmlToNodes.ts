import A from '../list/A';

import htmlToDiv, { HtmlToDivOpts } from './htmlToDiv';

export default function htmlToNodes(
  html: string,
  opts?: HtmlToDivOpts
): Array<ChildNode> {
  return A(htmlToDiv(html, opts).childNodes);
}

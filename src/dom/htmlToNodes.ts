import A from '../list/A';
import htmlToDiv from './htmlToDiv';

import { HtmlToDivOpts } from './htmlToDiv';

export default function htmlToNodes(
	html: string,
	opts?: HtmlToDivOpts
): Array<ChildNode> {
	return A(htmlToDiv(html, opts).childNodes);
}

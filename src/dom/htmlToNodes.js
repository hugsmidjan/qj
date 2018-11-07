//@flow
import A from '../list/A';
import htmlToDiv from './htmlToDiv';

/*::
    import type { HtmlToDivOpts } from './htmlToDiv';
*/

export default function htmlToNodes(html/*:string*/, opts/*:?HtmlToDivOpts*/)/*:Array<Node>*/ {
    return A( htmlToDiv(html, opts).childNodes );
}

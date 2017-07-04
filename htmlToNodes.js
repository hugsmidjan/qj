import A from './A';
import htmlToDiv from './htmlToDiv';

export default function htmlToNodes(html, opts) {
  return A( htmlToDiv(html, opts).childNodes );
}

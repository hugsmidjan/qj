export type HtmlToDivDisableds =
	| 'img'
	| 'script'
	| 'html'
	| 'head'
	| 'body'
	| 'title'
	| 'meta'
	| 'style'
	| 'link';

export type HtmlToDivOpts = {
	keepimg?: boolean;
	keepscript?: boolean;
	keephtml?: boolean;
	keephead?: boolean;
	keepbody?: boolean;
	keeptitle?: boolean;
	keepmeta?: boolean;
	keepstyle?: boolean;
	keeplink?: boolean;

	document?: HTMLDocument;
};

export default function htmlToDiv(html: string, opts?: HtmlToDivOpts): HTMLDivElement {
	const doc = (opts || {}).document || document;
	const div = doc.createElement('div');
	div.innerHTML = String(html)
		.replace(/<!DOCTYPE[^>]*>/gi, '')
		.replace(
			/(<\/?(img|script|html|head|body|title|meta|style|link))( |>)/gi,
			(m, p1, p2, p3) => {
				return (
					p1 +
					(opts &&
					// @ts-ignore  (slighly hacky single-pass rather than mulitple enumerating passes)
					opts['keep' + p2.toLowerCase()]
						? ''
						: '--disabled') +
					p3
				);
			}
		);
	return div;
}

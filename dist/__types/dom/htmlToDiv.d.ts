export declare type HtmlToDivDisableds = 'img' | 'script' | 'html' | 'head' | 'body' | 'title' | 'meta' | 'style' | 'link';
export declare type HtmlToDivOpts = {
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
export default function htmlToDiv(html: string, opts?: HtmlToDivOpts): HTMLDivElement;

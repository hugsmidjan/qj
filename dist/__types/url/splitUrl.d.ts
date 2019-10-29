export declare type UrlComponents = {
    url: string;
    queryString: string;
    hash: string;
};
declare const splitUrl: (url: string) => UrlComponents;
export default splitUrl;

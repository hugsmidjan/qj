declare type hours = number;
declare const getCookie: (name: string) => string | undefined;
/**
 * Set cookie.
 *
 * Setting value to `null|undefined` or `expires: -1` deletes a cookie
*/
declare function setCookie(name: string, value: string | number | boolean, options?: {
    expires?: hours | Date;
    path?: string;
    domain?: string;
    secure?: boolean;
}): void;
/**
 * Delete cookie.
*/
declare function setCookie(name: string, value: null | undefined, options?: {
    expires?: -1;
    path?: string;
    domain?: string;
    secure?: boolean;
}): void;
declare const cookie: {
    get: (name: string) => string | undefined;
    set: typeof setCookie;
};
export { getCookie, setCookie, cookie as default, };

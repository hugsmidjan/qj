declare const encodeFrag: (_fragment: string) => string;
declare const setFrag: (_fragment?: string | undefined, _isEncoded?: boolean | undefined) => void;
declare const getFrag: (url?: string | undefined, _returnRaw?: boolean | undefined) => string;
declare const frag: {
    get: (url?: string | undefined, _returnRaw?: boolean | undefined) => string;
    set: (_fragment?: string | undefined, _isEncoded?: boolean | undefined) => void;
    encode: (_fragment: string) => string;
};
export { setFrag, getFrag, encodeFrag, frag as default };

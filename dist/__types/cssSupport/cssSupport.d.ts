declare type PropInfo = {
    prop: string;
    css: string;
};
export default function cssSupport(propname: Exclude<keyof CSSStyleDeclaration, number>): PropInfo | false;
export {};

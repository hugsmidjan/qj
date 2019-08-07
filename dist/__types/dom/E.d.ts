interface Attrs {
    [attrName: string]: any;
    style?: CSSStyleDeclaration;
}
declare type Child = Node | string | number | null | undefined | false;
declare type ChildOrChildren = Child | Array<Child> | NodeList;
export default function E<T extends keyof HTMLElementTagNameMap>(tagName: T, attrs?: Attrs | null, ...children: Array<ChildOrChildren>): HTMLElementTagNameMap[T];
export {};

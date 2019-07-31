declare type SearchItem = string | object;
declare type TextGetter<Item> = (obj: Item) => string;
export declare type TextSearchProps<Item extends SearchItem> = {
    items: Array<Item>;
    term: string;
    normalized?: boolean;
} & (Item extends string ? {
    prop?: TextGetter<Item>;
} : {
    prop: TextGetter<Item> | keyof Item;
});
declare const textSearch: {
    <Item extends SearchItem>(props: TextSearchProps<Item>): Item[];
    normalize: (str: string | string[]) => string;
};
export default textSearch;

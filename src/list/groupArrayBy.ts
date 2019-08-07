// Convert an array-like list into an object containing the items
// grouped by some `prop` – where `prop` can be a custom function

type ToStringer<T> = (item: T) => string;
type Grouped<T> = Record<string, Array<T>>;

function groupArrayBy<T extends object, K extends keyof T>(
  list: ArrayLike<T>,
  prop: K
): Grouped<T>;
function groupArrayBy<T extends object | string | number>(
  list: ArrayLike<T>,
  prop: ToStringer<T>
): Grouped<T>;

function groupArrayBy<T extends object | string | number, K extends keyof T>(
  list: ArrayLike<T>,
  prop: K | ToStringer<T>
): Grouped<T> {
    const getProp: ToStringer<T> = typeof prop === 'function' ?
        prop:
        (item) => item[prop]+'';

    const grouped: Grouped<T> = {};

    [].forEach.call(list, (item: T) => {
        const name = getProp(item);
        if (!grouped[name]) {
            grouped[name] = [];
        }
        grouped[name].push(item);
    });

    return grouped;
}

type GroupList<T> = Array<{ name: string; items: Array<T> }>;

function asArray<T extends object, K extends keyof T>(
  list: ArrayLike<T>,
  prop: K
): GroupList<T>;
function asArray<T extends object | string | number>(
  list: ArrayLike<T>,
  prop: ToStringer<T>
): GroupList<T>;

function asArray<T extends object | string | number, K extends keyof T>(
  list: ArrayLike<T>,
  prop: K | ToStringer<T>
): GroupList<T> {
    // @ts-ignore  (tsc doesn't know this is safe because the two functions have the same signature overload)
    const grouped = groupArrayBy(list, prop);

    return Object.keys(grouped).map((name) => ({
        name,
        items: grouped[name],
    }));
}

groupArrayBy.asArray = asArray;

export default groupArrayBy;

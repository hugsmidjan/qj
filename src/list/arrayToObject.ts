// Convert an array-like list into an object keyed by prop.
// Prop values are assumed to be unique.
// Array items with repeated keys (prop value) are skipped
// If prop is undefined, the Array values are used as keys
// with the value being a count of how many times each key occured
/*
  const arr1 = [
    {name:'Tim', age:12},
    {name:'Sam', age:10},
    {name:'Tim', age:29},
  ];
  console.log( arrayToObject(arr1, 'name') );
  // { Tim:{name:'Tim',age:12}, Sam:{name:'Sam',age:10} };

  const arr2 = ['Orange', 'Apple', 'Tomato', 'Apple', 'Apple'];

  console.log( arrayToObject(arr2) );
  // { Orange:1, Apple:3, Tomato:1 }

*/

type ItemCount<T extends string | number> = Record<T, number>;
type ByProp<T> = Record<string, T>;

function arrayToObject<T extends object, K extends keyof T>(
	list: ArrayLike<T>,
	prop: K
): ByProp<T>;
function arrayToObject<T extends string | number>(list: ArrayLike<T>): ItemCount<T>;

function arrayToObject<
	T extends object | string | number,
	TL extends Exclude<T, object>,
	K extends keyof T
>(list: ArrayLike<T>, prop?: K): ByProp<T> | ItemCount<TL> {
	return prop
		? [].reduce.call(
				list,
				(obj: ByProp<T>, item: T) => {
					const key = (item[prop] as unknown) as string;
					if (!(key in obj)) {
						obj[key] = item;
					}
					return obj;
				},
				{}
		  )
		: [].reduce.call(
				list,
				(obj: ItemCount<TL>, item: TL) => {
					obj[item] = (obj[item] || 0) + 1;
					return obj;
				},
				{}
		  );
}

export default arrayToObject;

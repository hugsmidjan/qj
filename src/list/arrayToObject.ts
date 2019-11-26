// Convert an array-like list into an object keyed by prop.
// Prop values are assumed to be unique and repeat keys are
// overwritten
// If prop is undefined, the Array values are used as keys
/*
  const arr1 = [
    {name:'Tim', age:12},
    {name:'Sam', age:10},
    {name:'Tim', age:29},
  ];
  console.log( arrayToObject(arr1, 'name') );
  // { Tim: {name:'Tim', age:12},  Sam: {name:'Sam', age:10} };

  const arr2 = ['Orange', 'Apple', 'Tomato', 'Apple', 'Apple'];

  console.log( arrayToObject(arr2) );
  // { Orange: 'Orange',  Apple: 'Apple',  Tomato: 'Tomato' }

*/

function arrayToObject<T extends object, K extends keyof T>(
	list: ArrayLike<T>,
	prop: K | ((item: T) => string)
): Record<string, T>;

function arrayToObject<T extends string | number>(
	list: ArrayLike<T>,
	prop?: (item: T) => string
): Record<string, T>;

function arrayToObject<T extends object | string | number, K extends keyof T>(
	list: ArrayLike<T>,
	prop?: K | ((item: T) => string)
): Record<string, T> {
	const getKey =
		typeof prop === 'function'
			? prop
			: prop
			? (item: T) => String(item[prop])
			: (item: T) => String(item);
	return [].reduce.call(
		list || [],
		(obj: Record<string, T>, item: T) => {
			const key = getKey(item);
			if (!(key in obj)) {
				obj[key] = item;
			}
			return obj;
		},
		{}
	);
}

export default arrayToObject;

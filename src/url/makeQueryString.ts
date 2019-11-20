type ParamsValues = boolean | number | string | null | undefined;
export type ParamsObject = Record<string, ParamsValues | Array<ParamsValues>>;

export default function makeQueryString(paramsObj: ParamsObject): string {
	return Object.keys(paramsObj)
		.reduce<Array<string>>((acc, key) => {
			let param = paramsObj[key];
			if (!Array.isArray(param)) {
				param = [param];
			}
			param.forEach((value) => {
				if (value != null) {
					const strVal = encodeURIComponent(String(value));
					acc.push(key + (strVal ? '=' + strVal : ''));
				}
			});
			return acc;
		}, [])
		.join('&');
}

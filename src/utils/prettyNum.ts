// Chrome doesn't yet support icelandic for Number.toLocaleString (2.9.2020)
export const prettyNum = (
	number?: string | number,
	decimals = 0,
	tSep = '.',
	dSep = ','
) => {
	number = typeof number === 'string' ? parseFloat(number) : number;
	number = !number || isNaN(number) ? 0 : number;

	const numSplit = number.toFixed(decimals).split('.');
	const num = numSplit[0].replace(/\d(?=(\d{3})+$)/g, '$&' + tSep);
	return num + (numSplit[1] ? dSep + numSplit[1] : '');
};

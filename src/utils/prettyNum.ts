// Chrome doesn't yet support icelandic for Number.toLocaleString (2.9.2020)
const i18n = {
	is: [',', '.'],
	en: ['.', ','],
} as const;
type SupportedLanguages = keyof typeof i18n;

export type PrettyNumOptions = {
	/** Max number of decimals to render */
	decimals?: number;
	/** Should decimals be uniformly applied to all numbers */
	fixedDecimals?: boolean;
	/** Default: `true` */
	leadingZero?: boolean;
	/** Default: `'en'`
	 *
	 * If your language isn't supported use the `splitters` option instead.
	 */
	lang?: SupportedLanguages;
	/** The tokens to use for a) decimals and b) thousands
	 *
	 * Examples Icelandic uses `[',', '.']` and English uses `['.', ',']`
	 *
	 * Default: `['.', '']`
	 */
	splitters?: [string, string] | [string];
	// Supported by TS 4.0 https://devblogs.microsoft.com/typescript/announcing-typescript-4-0-rc/#labeled-tuple-elements
	// splitters?: [decimal: string, thousands: string] | [decimal: string];
};

export const prettyNum = (number?: string | number, opts: PrettyNumOptions = {}) => {
	const {
		decimals = 0, // is this the right default?
		fixedDecimals,
		leadingZero = true,
		lang = 'en',
		// NOTE: explicit `splitters` value always trumps the `lang` option
		splitters = i18n[lang] || [],
	} = opts;
	const numFloat = parseFloat('' + number);
	if (isNaN(numFloat)) {
		console.error('Invalid numer: ', number);
		return 'error';
	}

	const dSep = splitters[0] || '.';
	const tSep = splitters[1] || '';

	const re = new RegExp(`\\.\\d{${decimals}}`);
	const numSplit = (fixedDecimals || re.test(String(numFloat))
		? numFloat.toFixed(decimals)
		: String(numFloat)
	).split('.');

	let num = numSplit[0].replace(/\d(?=(\d{3})+$)/g, '$&' + tSep);
	num = !leadingZero && num[0] === '0' ? num.replace(/\d/, '') : num;
	return num + (numSplit[1] ? dSep + numSplit[1] : '');
};

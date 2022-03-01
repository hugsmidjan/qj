// Chrome doesn't yet support icelandic for Number.toLocaleString (2.9.2020)

const ensureNumber = (maybeNumber: string | number | undefined): number | undefined => {
	const numFloat =
		typeof maybeNumber !== 'number' ? parseFloat('' + maybeNumber) : maybeNumber;
	if (isNaN(numFloat)) {
		if (typeof process !== undefined && process.env.NODE_ENV !== 'production') {
			console.error("prettyNum can't format:", maybeNumber);
		}
		return undefined;
	}
	return numFloat;
};

const i18n: Record<string, [string, string]> = {
	is: [',', '.'],
};

if (process.env.NODE_ENV !== 'production') {
	i18n.testing = i18n.is;
}

const reCache: Array<RegExp> = [];

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
	lang?: string;
	/** The tokens to use for a) decimals and b) thousands
	 *
	 * Examples Icelandic uses `[',', '.']` and English uses `['.', ',']`
	 *
	 * Default: `['.', '']`
	 */
	splitters?: [decimal: string, thousands: string] | [decimal: string];
};

// eslint-disable-next-line complexity
export const prettyNum = (number?: string | number, opts: PrettyNumOptions = {}) => {
	const {
		decimals = 0, // is this the right default?
		fixedDecimals,
		leadingZero = true,
		lang = 'en',
	} = opts;

	const numFloat = ensureNumber(number);
	if (numFloat == null) {
		return '';
	}

	if (!opts.splitters && Intl.Collator.supportedLocalesOf(lang).length === 1) {
		let formatted = numFloat.toLocaleString(lang, {
			maximumFractionDigits: decimals,
			minimumFractionDigits: decimals,
		});
		if (decimals > 0 && !fixedDecimals && numFloat === Math.round(numFloat)) {
			formatted = formatted.replace(/\D0+$/, '');
		}
		if (!leadingZero && Math.abs(numFloat) < 1) {
			formatted = formatted.replace(/^(-?)0/, '$1');
		}
		return formatted;
	}

	// NOTE: explicit `splitters` value always trumps the `lang` option
	const splitters = opts.splitters || i18n[lang] || [];

	const dSep = splitters[0] || '.';
	const tSep = splitters[1] || '';

	const re = reCache[decimals] || (reCache[decimals] = new RegExp(`\\.\\d{${decimals}}`));
	const numSplit = (fixedDecimals || re.test(String(numFloat))
		? numFloat.toFixed(decimals)
		: String(numFloat)
	).split('.');

	let num = numSplit[0].replace(/\d(?=(\d{3})+$)/g, '$&' + tSep);
	num = !leadingZero && num[0] === '0' ? num.replace(/\d/, '') : num;
	return num + (numSplit[1] ? dSep + numSplit[1] : '');
};

const _reCache: Record<string, RegExp | undefined> = {};

/**
 * Crops a string to a specified length and appends and appends an ellipsis
 * (configurable, but defaults to `" …"`).
 *
 * It is clever enough to only crop at word boundries, and accounts for the
 * length of the added ellipsis before deciding to crop.
 *
 * The input string is trimmed and all types of whitespace is collapsed to
 * a single, normal space.
 */
export default function cropText(str: string, length: number, ellipsis?: string): string {
  if (ellipsis == null) {
    ellipsis = ' …';
  }
  str = str.trim().replace(/\s+/g, ' ');
  length = Math.round(length);
  if (str.length > length + ellipsis.length) {
    const hash = length + '~~' + ellipsis;
    const cropLimit = Math.max(length - Math.floor((ellipsis.length - 1) / 2), 0);
    const re =
      _reCache[hash] || (_reCache[hash] = new RegExp('^(.{0,' + cropLimit + '})\\s+.*$'));
    const newTxt = str.replace(re, '$1').slice(0, cropLimit);
    return newTxt + (newTxt.length < str.length ? ellipsis : '');
  }
  return str;
}

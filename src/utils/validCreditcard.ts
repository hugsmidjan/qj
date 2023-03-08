// Strip out the optional space|dash delimiters
const cleanCCNum = (ccnum: string): string => ccnum.replace(/[ -]/g, '');

// Returns true if it looks vaguely like a valid credid card number
// Fake Credit Card number for testing: 1234-1234-1234-1238
function validCreditcard(ccnum: string): boolean {
  ccnum = ccnum && cleanCCNum(ccnum);
  if (ccnum) {
    // Card numbers can range from 13 to 19 digits - according to Valitor, anno 2016
    if (!/^\d{13,19}$/.test(ccnum)) {
      return false;
    }
    // Apply Luhn checksum algorithm
    // (https://en.wikipedia.org/wiki/Luhn_algorithm)
    let checkSum = 0;
    let doDouble = false;
    let i = ccnum.length;
    while (i--) {
      const num = parseInt(ccnum[i]);
      checkSum += num;
      if (doDouble) {
        // every-other digit (starting from the last) should
        // be doubled (added twice) and if the doubling results
        // in a two-digit number, then subtract 9 to get the sum of its digits.
        // (i.e. 2 * 6 === 12  ...  1 + 2 === 3 === 12 - 9)
        checkSum += num - (num > 4 ? 9 : 0); // Þversumma!
      }
      doDouble = !doDouble;
    }
    // checkSum % 10 must be 0
    if (checkSum % 10 !== 0) {
      return false;
    }
  }
  return true;
}

validCreditcard.clean = cleanCCNum;

export default validCreditcard;

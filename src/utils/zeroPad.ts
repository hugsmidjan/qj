// coderjoe zero padding for numbers - http://jsperf.com/left-zero-pad/18
export default function zeroPad(number: number, width: number): string {
	const absNum = Math.abs(number);
	const numZeros = Math.max(0, width - Math.floor(absNum).toString().length);
	const zeros = Math.pow(10, numZeros).toString().substr(1);
	return (number < 0 ? '-' : '') + zeros + absNum;
}

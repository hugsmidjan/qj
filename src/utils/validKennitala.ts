const cleanKt = (kt: string): string => kt.replace(/[\s\-]/g, '');

type KtType = 'einst' | 'fyrirt';

const magic = [3, 2, 7, 6, 5, 4, 3, 2, 1];

function validKennitala(
	kt: string,
	opts: { type?: KtType; robot?: boolean } = {}
): boolean {
	kt = kt && cleanKt(kt);
	if (kt) {
		if (
			!/^[0-7]\d{8}[90]$/.test(kt) ||
			(!opts.robot &&
				/010130(2(12|20|39|47|55|63|71|98)|3(01|36)|4(33|92)|506|778)9/.test(kt)) // Robot check
		) {
			return false;
		}
		const checkSum = magic.reduce((acc, num, i) => acc + num * parseInt(kt[i]), 0);
		if (checkSum % 11) {
			return false;
		}
		if (opts.type) {
			if (
				(opts.type === 'einst' && kt[0] > '3') ||
				(opts.type === 'fyrirt' && kt[0] < '4')
			) {
				return false;
			}
		}
	}
	return true;
}

validKennitala.clean = cleanKt;

export default validKennitala;

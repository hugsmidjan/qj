import o from 'ospec';

import { Equals, Expect, Extends, NotExtends } from '../__testing/types';

import {
  cleanKennitalaAggressive,
  cleanKennitalaCareful,
  formatKennitala,
  generateKennitala,
  getKennitalaBirthDate,
  isCompanyKennitala,
  isPersonKennitala,
  isTempKennitala,
  isValidKennitala,
  Kennitala,
  KennitalaCompany,
  KennitalaData,
  KennitalaDataCompany,
  KennitalaDataPerson,
  KennitalaPerson,
  KennitalaTemporary,
  KennitalaType,
  parseKennitala,
} from './kennitala';

const ktPerson = '1012755239';
const ktCompany = '5001012880';
const ktGervi = '0101307789';
const ktKerfis = '8123456793';
const ktInvalid1 = '1212657890';
const ktInvalid2 = '10127552';

const ktPersonImpossible = '3368492689'; // technically valid, but impossible
const ktPersonImpossibleSneaky = '2902904499'; // technically valid, but impossible (1990 wasn't a leap year)
const ktCompanyImpossible = '7368492689'; // technically valid, but impossible
const ktCompanyImpossibleSneaky = '6902900499'; // technically valid, but impossible (1990 wasn't a leap year)

const kt_Person1 = '101275-5239';
const kt_Person1_EnDash = '101275– 5239';
const ktPersonAncient = '1012755238'; // ends with 8
const kt_Company = '500101 2880';
const kt_Company2 = '500101 - 2880';
const kt_Kerfis = '812345- 6793 ';

const kt_Malformed1 = ' 10-1275-52 39';
const kt_Malformed2 = ' 101275-52';
const kt_Malformed3 = '101275   - 5239';
const kt_Malformed2_EmDash = '101275—5239';

// ---------------------------------------------------------------------------
// Type Signature Tests

if (false as boolean) {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const either = parseKennitala(ktPerson);
  if (either) {
    type v = Expect<Equals<typeof either.value, Kennitala>>;
    type t = Expect<Equals<typeof either.type, KennitalaType>>;
    type r = Expect<Equals<typeof either.robot, false>>;
    if (either.type === 'person') {
      type v = Expect<Equals<typeof either.value, KennitalaPerson>>;
    }
    if (either.type === 'company') {
      type v = Expect<Equals<typeof either.value, KennitalaCompany>>;
    }
  }
  const eitherRobot = parseKennitala(ktPerson, { robot: true });
  if (eitherRobot) {
    type v = Expect<Equals<typeof eitherRobot.value, Kennitala>>;
    type t = Expect<Equals<typeof eitherRobot.type, KennitalaType>>;
    type r = Expect<Equals<typeof eitherRobot.robot, boolean>>;
    if (eitherRobot.type === 'company') {
      type v = Expect<Equals<typeof eitherRobot.robot, false>>;
    }
  }
  const person = parseKennitala(ktPerson, { type: 'person' });
  if (person) {
    type v = Expect<Equals<typeof person.value, KennitalaPerson>>;
    type t = Expect<Equals<typeof person.type, 'person'>>;
    type r = Expect<Equals<typeof person.robot, false>>;
  }
  const company = parseKennitala(ktPerson, { type: 'company', clean: 'careful' });
  if (company) {
    type v = Expect<Equals<typeof company.value, KennitalaCompany>>;
    type t = Expect<Equals<typeof company.type, 'company'>>;
    type r = Expect<Equals<typeof company.robot, false>>;
  }

  const str = '' as string;
  if (isValidKennitala(str)) {
    type k = Expect<Equals<typeof str, Kennitala>>;
  }
  if (isValidKennitala(str, { type: 'person' })) {
    type k = Expect<Equals<typeof str, KennitalaPerson>>;
  }
  if (isValidKennitala(str, { type: 'company' })) {
    type k = Expect<Equals<typeof str, KennitalaCompany>>;
  }
  if (isValidKennitala(str, { clean: 'none' })) {
    type k = Expect<Equals<typeof str, Kennitala>>;
  }
  if (isValidKennitala(str, { clean: 'careful' })) {
    type k = Expect<Equals<typeof str, string>>;
  }
  if (isValidKennitala(str, { clean: 'aggressive' })) {
    type k = Expect<Equals<typeof str, string>>;
  }

  const kts: Array<Kennitala> = [];
  const persons: Array<KennitalaPerson> = kts.filter(isPersonKennitala);
  const companies: Array<KennitalaCompany> = kts.filter(isCompanyKennitala);
  const kerfises: Array<KennitalaTemporary> = kts.filter(isTempKennitala);
  type tp = Expect<Extends<KennitalaTemporary, KennitalaPerson>>;
  type pt = Expect<NotExtends<KennitalaPerson, KennitalaTemporary>>;

  const alwaysPerson = parseKennitala(ktPerson as KennitalaPerson);
  type v = Expect<Equals<typeof alwaysPerson, KennitalaDataPerson | undefined>>;
  const alwaysPerson2 = parseKennitala(ktPerson as KennitalaPerson, { robot: true });
  type v2 = Expect<Equals<typeof alwaysPerson2, KennitalaDataPerson<boolean>>>;
  const alwaysCompany = parseKennitala(ktCompany as KennitalaCompany);
  type v3 = Expect<Equals<typeof alwaysCompany, KennitalaDataCompany>>;
  /* eslint-enable */
}

// ---------------------------------------------------------------------------

const satisfies = (
  actual: KennitalaData | undefined,
  satisfy: Partial<KennitalaData>
) => {
  o(actual).notEquals(undefined);
  if (actual) {
    Object.entries(satisfy).forEach(([key, expected]) => {
      o(actual[key as keyof KennitalaData]).equals(expected)(key);
    });
  }
};

o.spec('parseKennitala', () => {
  const dataKerfis = {
    value: ktKerfis as KennitalaPerson,
    type: 'person',
    robot: false,
    temporary: true,
    formatted: '812345-6793',
  } as const;

  const dataPerson = {
    value: ktPerson as KennitalaPerson,
    type: 'person',
    robot: false,
    formatted: '101275-5239',
  } as const;

  const dataCompany = {
    value: ktCompany as KennitalaCompany,
    type: 'company',
    robot: false,
    formatted: '500101-2880',
  } as const;

  const dataGervi = {
    value: ktGervi as KennitalaPerson,
    type: 'person',
    robot: true,
    formatted: '010130-7789',
  } as const;

  o('parses simple kennitala', () => {
    satisfies(parseKennitala(ktPerson), dataPerson);
    satisfies(parseKennitala(ktKerfis), dataKerfis);
    satisfies(parseKennitala(ktCompany), dataCompany);
    o(parseKennitala(ktGervi)).equals(undefined);
    o(parseKennitala(ktInvalid1)).equals(undefined);
    o(parseKennitala(ktInvalid2)).equals(undefined);
  });

  o('Treats empty (and falsy) input as invalid', () => {
    o(parseKennitala('')).equals(undefined);
    // @ts-expect-error  (testing invalid input)
    const bogusInput1: string = undefined;
    o(parseKennitala(bogusInput1)).equals(undefined);
    // @ts-expect-error  (testing invalid input)
    const bogusInput2: string = false;
    o(parseKennitala(bogusInput2)).equals(undefined);
  });

  o('Accepts kennitalas with predictable spaces and dashes', () => {
    satisfies(parseKennitala(kt_Person1), dataPerson);
    satisfies(parseKennitala(kt_Person1, { clean: 'careful' }), dataPerson);
    satisfies(parseKennitala(kt_Person1_EnDash), dataPerson);
    satisfies(parseKennitala(kt_Kerfis), dataKerfis);
    satisfies(parseKennitala(kt_Company), dataCompany);
    satisfies(parseKennitala(kt_Company2), dataCompany);
  });

  o('Rejects kennitalas with nonsensical dates', () => {
    o(parseKennitala(ktPersonImpossible)).equals(undefined)('impossible person');
    o(parseKennitala(ktPersonImpossible, { strictDate: true })).equals(undefined)(
      'impossible person'
    );
    o(!!parseKennitala(ktPersonImpossibleSneaky)).equals(true)('false positive person');
    o(parseKennitala(ktPersonImpossibleSneaky, { strictDate: true })).equals(undefined)(
      'strict date parsing person'
    );

    o(parseKennitala(ktCompanyImpossible)).equals(undefined)('impossible company');
    o(parseKennitala(ktCompanyImpossible, { strictDate: true })).equals(undefined)(
      'strictDate impossible company'
    );
    o(!!parseKennitala(ktCompanyImpossibleSneaky)).equals(true)('false positive company');
    o(parseKennitala(ktCompanyImpossibleSneaky, { strictDate: true })).equals(undefined)(
      'strictDate false positive company'
    );

    // strictDate causes no false negatives
    o(!!parseKennitala(ktPerson, { strictDate: true })).equals(true)('strictDate person');
    o(!!parseKennitala(ktCompany, { strictDate: true })).equals(true)(
      'strictDate company'
    );
  });

  o('Optionally rejects Kerfiskennitalas', () => {
    o(parseKennitala(ktKerfis, { rejectTemporary: true })).equals(undefined);
  });

  o('Optionally distinguishes between persons and companies', () => {
    satisfies(parseKennitala(ktPerson, { type: 'person' }), dataPerson);
    satisfies(parseKennitala(ktKerfis, { type: 'person' }), dataKerfis);
    o(parseKennitala(ktCompany, { type: 'person' })).equals(undefined);
    o(parseKennitala(ktPerson, { type: 'company' })).equals(undefined);
    o(parseKennitala(ktKerfis, { type: 'company' })).equals(undefined);
    satisfies(parseKennitala(ktCompany, { type: 'company' }), dataCompany);
  });

  o('Invalid `type` flags are ignored', () => {
    // @ts-expect-error  (testing invalid input)
    const bogusType: KennitalaType = 'foo';
    satisfies(parseKennitala(ktPerson, { type: bogusType }), dataPerson);
    satisfies(parseKennitala(ktCompany, { type: bogusType }), dataCompany);
  });

  o('Optionally allows Gervimaður', () => {
    satisfies(parseKennitala(ktGervi, { robot: true }), dataGervi);
    o(parseKennitala(ktGervi, { robot: false })).equals(undefined);
    // robot flag has no effect on other functions
    satisfies(parseKennitala(ktPerson, { robot: true }), dataPerson);
    satisfies(parseKennitala(ktPerson, { robot: true, type: 'person' }), dataPerson);
    satisfies(parseKennitala(ktKerfis, { robot: true }), dataKerfis);
    o(parseKennitala(ktPerson, { robot: true, type: 'company' })).equals(undefined);
  });
});

// ---------------------------------------------------------------------------

o.spec('isValidKennitala', () => {
  o('Validates simple kennitalas', () => {
    o(isValidKennitala(ktPerson)).equals(true);
    o(isValidKennitala(ktKerfis)).equals(true);
    o(isValidKennitala(ktPersonAncient)).equals(true)('accepts 19th century kennitalas');
    o(isValidKennitala(ktCompany)).equals(true);
    o(isValidKennitala(ktGervi)).equals(false);
    o(isValidKennitala(ktInvalid1)).equals(false);
    o(isValidKennitala(ktInvalid2)).equals(false);
  });

  o('Treats empty (and falsy) input as invalid', () => {
    o(isValidKennitala('')).equals(false);
    // @ts-expect-error  (testing invalid input)
    o(isValidKennitala(undefined)).equals(false);
    // @ts-expect-error  (testing invalid input)
    o(isValidKennitala(false)).equals(false);
  });

  o('Performs no cleanup by default', () => {
    o(isValidKennitala(kt_Person1)).equals(false);
    o(isValidKennitala(kt_Person1_EnDash)).equals(false);
    o(isValidKennitala(kt_Company)).equals(false);
    o(isValidKennitala(kt_Company2)).equals(false);
  });

  o('Opionally performs careful cleanup', () => {
    o(isValidKennitala(kt_Person1, { clean: 'careful' })).equals(true);
    o(isValidKennitala(kt_Person1_EnDash, { clean: 'careful' })).equals(true);
    o(isValidKennitala(kt_Company, { clean: 'careful' })).equals(true);
    o(isValidKennitala(kt_Company2, { clean: 'careful' })).equals(true);
  });

  o('Accepts malformed kennitals with aggressive clean option', () => {
    o(isValidKennitala(kt_Malformed1)).equals(false);
    o(isValidKennitala(kt_Malformed1, { clean: 'aggressive' })).equals(true);
    o(isValidKennitala(`(kt. ${kt_Person1})`, { clean: 'aggressive' })).equals(true);
    o(isValidKennitala(`(kt. ${kt_Person1} blöö)`, { clean: 'aggressive' })).equals(true);
    o(
      isValidKennitala(`(kt. ${kt_Person1}${kt_Person1})`, {
        clean: 'aggressive',
      })
    ).equals(false);
    o(
      isValidKennitala(`(kt. ${kt_Person1} - s. 765 4321)`, {
        clean: 'aggressive',
      })
    ).equals(false);
    o(isValidKennitala(kt_Malformed2_EmDash, { clean: 'aggressive' })).equals(false)(
      'em-dash is not accepted'
    );
  });

  o('Optionally rejects Kerfiskennitalas', () => {
    o(isValidKennitala(ktKerfis, { rejectTemporary: true })).equals(false);
  });

  o('Optionally distinguishes between persons and companies', () => {
    o(isValidKennitala(ktPerson, { type: 'person' })).equals(true);
    o(isValidKennitala(ktKerfis, { type: 'person' })).equals(true);
    o(isValidKennitala(ktCompany, { type: 'person' })).equals(false);
    o(isValidKennitala(ktPerson, { type: 'company' })).equals(false);
    o(isValidKennitala(ktKerfis, { type: 'company' })).equals(false);
    o(isValidKennitala(ktCompany, { type: 'company' })).equals(true);
  });

  o('Invalid `type` flags are ignored', () => {
    // @ts-expect-error  (testing invalid input)
    const bogusType: KennitalaType = 'foo';
    o(isValidKennitala(ktPerson, { type: bogusType })).equals(true);
    o(isValidKennitala(ktCompany, { type: bogusType })).equals(true);
  });

  o('Optionally allows Gervimaður', () => {
    o(isValidKennitala(ktGervi, { robot: true })).equals(true);
    o(isValidKennitala(ktGervi, { robot: false })).equals(false);
    // robot flag has no effect on other functions
    o(isValidKennitala(ktPerson, { robot: true })).equals(true);
    o(isValidKennitala(ktPerson, { robot: true, type: 'person' })).equals(true);
    o(isValidKennitala(ktPerson, { robot: true, type: 'company' })).equals(false);
  });
});

// ---------------------------------------------------------------------------

o.spec('isPersonKennitala, isCompanyKennitala, isTemporaryKennitala', () => {
  o('Correctly detects type of valid Kennitalas', () => {
    o(isPersonKennitala(ktPerson as Kennitala)).equals(true)('person is person');
    o(isPersonKennitala(ktCompany as Kennitala)).equals(false)('company is not person');
    o(isPersonKennitala(ktKerfis as Kennitala)).equals(true)('kerfis is person');
    o(isCompanyKennitala(ktCompany as Kennitala)).equals(true)('company is company');
    o(isCompanyKennitala(ktPerson as Kennitala)).equals(false)('person is not company');
    o(isCompanyKennitala(ktKerfis as Kennitala)).equals(false)('kerfis is not company');
    o(isTempKennitala(ktCompany as Kennitala)).equals(false)('company is not kerfis');
    o(isTempKennitala(ktPerson as Kennitala)).equals(false)('person is not kerfis');
    o(isTempKennitala(ktKerfis as Kennitala)).equals(true)('kerfis is kerfis');
  });

  o('Performs no trimming/parsing/validation on invalid strings', () => {
    // @ts-expect-error  (testing invalid input)
    const startsWith2: Kennitala = '2foobar';
    // @ts-expect-error  (testing invalid input)
    const startsWith5: Kennitala = '5foobar';
    // @ts-expect-error  (testing invalid input)
    const startsWith8: Kennitala = '8foobar';
    // @ts-expect-error  (testing invalid input)
    const someWord: Kennitala = 'foobar';
    // @ts-expect-error  (testing invalid input)
    const spacedKtPerson: Kennitala = ' ' + ktPerson;
    // @ts-expect-error  (testing invalid input)
    const spacedKtCompany: Kennitala = ' ' + ktCompany;
    // @ts-expect-error  (testing invalid input)
    const spacedKtKerfis: Kennitala = ' ' + ktKerfis;

    o(isPersonKennitala(startsWith2)).equals(true)('isPerson `startsWith2`');
    o(isPersonKennitala(startsWith5)).equals(false)('isPerson `startsWith5`');
    o(isPersonKennitala(someWord)).equals(false)('isPerson `someWord`');
    o(isPersonKennitala(spacedKtPerson)).equals(false)('isPerson `spacedKtPerson`');

    o(isCompanyKennitala(startsWith5)).equals(true)('isCompany `startsWith5`');
    o(isCompanyKennitala(startsWith2)).equals(false)('isCompany `startsWith2`');
    o(isCompanyKennitala(someWord)).equals(false)('isCompany `someWord`');
    o(isCompanyKennitala(spacedKtCompany)).equals(false)('isCompany `spacedKtPerson`');

    o(isTempKennitala(startsWith8)).equals(true)('isTemp `startsWith8`');
    o(isTempKennitala(spacedKtKerfis)).equals(false)('isTemp `spacedKtKerfis`');
  });

  if (false as boolean) {
    const ktTest = '' as Kennitala;
    if (isPersonKennitala(ktTest)) {
      type v = Expect<Equals<typeof ktTest, KennitalaPerson>>;
    }
    if (isCompanyKennitala(ktTest)) {
      type v = Expect<Equals<typeof ktTest, KennitalaCompany>>;
    }
  }
});

// ---------------------------------------------------------------------------

o.spec('cleanKennitalaCareful', () => {
  o('carefully cleans input', () => {
    o(cleanKennitalaCareful(' 123456-7890')).equals('1234567890');
    o(cleanKennitalaCareful('123456 7890 ')).equals('1234567890');
    o(cleanKennitalaCareful(' 123456 - 7890')).equals('1234567890');
    o(cleanKennitalaCareful('123456 -7890')).equals('1234567890');
    // Too much internal spacing
    o(cleanKennitalaCareful(kt_Malformed3)).equals(kt_Malformed3);
    // trims only
    o(cleanKennitalaCareful(' abc ')).equals('abc');
    o(cleanKennitalaCareful('kt. 123456-7890')).equals('kt. 123456-7890');
    o(cleanKennitalaCareful(' 1234-567890')).equals('1234-567890');
    o(cleanKennitalaCareful('123 456-7890')).equals('123 456-7890');
    o(cleanKennitalaCareful(kt_Malformed2_EmDash)).equals(kt_Malformed2_EmDash);
  });
});

// ---------------------------------------------------------------------------

o.spec('cleanKennitalaAggressive', () => {
  o('aggressively cleans input', () => {
    o(cleanKennitalaAggressive(' 123456-7890')).equals('1234567890');
    o(cleanKennitalaAggressive('123456 7890 ')).equals('1234567890');
    o(cleanKennitalaAggressive(' 123456 - 7890')).equals('1234567890');
    o(cleanKennitalaAggressive('123456 -7890')).equals('1234567890');

    o(cleanKennitalaAggressive(' 12 34 56 - 78 90')).equals('1234567890');
    o(cleanKennitalaAggressive('1-2-3 4-5 6-7-8 9-0')).equals('1234567890');

    o(cleanKennitalaAggressive('(kt. 123456-7890)')).equals('1234567890');
    o(cleanKennitalaAggressive('(s. 765 4321) ')).equals('7654321')(
      'does not check for length'
    );
    o(cleanKennitalaAggressive('(kt. 123456-7890, s. 765 4321) ')).equals(
      '1234567890,s.7654321'
    )('does not clean non-digits in the middle of the string');
    o(cleanKennitalaAggressive(kt_Malformed2_EmDash)).equals(kt_Malformed2_EmDash)(
      'em-dashes are not accepted'
    );
  });
});

// ---------------------------------------------------------------------------

o.spec('formatKennitala', () => {
  o('formats a kennitala', () => {
    o(formatKennitala('101275-5239 ')).equals('101275-5239');
    o(formatKennitala('1012755239')).equals('101275-5239');
    o(formatKennitala(' 5001012880 ')).equals('500101-2880');
    o(formatKennitala('500101 - 2880')).equals('500101-2880');
    o(formatKennitala(' 010130 7789')).equals('010130-7789');
    o(formatKennitala(kt_Malformed1)).equals(kt_Malformed1);
    o(formatKennitala(kt_Malformed2)).equals(kt_Malformed2);
    o(formatKennitala(kt_Malformed2_EmDash)).equals(kt_Malformed2_EmDash);
  });
  o('accepts a custom separator', () => {
    o(formatKennitala('1012755239', '–')).equals('101275–5239');
    o(formatKennitala('1012755239', ' ')).equals('101275 5239');
  });
});

// ---------------------------------------------------------------------------

o.spec('getKennitalaBirthDate', () => {
  o('Exposes a birthdate function', () => {
    const p1BDay = getKennitalaBirthDate(ktPerson);
    o(p1BDay?.toISOString().substring(0, 10)).equals('1975-12-10');
    const pABDay = getKennitalaBirthDate(ktPersonAncient);
    o(pABDay?.toISOString().substring(0, 10)).equals('1875-12-10');
    const p2BDay = getKennitalaBirthDate(kt_Person1);
    o(p2BDay?.toISOString().substring(0, 10)).equals('1975-12-10');
    const cBDay = getKennitalaBirthDate(kt_Company);
    o(cBDay?.toISOString().substring(0, 10)).equals('2001-01-10');
    const iBDay = getKennitalaBirthDate(ktInvalid1);
    o(iBDay?.toISOString().substring(0, 10)).equals('2065-12-12')(
      'Kennitalas are not validated'
    );
    const i2BDay = getKennitalaBirthDate(kt_Malformed1);
    o(i2BDay).equals(undefined)('Malformed digit-strings return undefined');
    const i3BDay = getKennitalaBirthDate('bogus');
    o(i3BDay).equals(undefined)('Bogus strings return undefined');
    const tBDay = getKennitalaBirthDate(ktKerfis);
    o(tBDay).equals(undefined)('Kerfiskenntala has no birthdate');
    const n1BDay = getKennitalaBirthDate(ktPersonImpossible);
    o(n1BDay).equals(undefined)('Impossible dates are rejected');
    const n2BDay = getKennitalaBirthDate(ktPersonImpossibleSneaky);
    o(n2BDay).equals(undefined)('Subtly impossible dates are rejected');
  });
});

// ---------------------------------------------------------------------------

// test generateKennitala
o.spec('generateKennitala', () => {
  o('generates a valid kennitala', () => {
    const ktPers: KennitalaPerson = generateKennitala();
    o(isValidKennitala(ktPers, { type: 'person', rejectTemporary: true })).equals(true)(
      'basic person'
    );
    o(ktPers !== generateKennitala()).equals(true)(
      'generates a different kennitala each time'
    );
    const ktComp: KennitalaCompany = generateKennitala({ type: 'company' });
    o(isValidKennitala(ktComp, { type: 'company' })).equals(true)('company');
    const ktRobot: KennitalaPerson = generateKennitala({ robot: true });
    o(parseKennitala(ktRobot, { robot: true }).robot).equals(true)('robot');
    o(
      ktRobot !== generateKennitala({ robot: true }) ||
        ktRobot !== generateKennitala({ robot: true })
    ).equals(true)('generates a different robot each time');
    const ktTemp: KennitalaTemporary = generateKennitala({ temporary: true });
    o(parseKennitala(ktTemp)?.temporary).equals(true)('temporary');
  });

  o('opts.type overrides other flags', () => {
    type CompOpts = Parameters<typeof generateKennitala>[0] & { type: 'company' };

    const conflictingOpts1: CompOpts = {
      type: 'company',
      // @ts-expect-error  (Testing invalid input)
      robot: true,
    };
    const ktComp1: KennitalaCompany = generateKennitala(conflictingOpts1);
    o(isValidKennitala(ktComp1, { type: 'company' })).equals(true)('not a robot');

    const conflictingOpts2: CompOpts = {
      type: 'company',
      // @ts-expect-error  (Testing invalid input)
      temporary: true,
    };
    const ktComp2: KennitalaCompany = generateKennitala(conflictingOpts2);
    o(isValidKennitala(ktComp2, { type: 'company' })).equals(true)('not temporary');
  });

  o('accepts a custom birthdate', () => {
    const kt1: KennitalaPerson = generateKennitala({ birthDate: new Date('2001-07-10') });
    o(kt1.slice(0, 6) + '___' + kt1.slice(-1)).equals('100701___0');
    const kt2: KennitalaPerson = generateKennitala({ birthDate: new Date('1870-02-23') });
    o(kt2.slice(0, 6) + '___' + kt2.slice(-1)).equals('230270___8');
    const kt3: KennitalaCompany = generateKennitala({
      birthDate: new Date('1999-02-23'),
      type: 'company',
    });
    o(kt3.slice(0, 6) + '___' + kt3.slice(-1)).equals('630299___9');
  });

  o('ignores birthdates for robots and temps', () => {
    const kt1: KennitalaPerson = generateKennitala({
      birthDate: new Date('2001-07-10'),
      robot: true,
    });
    o(kt1.slice(0, 6) + '___' + kt1.slice(-1)).equals('010130___9');
    const kt2: KennitalaTemporary = generateKennitala({
      birthDate: new Date('2001-07-10'),
      temporary: true,
    });
    o(/^[89]/.test(kt2)).equals(true);
  });

  o('ignores invalid birthDates', () => {
    const birthDate = new Date('bogus');
    o(isValidKennitala(generateKennitala({ birthDate }))).equals(true);
  });

  o('ignores far-future birthDates as invalid', () => {
    const kt1 = generateKennitala({ birthDate: new Date('2100-01-01') });
    o(kt1.slice(0, 6) + '___' + kt1.slice(-1)).notEquals('010100___1');
    const kt2 = generateKennitala({ birthDate: new Date('1799-12-31') });
    o(kt2.slice(0, 6) + '___' + kt2.slice(-1)).notEquals('311299___8');
  });
});

// ---------------------------------------------------------------------------
// Testing exports

/* eslint-disable @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports-ts, import/first, simple-import-sort/imports */
import * as kennitalaModule from './kennitala';

if (false as boolean) {
  const expectedExports: Record<keyof typeof kennitalaModule, true> = {
    parseKennitala: true,
    isValidKennitala: true,

    isCompanyKennitala: true,
    isPersonKennitala: true,
    isTempKennitala: true,

    cleanKennitalaCareful: true,
    cleanKennitalaAggressive: true,

    formatKennitala: true,
    getKennitalaBirthDate: true,

    generateKennitala: true,
  };
}
import type {
  Kennitala as T1,
  KennitalaData as T2,
  KennitalaType as T3,
  KennitalaPerson as T4,
  KennitalaCompany as T5,
  KennitalaTemporary as T6,
  KennitalaDataPerson as T7,
  KennitalaDataCompany as T8,
} from './kennitala';
/* eslint-enable */

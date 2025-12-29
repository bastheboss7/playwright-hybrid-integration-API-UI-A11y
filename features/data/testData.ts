// Centralized, typed test data kept in code so specs stay clean and stable.
// We intentionally avoid .env here to keep test inputs deterministic and
// source-controlled. If you need environment-specific data, create a separate
// profile file or inject via fixtures instead of .env.
export interface TestData {
  fromPostcode: string;
  toPostcode: string;
  weight: string;
}

export const testData: TestData = {
  fromPostcode: 'BD2 3FG',
  toPostcode: 'LS2 7EP',
  weight: '1kg - 2kg',
};

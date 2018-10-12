export const noCoverage = {
  duration: 1,
  numFailedTests: 2,
  numFailedTestSuites: 3,
  numPassedTests: 4,
  numPassedTestSuites: 5,
  numTotalTests: 6,
  numTotalTestSuites: 7,
  startTime: 8
}

export const noCoverageMinified = {
  d: 1,
  f: 2,
  fs: 3,
  p: 4,
  ps: 5,
  t: 6,
  ts: 7,
  s: 8
}

export const coverageNoPercentage = {
  duration: 1,
  numFailedTests: 2,
  numFailedTestSuites: 3,
  numPassedTests: 4,
  numPassedTestSuites: 5,
  numTotalTests: 6,
  numTotalTestSuites: 7,
  startTime: 8,
  coverage: {
    branches: { covered: 0, skipped: 1, total: 2 },
    functions: { covered: 3, skipped: 4, total: 5 },
    lines: { covered: 6, skipped: 7, total: 8 },
    statements: { covered: 9, skipped: 10, total: 11 }
  }
}
export const coverageNoPercentageMinified = {
  d: 1,
  f: 2,
  fs: 3,
  p: 4,
  ps: 5,
  t: 6,
  ts: 7,
  s: 8,
  c: {
    b: { c: 0, s: 1, t: 2 },
    f: { c: 3, s: 4, t: 5 },
    l: { c: 6, s: 7, t: 8 },
    s: { c: 9, s: 10, t: 11 }
  }
}
export const coverageWithPercentage = {
  duration: 1,
  numFailedTests: 2,
  numFailedTestSuites: 3,
  numPassedTests: 4,
  numPassedTestSuites: 5,
  numTotalTests: 6,
  numTotalTestSuites: 7,
  startTime: 8,
  coverage: {
    branches: { covered: 0, skipped: 1, total: 2, pct: 0.1 },
    functions: { covered: 3, skipped: 4, total: 5, pct: 0.2 },
    lines: { covered: 6, skipped: 7, total: 8, pct: 0.3 },
    statements: { covered: 9, skipped: 10, total: 11, pct: 0.4 }
  }
}
export const coverageWithPercentageMinified = {
  d: 1,
  f: 2,
  fs: 3,
  p: 4,
  ps: 5,
  t: 6,
  ts: 7,
  s: 8,
  c: {
    b: { c: 0, s: 1, t: 2, p: 0.1 },
    f: { c: 3, s: 4, t: 5, p: 0.2 },
    l: { c: 6, s: 7, t: 8, p: 0.3 },
    s: { c: 9, s: 10, t: 11, p: 0.4 }
  }
}

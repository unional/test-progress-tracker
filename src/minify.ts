import { TestResults, CoverageSummary } from './interface';

export interface MinifiedTestResult {
  d: number,
  f: number,
  fs: number,
  p: number,
  ps: number,
  t: number,
  ts: number,
  s: number,
  c?: MinifiedCoverageSummary
}
export interface MinifiedCoverageSummary {
  b: { c: number, s: number, t: number, p?: number }
  f: { c: number, s: number, t: number, p?: number }
  l: { c: number, s: number, t: number, p?: number }
  s: { c: number, s: number, t: number, p?: number }
}

export function minify(testResults: TestResults) {
  const { duration, numFailedTests, numFailedTestSuites, numPassedTests, numPassedTestSuites, numTotalTests, numTotalTestSuites, startTime, coverage } = testResults

  const result: MinifiedTestResult = {
    d: duration,
    f: numFailedTests,
    fs: numFailedTestSuites,
    p: numPassedTests,
    ps: numPassedTestSuites,
    t: numTotalTests,
    ts: numTotalTestSuites,
    s: startTime
  }
  if (coverage) {
    result.c = minifyCoverage(coverage)
  }
  return result
}

function minifyCoverage(coverage: jest.CoverageSummary) {
  const { branches, functions, lines, statements } = coverage

  const result: MinifiedCoverageSummary = {
    b: { c: branches.covered, s: branches.skipped, t: branches.total },
    f: { c: functions.covered, s: functions.skipped, t: functions.total },
    l: { c: lines.covered, s: lines.skipped, t: lines.total },
    s: { c: statements.covered, s: statements.skipped, t: statements.total }
  }

  if (branches.pct) result.b.p = branches.pct
  if (functions.pct) result.f.p = functions.pct
  if (lines.pct) result.l.p = lines.pct
  if (statements.pct) result.s.p = statements.pct
  return result
}

export function unminify(minified: MinifiedTestResult) {
  const result: TestResults = {
    duration: minified.d,
    numFailedTests: minified.f,
    numFailedTestSuites: minified.fs,
    numPassedTests: minified.p,
    numPassedTestSuites: minified.ps,
    numTotalTests: minified.t,
    numTotalTestSuites: minified.ts,
    startTime: minified.s
  }
  if (minified.c) {
    result.coverage = unminifyCoverage(minified.c)
  }
  return result
}

function unminifyCoverage(c: MinifiedCoverageSummary) {
  const result: CoverageSummary = {
    branches: { covered: c.b.c, skipped: c.b.s, total: c.b.t },
    functions: { covered: c.f.c, skipped: c.f.s, total: c.f.t },
    lines: { covered: c.l.c, skipped: c.l.s, total: c.l.t },
    statements: { covered: c.s.c, skipped: c.s.s, total: c.s.t }
  }

  if (c.b.p !== undefined) result.branches.pct = c.b.p
  if (c.f.p !== undefined) result.functions.pct = c.f.p
  if (c.l.p !== undefined) result.lines.pct = c.l.p
  if (c.s.p !== undefined) result.statements.pct = c.s.p
  return result
}

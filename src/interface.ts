import fs from 'fs';

export interface FSContext<FSKeys extends keyof typeof fs> {
  fs: Pick<typeof fs, FSKeys>,
  /**
   * Root directory (of the project).
   */
  rootDir: string
}

export interface TestResults {
  startTime: number,
  duration: number,
  numFailedTests: number,
  numFailedTestSuites: number,
  numPassedTests: number,
  numPassedTestSuites: number,
  numTotalTests: number,
  numTotalTestSuites: number,
  filtered?: boolean,
  coverage?: CoverageSummary
}

export interface FileCoverageTotal {
  total: number,
  covered: number,
  skipped: number,
  pct?: number;
}

export interface CoverageSummary {
  lines: FileCoverageTotal,
  statements: FileCoverageTotal,
  branches: FileCoverageTotal,
  functions: FileCoverageTotal;
}

import fs from 'fs';

export interface Context {
  fs: typeof fs
}

export interface TestResults {
  startTime: number;
  duration: number;
  numFailedTests: number;
  numFailedTestSuites: number;
  numPassedTests: number;
  numPassedTestSuites: number;
  numTotalTests: number;
  numTotalTestSuites: number;
  coverage?: CoverageSummary
}

export interface FileCoverageTotal {
  total: number;
  covered: number;
  skipped: number;
  pct?: number;
}

export interface CoverageSummary {
  lines: FileCoverageTotal;
  statements: FileCoverageTotal;
  branches: FileCoverageTotal;
  functions: FileCoverageTotal;
}

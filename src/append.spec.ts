import rimraf from 'rimraf';
import { append } from './append';
import { ROOT } from './constants';
import { initInternal } from './initInternal';
import { load } from './load';
import { coverageNoPercentage, noCoverage } from './testResultsExamples';

test('create new file', () => {
  const rootDir = '.new_file'

  try {
    initInternal({ rootDir })
    append(undefined, noCoverage)

    const entries = load(undefined)
    expect(entries.length).toBe(1)
  }
  finally {
    initInternal({ rootDir: ROOT })
    rimraf.sync(rootDir)
  }
})

test('append to file', () => {
  const rootDir = '.append_file'

  try {
    initInternal({ rootDir })
    append(undefined, noCoverage)
    append(undefined, noCoverage)

    const entries = load(undefined)
    expect(entries.length).toBe(2)
  }
  finally {
    initInternal({ rootDir: ROOT })
    rimraf.sync(rootDir)
  }
})

test('context can be undefined', () => {
  append(undefined, coverageNoPercentage)
})

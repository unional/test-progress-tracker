import rimraf from 'rimraf';
import { append } from './append';
import { init } from './init';
import { load } from './load';
import { coverageNoPercentage, noCoverage } from './testResultsExamples';
import { ROOT } from './constants';

test('create new file', () => {
  const rootDir = '.new_file'

  try {
    init({ rootDir })
    append(undefined, noCoverage)

    const entries = load(undefined)
    expect(entries.length).toBe(1)
  }
  finally {
    init({ rootDir: ROOT })
    rimraf.sync(rootDir)
  }
})

test('append to file', () => {
  const rootDir = '.append_file'

  try {
    init({ rootDir })
    append(undefined, noCoverage)
    append(undefined, noCoverage)

    const entries = load(undefined)
    expect(entries.length).toBe(2)
  }
  finally {
    init({ rootDir: ROOT })
    rimraf.sync(rootDir)
  }
})

test('context can be undefined', () => {
  append(undefined, coverageNoPercentage)
})

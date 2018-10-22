import rimraf from 'rimraf';
import { append } from './append';
import { ROOT } from './constants';
import { initInternal } from './initInternal';
import { load } from './load';
import { coverageNoPercentage, noCoverage } from './testResultsExamples';

test('create new file', async () => {
  const rootDir = '.new_file'

  try {
    initInternal({ rootDir })
    await append(undefined, noCoverage)

    const entries = await load(undefined)
    expect(entries.length).toBe(1)
  }
  finally {
    initInternal({ rootDir: ROOT })
    rimraf.sync(rootDir)
  }
})

test('append to file', async () => {
  const rootDir = '.append_file'

  try {
    initInternal({ rootDir })
    await append(undefined, noCoverage)
    await append(undefined, noCoverage)

    const entries = await load(undefined)
    expect(entries.length).toBe(2)
  }
  finally {
    initInternal({ rootDir: ROOT })
    rimraf.sync(rootDir)
  }
})

test('context can be undefined', async () => {
  await append(undefined, coverageNoPercentage)
})

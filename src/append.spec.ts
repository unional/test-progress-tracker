import rimraf from 'rimraf';
import { ROOT } from './constants';
import { init, append, load } from '.';
import { coverageNoPercentage, noCoverage } from './testResultsExamples';

test('create new file', async () => {
  const rootDir = '.new_file'

  try {
    init({ rootDir })
    await append(undefined, noCoverage)

    const entries = await load(undefined)
    expect(entries.length).toBe(1)
  }
  finally {
    init({ rootDir: ROOT })
    rimraf.sync(rootDir)
  }
})

test('append to file', async () => {
  const rootDir = '.append_file'

  try {
    init({ rootDir })
    await append(undefined, noCoverage)
    await append(undefined, noCoverage)

    const entries = await load(undefined)
    expect(entries.length).toBe(2)
  }
  finally {
    init({ rootDir: ROOT })
    rimraf.sync(rootDir)
  }
})

test('context can be undefined', async () => {
  await append(undefined, coverageNoPercentage)
})

import rimraf from 'rimraf';
import { append, init, load } from '.';
import { noCoverage } from './testResultsExamples';

test('create new file', async () => {
  const rootDir = 'fixtures/new_file'

  try {
    init({ rootDir })
    await append(undefined, noCoverage)

    const entries = await load(undefined)
    expect(entries.length).toBe(1)
  }
  finally {
    init()
    rimraf.sync(rootDir)
  }
})

test('append to file', async () => {
  const rootDir = 'fixtures/append_file'

  try {
    init({ rootDir })
    await append(undefined, noCoverage)
    await append(undefined, noCoverage)

    const entries = await load(undefined)
    expect(entries.length).toBe(2)
  }
  finally {
    init()
    rimraf.sync(rootDir)
  }
})

import fs from 'fs';
import rimraf from 'rimraf';
import { append } from './append';
import { load } from './load';
import { setup } from './setup';
import { noCoverage } from './testResultsExamples';

test('create new file', () => {
  const rootDir = '.new_file'
  setup({ rootDir })

  try {
    append({ fs, rootDir }, noCoverage)

    const entries = load({ fs, rootDir })
    expect(entries.length).toBe(1)
  }
  finally {
    rimraf.sync(rootDir)
  }
})

test('append to file', () => {
  const rootDir = '.append_file'
  setup({ rootDir })

  try {
    append({ fs, rootDir }, noCoverage)
    append({ fs, rootDir }, noCoverage)

    const entries = load({ fs, rootDir })
    expect(entries.length).toBe(2)
  }
  finally {
    rimraf.sync(rootDir)
  }
})

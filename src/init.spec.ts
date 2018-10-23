import t from 'assert';
import fs from 'fs';
import { init } from './init';
import { PROGRESS_FOLDER } from './constants';
import rimraf = require('rimraf');

test('create folder if not exist', () => {
  try {
    t.strictEqual(fs.existsSync('fixtures/create-if-not-exist'), false)
    init({ rootDir: 'fixtures/create-if-not-exist' })
  }
  finally {
    rimraf.sync('fixtures/create-if-not-exist')
  }
})

test('ok if folder already existed', () => {
  try {
    fs.mkdirSync('fixtures/exist')
    init({ rootDir: 'fixtures/exist' })
  }
  finally {
    rimraf.sync('fixtures/exist')
  }
})

test('by default init will create .progress', () => {
  init()
  t.strictEqual(fs.existsSync(PROGRESS_FOLDER), true)
})

import t from 'assert'
import fs from 'fs'
import rimraf from 'rimraf'
import { init } from '.'
import { PROGRESS_FOLDER } from './constants'

test('create folder if not exist', () => {
  try {
    t.strictEqual(fs.existsSync('fixtures/init/create-if-not-exist'), false)
    init({ rootDir: 'fixtures/init/create-if-not-exist' })
  }
  finally {
    rimraf.sync('fixtures/init/create-if-not-exist')
  }
})

test('ok if folder already existed', () => {
  try {
    fs.mkdirSync('fixtures/init/exist')
    init({ rootDir: 'fixtures/init/exist' })
  }
  finally {
    rimraf.sync('fixtures/init/exist')
  }
})

test('by default init will create .progress', () => {
  init()
  t.strictEqual(fs.existsSync(PROGRESS_FOLDER), true)
})

import t from 'assert';
import fs from 'fs';
import { init } from './init';
import { initInternal } from './initInternal';

test('create folder if not exist', () => {
  t.strictEqual(fs.existsSync('.x'), false)
  initInternal({ rootDir: '.x' })
  fs.rmdirSync('.x')
})

test('ok if folder already existed', () => {
  fs.mkdirSync('.exist')
  initInternal({ rootDir: '.exist' })
  fs.rmdirSync('.exist')
})

test('by default init will create .progress', () => {
  init()
  t.strictEqual(fs.existsSync('.progress'), true)
})

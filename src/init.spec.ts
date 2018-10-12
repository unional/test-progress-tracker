import t from 'assert';
import fs from 'fs';
import { init } from './init';

test('create folder if not exist', () => {
  t.strictEqual(fs.existsSync('.x'), false)
  init({ rootDir: '.x' })
  fs.rmdirSync('.x')
})

test('ok if folder already existed', () => {
  fs.mkdirSync('.exist')
  init({ rootDir: '.exist' })
  fs.rmdirSync('.exist')
})

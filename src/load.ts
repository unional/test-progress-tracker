import { decompress } from './compress';
import { Context, TestResults } from './interface';
import { unminify } from './minify';
import path from 'path'
import { TEST_RESULT_FILENAME, ROOT } from './constants';
import fs from 'fs'
import { unpartial } from 'unpartial'

export function load(context?: Partial<Context>) {
  const c = unpartial({ fs, rootDir: ROOT }, context)
  const filepath = path.join(c.rootDir, TEST_RESULT_FILENAME)
  const content = c.fs.readFileSync(filepath, 'utf-8')
  const entries = content.split('\n')
  return entries.reduce<TestResults[]>((r, e) => {
    if (!e) return r
    const minified = decompress(e)
    r.push(unminify(minified))
    return r
  }, [])
}

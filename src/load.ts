import fs from 'fs';
import path from 'path';
import { unpartial } from 'unpartial';
import { decompress } from './compress';
import { TEST_RESULT_FILENAME } from './constants';
import { Context, TestResults } from './interface';
import { unminify } from './minify';
import { store } from './store';

export function load(context?: Partial<Context>) {
  const c = unpartial({ fs }, context)
  const filepath = path.join(store.get().rootDir, TEST_RESULT_FILENAME)
  if (!c.fs.existsSync(filepath)) {
    return []
  }

  const content = c.fs.readFileSync(filepath, 'utf-8')
  const entries = content.split('\n')
  return entries.reduce<TestResults[]>((r, e) => {
    if (!e) return r
    const minified = decompress(e)
    r.push(unminify(minified))
    return r
  }, [])
}

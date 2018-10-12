import fs from 'fs';
import path from 'path';
import { unpartial } from 'unpartial';
import { compress } from './compress';
import { TEST_RESULT_FILENAME } from './constants';
import { Context, TestResults } from './interface';
import { minify } from './minify';
import { store } from './store';

export function append(context: Partial<Context> | undefined, results: TestResults) {
  const c = unpartial({ fs }, context)

  const minified = minify(results)
  const compressed = compress(minified)
  const filepath = path.join(store.get().rootDir, TEST_RESULT_FILENAME)
  c.fs.appendFileSync(filepath, compressed + '\n')
}

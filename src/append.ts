import fs from 'fs';
import path from 'path';
import { compress } from './compress';
import { ROOT, TEST_RESULT_FILENAME } from './constants';
import { Context, TestResults } from './interface';
import { minify } from './minify';
import { unpartial } from 'unpartial';

export function append(context: Partial<Context> | undefined, results: TestResults) {
  const c = unpartial({ fs, rootDir: ROOT }, context)
  const minified = minify(results)
  const compressed = compress(minified)

  const filepath = path.join(c.rootDir, TEST_RESULT_FILENAME)
  c.fs.appendFileSync(filepath, compressed + '\n')
}

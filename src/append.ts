import fs from 'fs';
import path from 'path';
import { unpartial } from 'unpartial';
import { compress } from './compress';
import { ROOT, TEST_RESULT_FILENAME } from './constants';
import { Context, TestResults } from './interface';
import { minify } from './minify';
import { setup } from './setup';

export function append(context: Partial<Context> | undefined, results: TestResults) {
  const c = unpartial({ fs, rootDir: ROOT }, context)
  if (c.rootDir !== ROOT) {
    setup({ rootDir: c.rootDir })
  }

  const minified = minify(results)
  const compressed = compress(minified)

  const filepath = path.join(c.rootDir, TEST_RESULT_FILENAME)
  c.fs.appendFileSync(filepath, compressed + '\n')
}

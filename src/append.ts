import fs from 'fs';
import path from 'path';
import { unpartial } from 'unpartial';
import { promisify } from 'util';
import { compress } from './compress';
import { TEST_RESULT_FILENAME } from './constants';
import { TestResults, FSContext } from './interface';
import { minify } from './minify';
import { store } from './store';
import delay from 'delay';

let appendFile = fs.appendFile
let promisifedAppendFile = promisify(fs.appendFile)


export async function append(context: Partial<FSContext<'appendFile'>> | undefined, results: TestResults) {
  const c = unpartial<FSContext<'appendFile'>>({ fs, filepath: path.join(store.get().rootDir, TEST_RESULT_FILENAME) }, context)

  const minified = minify(results)
  const compressed = compress(minified)

  // istanbul ignore next
  if (c.fs.appendFile !== appendFile) {
    appendFile = c.fs.appendFile
    promisifedAppendFile = promisify(appendFile)
  }

  await promisifedAppendFile(c.filepath, compressed + '\n')
  // There seems to be some concurrency issue when two appends are executed next to each other.
  // This causes the `monitor()` test sometimes get stucked.
  // While this should not happen in live code,
  // place a small delay just in case.
  await delay(10)
}

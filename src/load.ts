import fs from 'fs';
import path from 'path';
import { unpartial } from 'unpartial';
import { decompress } from './compress';
import { TEST_RESULT_FILENAME } from './constants';
import { FSContext, TestResults } from './interface';
import { unminify } from './minify';
import { store } from './store';
import { promisify } from 'util';

let readFile = fs.readFile
let promisifiedReadFile = promisify(fs.readFile)

export async function load(context?: Partial<FSContext<'readFile'>>) {
  const c = unpartial<FSContext<'readFile'>>({ fs, filepath: path.join(store.get().rootDir, TEST_RESULT_FILENAME) }, context)

  // istanbul ignore next
  if (c.fs.readFile !== readFile) {
    readFile = c.fs.readFile
    promisifiedReadFile = promisify(readFile)
  }

  try {
    const content = await promisifiedReadFile(c.filepath, 'utf-8')
    const entries = content.split('\n')
    return entries.reduce<TestResults[]>((r, e) => {
      if (!e) return r
      const minified = decompress(e)
      r.push(unminify(minified))
      return r
    }, [])
  }
  catch {
    return []
  }
}

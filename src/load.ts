import { decompress } from './compress';
import { Context, TestResults } from './interface';
import { unminify } from './minify';
import path from 'path'
import { TEST_RESULT_FILENAME } from './constants';

export function load({ fs, rootDir }: Context) {
  const filepath = path.join(rootDir, TEST_RESULT_FILENAME)
  const content = fs.readFileSync(filepath, 'utf-8')
  const entries = content.split('\n')
  return entries.reduce<TestResults[]>((r, e) => {
    if (!e) return r
    const minified = decompress(e)
    r.push(unminify(minified))
    return r
  }, [])
}

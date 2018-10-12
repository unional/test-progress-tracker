import path from 'path'
import { compress } from './compress';
import { Context, TestResults } from './interface';
import { minify } from './minify';
import { TEST_RESULT_FILENAME } from './constants';

export function append({ fs, rootDir }: Context, results: TestResults) {
  const minified = minify(results)
  const compressed = compress(minified)

  const filepath = path.join(rootDir, TEST_RESULT_FILENAME)
  fs.appendFileSync(filepath, compressed + '\n')
}

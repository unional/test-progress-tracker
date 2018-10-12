import t from 'assert'
import { load } from './load';

test('not exist', () => {
  const actual = load({ rootDir: 'not-exist' })
  t.strictEqual(actual.length, 0)
})

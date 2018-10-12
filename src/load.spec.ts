import t from 'assert'
import { load } from './load';
import { store } from './store';

test('not exist', () => {
  store.set({ rootDir: 'not-exist' })
  const actual = load(undefined)
  t.strictEqual(actual.length, 0)
})

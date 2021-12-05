import t from 'assert'
import { load } from '.'
import { store } from './store'

test('not exist', async () => {
  store.value.rootDir = 'fixtures/not-exist'
  const actual = await load(undefined)
  t.strictEqual(actual.length, 0)
})

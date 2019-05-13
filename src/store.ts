import { createStore } from 'global-store'

export const store = createStore(Symbol.for('test-progress-tracker'), { rootDir: '.' })

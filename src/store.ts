import { create } from 'global-store'

export const store = create(Symbol.for('test-progress-tracker'), { rootDir: '.' })

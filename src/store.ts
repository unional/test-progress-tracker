import { create } from 'global-store'
import { ROOT } from './constants';

export const store = create(Symbol.for('test-progress-tracker'), { rootDir: ROOT })

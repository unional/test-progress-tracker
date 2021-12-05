import path from 'path'
import mkdirp from 'mkdirp';
import { PROGRESS_FOLDER } from './constants';
import { store } from './store';

/**
 * Initialize environment.
 * @param options optional options. Mostly for testing purpose.
 */
export function init(options = { rootDir: '.' }) {
  mkdirp.sync(path.join(options.rootDir, PROGRESS_FOLDER))
  store.value.rootDir = options.rootDir
}

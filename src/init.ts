import mkdirp from 'mkdirp';
import { ROOT } from './constants';
import { store } from './store';

/**
 * Initialize environment.
 * @param options optional options. Mostly for testing purpose.
 */
export function init(options = { rootDir: ROOT }) {
  mkdirp.sync(options.rootDir)
  store.set({ rootDir: options.rootDir })
}

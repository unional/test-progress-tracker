import mkdirp from 'mkdirp';
import { ROOT } from './constants';
import { store } from './store';

export function init(context = { rootDir: ROOT }) {
  mkdirp.sync(context.rootDir)
  store.set({ rootDir: context.rootDir })
}

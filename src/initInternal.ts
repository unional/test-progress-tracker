import mkdirp from 'mkdirp';
import { store } from './store';

export function initInternal(config: { rootDir: string }) {
  mkdirp.sync(config.rootDir)
  store.set({ rootDir: config.rootDir })
}

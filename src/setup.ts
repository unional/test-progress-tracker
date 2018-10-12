import mkdirp from 'mkdirp';
import { ROOT } from './constants';

export function setup(context = { rootDir: ROOT }) {
  mkdirp.sync(context.rootDir)
}

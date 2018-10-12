import { ROOT } from './constants';
import { initInternal } from './initInternal';

export function init() {
  initInternal({ rootDir: ROOT })
}

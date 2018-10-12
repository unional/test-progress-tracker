import lz from 'lz-string';
import { MinifiedTestResult } from './minify';

export function compress(obj: MinifiedTestResult) {
  const str = JSON.stringify(obj)
  return lz.compress(str)
}

export function decompress(str: string) {
  const json = lz.decompress(str)
  return JSON.parse(json) as MinifiedTestResult
}

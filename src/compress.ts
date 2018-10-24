// import lz from 'lz-string';
import { MinifiedTestResult } from './minify';

export function compress(obj: MinifiedTestResult) {
  return JSON.stringify(obj)
  // return lz.compress(JSON.stringify(obj))
}

export function decompress(str: string): MinifiedTestResult {
  return JSON.parse(str)
  // const json = lz.decompress(str)
  // return JSON.parse(json) as MinifiedTestResult
}

import { MinifiedTestResult } from './minify';

export function compress(obj: MinifiedTestResult) {
  return JSON.stringify(obj)
}

export function decompress(str: string): MinifiedTestResult {
  return JSON.parse(str) as MinifiedTestResult
}

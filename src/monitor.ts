import chokidar from 'chokidar';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { Stream } from 'stream';
import { unpartial } from 'unpartial';
import { decompress } from './compress';
import { TEST_RESULT_FILENAME } from './constants';
import { TestResults } from './interface';
import { unminify } from './minify';
import { store } from './store';

export interface MonitorContext {
  fs: Pick<typeof fs, 'watch'>,
  filepath: string
  awaitWriteFinish: AwaitWriteFinishOptions | boolean;
}

export interface AwaitWriteFinishOptions {
  /**
   * Amount of time in milliseconds for a file size to remain constant before emitting its event.
   */
  stabilityThreshold?: number;

  /**
   * File size polling interval.
   */
  pollInterval?: number;
}

export interface MonitorSubscription {
  close(): void
}

export function monitor(context: Partial<MonitorContext & GetLastLineContext> | undefined, callback: (err: any, testResults: TestResults) => void): MonitorSubscription {
  const c = unpartial<MonitorContext & GetLastLineContext>({
    fs,
    readline,
    filepath: path.join(store.get().rootDir, TEST_RESULT_FILENAME),
    awaitWriteFinish: true
  }, context)
  const filepath = c.filepath

  if (fs.existsSync(filepath))
    invokeCallback(c, filepath, callback)
  const w = chokidar.watch(filepath, { awaitWriteFinish: c.awaitWriteFinish })
  w.on('all', (event, path) => {
    if (event === 'add' || event === 'change') {
      invokeCallback(c, path, callback)
    }
  })
  return { close: w.close.bind(w) }
}

function invokeCallback(context: GetLastLineContext, filename: string, callback: (err: any, testResults: TestResults) => void) {
  getLastLine(context, filename).then(line => {
    callback(undefined, unminify(decompress(line)))
  }).catch(callback as any)
}

export interface GetLastLineContext {
  fs: Pick<typeof fs, 'createReadStream' | 'WriteStream'>,
  readline: Pick<typeof readline, 'createInterface'>
}

function getLastLine({ fs, readline }: GetLastLineContext, filename: string) {
  const inStream = fs.createReadStream(filename)
  const outStream = new Stream()
  return new Promise<string>((a, r) => {
    const rl = readline.createInterface(inStream, outStream as any)
    let lastline = ''
    rl.on('line', (line: string) => {
      if (line.length) {
        lastline = line
      }
    })
    rl.on('error', r)
    rl.on('close', () => a(lastline))
  })
}
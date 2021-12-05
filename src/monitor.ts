import chokidar from 'chokidar';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { unpartial } from 'unpartial';
import { decompress } from './compress';
import { PROGRESS_FOLDER, TEST_RESULT_FILENAME } from './constants';
import { TestResults } from './interface';
import { unminify } from './minify';
import { store } from './store';

export interface MonitorContext {
  fs: Pick<typeof fs, 'watch'>,
  rootDir: string,
  awaitWriteFinish: AwaitWriteFinishOptions | boolean;
}

export interface AwaitWriteFinishOptions {
  /**
   * Amount of time in milliseconds for a file size to remain constant before emitting its event.
   */
  stabilityThreshold?: number,

  /**
   * File size polling interval.
   */
  pollInterval?: number
}

export interface MonitorSubscription {
  close(): void
}

export function monitor(context: Partial<MonitorContext & GetLastLineContext> | undefined, callback: (err: any, testResults: TestResults) => void): MonitorSubscription {
  const c = unpartial<MonitorContext & GetLastLineContext>({
    fs,
    readline,
    rootDir: store.get().rootDir,
    awaitWriteFinish: true
  }, context)
  const filepath = path.join(c.rootDir, PROGRESS_FOLDER, TEST_RESULT_FILENAME)

  const w = chokidar.watch(filepath, { awaitWriteFinish: c.awaitWriteFinish })
  w.on('add', path => invokeCallback(c, path, callback))
  w.on('change', path => invokeCallback(c, path, callback))
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return { close: w.close.bind(w) }
}

function invokeCallback(context: GetLastLineContext, filename: string, callback: (err: any, testResults: TestResults) => void) {
  getLastLine(context, filename).then(line => {
    callback(undefined, unminify(decompress(line)))
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  }).catch(callback as any)
}

export interface GetLastLineContext {
  fs: Pick<typeof fs, 'createReadStream' | 'WriteStream'>,
  readline: Pick<typeof readline, 'createInterface'>
}

function getLastLine({ fs, readline }: GetLastLineContext, filename: string) {
  const inStream = fs.createReadStream(filename)
  return new Promise<string>((a, r) => {
    const rl = readline.createInterface(inStream)
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

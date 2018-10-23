import t from 'assert';
import { AssertOrder } from 'assertron';
import fs from 'fs';
import path from 'path';
import { append, monitor } from '.';
import { ROOT, TEST_RESULT_FILENAME } from './constants';
import { initInternal } from './initInternal';
import { TestResults } from './interface';
import { MonitorSubscription } from './monitor';
import { store } from './store';
import { filtered, noCoverage } from './testResultsExamples';
import rimraf = require('rimraf');
import delay from 'delay';

test('callback invoked with last save entry initially', async () => {
  const rootDir = 'fixtures/monitor-first'
  const filepath = path.join(rootDir, TEST_RESULT_FILENAME)
  let sub: MonitorSubscription | undefined
  try {
    initInternal({ rootDir })
    await append({ filepath }, filtered)
    await append({ filepath }, noCoverage)

    const actual = await new Promise(a => {
      sub = monitor({ filepath, awaitWriteFinish: { pollInterval: 10, stabilityThreshold: 50 } }, (_, testResults) => a(testResults))
    })


    t.deepStrictEqual(actual!, noCoverage)
  }
  finally {
    if (sub) sub.close()
    initInternal({ rootDir: ROOT })
    rimraf.sync(rootDir)
  }
})

test('extra empty line in the file is ignored', async () => {
  const rootDir = 'fixtures/monitor-extra-empty-line'
  const filepath = path.join(rootDir, TEST_RESULT_FILENAME)
  let sub: MonitorSubscription | undefined
  try {
    initInternal({ rootDir })
    await append({ filepath }, noCoverage)
    fs.appendFileSync(filepath, '\n')

    const actual = await new Promise(a => {
      sub = monitor({ filepath, awaitWriteFinish: { pollInterval: 10, stabilityThreshold: 50 } }, (_, testResults) => a(testResults))
    })


    t.deepStrictEqual(actual!, noCoverage)
  }
  finally {
    if (sub) sub.close()
    initInternal({ rootDir: ROOT })
    rimraf.sync(rootDir)
  }
})

test('callback not invoked when root directory not exist', async () => {
  let sub: MonitorSubscription | undefined
  try {
    store.set({ rootDir: 'fixtures/not-exist' })
    sub = monitor(undefined, () => { throw new Error('should not call') })
  }
  finally {
    if (sub) sub.close()
  }
})

test('callback not invoked when result file not exist', async () => {
  const rootDir = 'fixtures/monitor-no-file'
  const filepath = path.join(rootDir, TEST_RESULT_FILENAME)
  let sub: MonitorSubscription | undefined
  try {
    initInternal({ rootDir })
    sub = monitor({ filepath }, () => { throw new Error('should not call') })
  }
  finally {
    if (sub) sub.close()
    initInternal({ rootDir: ROOT })
    rimraf.sync(rootDir)
  }
})

test('delete result file should not trigger', async () => {
  const rootDir = 'fixtures/monitor-delete'
  const filepath = path.join(rootDir, TEST_RESULT_FILENAME)

  let sub: MonitorSubscription | undefined
  try {
    initInternal({ rootDir })
    await append({ filepath }, noCoverage)

    const o = new AssertOrder()
    sub = monitor({ filepath, awaitWriteFinish: { pollInterval: 10, stabilityThreshold: 50 } }, () => o.once(1))
    const filePath = path.join(rootDir, TEST_RESULT_FILENAME)
    fs.unlinkSync(filePath)
  }
  finally {
    if (sub) sub.close()
    initInternal({ rootDir: ROOT })
    rimraf.sync(rootDir)
  }
})

test('trigger on change', async () => {
  const rootDir = 'fixtures/monitor-change'
  const filepath = path.join(rootDir, TEST_RESULT_FILENAME)
  let sub: MonitorSubscription | undefined
  try {
    initInternal({ rootDir })
    await append({ filepath }, noCoverage)
    const o = new AssertOrder(2)
    sub = monitor({ filepath, awaitWriteFinish: { pollInterval: 10, stabilityThreshold: 50 } }, () => o.any([1, 2]))
    await append({ filepath }, noCoverage)
    o.end()
  }
  finally {
    if (sub) sub.close()
    initInternal({ rootDir: ROOT })
    rimraf.sync(rootDir)
  }
})

test('trigger on new file', async () => {
  const rootDir = 'fixtures/monitor-new'
  const filepath = path.join(rootDir, TEST_RESULT_FILENAME)
  let sub: MonitorSubscription | undefined
  try {
    initInternal({ rootDir })

    const actual = await new Promise<TestResults>(async a => {
      sub = monitor({ filepath, awaitWriteFinish: { pollInterval: 10, stabilityThreshold: 50 } }, (_, testResults) => a(testResults))
      // Add a small delay because in circleci it seems like chokidar can't pick up the next append (new file).
      await delay(10)
      await append({ filepath }, noCoverage)
    })
    t.deepStrictEqual(actual, noCoverage)
  }
  finally {
    if (sub) sub.close()
    initInternal({ rootDir: ROOT })
    rimraf.sync(rootDir)
  }
})

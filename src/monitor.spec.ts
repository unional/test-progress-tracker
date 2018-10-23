import t from 'assert';
import { AssertOrder } from 'assertron';
import delay from 'delay';
import fs from 'fs';
import path from 'path';
import { append, init, monitor, MonitorSubscription, TestResults } from '.';
import { ROOT, TEST_RESULT_FILENAME } from './constants';
import { store } from './store';
import { filtered, noCoverage } from './testResultsExamples';
import rimraf = require('rimraf');

test('callback invoked with last save entry initially', async () => {
  const rootDir = 'fixtures/monitor-first'
  let sub: MonitorSubscription | undefined
  try {
    init({ rootDir })
    await append({ rootDir }, filtered)
    await append({ rootDir }, noCoverage)

    const actual = await new Promise(a => {
      sub = monitor({ rootDir, awaitWriteFinish: { pollInterval: 10, stabilityThreshold: 50 } }, (_, testResults) => a(testResults))
    })


    t.deepStrictEqual(actual!, noCoverage)
  }
  finally {
    if (sub) sub.close()
    init({ rootDir: ROOT })
    rimraf.sync(rootDir)
  }
})

test('extra empty line in the file is ignored', async () => {
  const rootDir = 'fixtures/monitor-extra-empty-line'
  let sub: MonitorSubscription | undefined
  try {
    init({ rootDir })
    await append({ rootDir }, noCoverage)
    const filepath = path.join(rootDir, TEST_RESULT_FILENAME)
    fs.appendFileSync(filepath, '\n')

    const actual = await new Promise(a => {
      sub = monitor({ rootDir, awaitWriteFinish: { pollInterval: 10, stabilityThreshold: 50 } }, (_, testResults) => a(testResults))
    })


    t.deepStrictEqual(actual!, noCoverage)
  }
  finally {
    if (sub) sub.close()
    init({ rootDir: ROOT })
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
  let sub: MonitorSubscription | undefined
  try {
    init({ rootDir })
    sub = monitor({ rootDir }, () => { throw new Error('should not call') })
  }
  finally {
    if (sub) sub.close()
    init({ rootDir: ROOT })
    rimraf.sync(rootDir)
  }
})

test('delete result file should not trigger', async () => {
  const rootDir = 'fixtures/monitor-delete'

  let sub: MonitorSubscription | undefined
  try {
    init({ rootDir })
    await append({ rootDir }, noCoverage)

    const o = new AssertOrder()
    sub = monitor({ rootDir, awaitWriteFinish: { pollInterval: 10, stabilityThreshold: 50 } }, () => o.once(1))
    const filePath = path.join(rootDir, TEST_RESULT_FILENAME)
    fs.unlinkSync(filePath)
  }
  finally {
    if (sub) sub.close()
    init({ rootDir: ROOT })
    rimraf.sync(rootDir)
  }
})

test('trigger on change', async () => {
  const rootDir = 'fixtures/monitor-change'
  let sub: MonitorSubscription | undefined
  try {
    init({ rootDir })
    await append({ rootDir }, noCoverage)
    const o = new AssertOrder(2)
    sub = monitor({ rootDir, awaitWriteFinish: { pollInterval: 10, stabilityThreshold: 50 } }, () => o.any([1, 2]))
    await append({ rootDir }, noCoverage)
    o.end()
  }
  finally {
    if (sub) sub.close()
    init({ rootDir: ROOT })
    rimraf.sync(rootDir)
  }
})

test('trigger on new file', async () => {
  const rootDir = 'fixtures/monitor-new'
  let sub: MonitorSubscription | undefined
  try {
    init({ rootDir })

    const actual = await new Promise<TestResults>(async a => {
      sub = monitor({ rootDir, awaitWriteFinish: { pollInterval: 10, stabilityThreshold: 50 } }, (_, testResults) => a(testResults))
      // Add a small delay because in circleci it seems like chokidar can't pick up the next append (new file).
      await delay(10)
      await append({ rootDir }, noCoverage)
    })
    t.deepStrictEqual(actual, noCoverage)
  }
  finally {
    if (sub) sub.close()
    init({ rootDir: ROOT })
    rimraf.sync(rootDir)
  }
})

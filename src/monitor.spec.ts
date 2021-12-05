import t from 'assert';
import { AssertOrder } from 'assertron';
import delay from 'delay';
import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import { append, init, monitor, MonitorSubscription, TestResults } from '.';
import { TEST_RESULT_FILENAME, PROGRESS_FOLDER } from './constants';
import { store } from './store';
import { filtered, noCoverage } from './testResultsExamples';

test('callback invoked with last save entry initially', async () => {
  const rootDir = 'fixtures/monitor/monitor-first'
  let sub: MonitorSubscription | undefined
  try {
    init({ rootDir })
    await append({ rootDir }, filtered)
    await append({ rootDir }, noCoverage)

    const actual = await new Promise(a => {
      sub = monitor({ rootDir, awaitWriteFinish: { pollInterval: 10, stabilityThreshold: 50 } }, (_, testResults) => a(testResults))
    })


    t.deepStrictEqual(actual, noCoverage)
  }
  finally {
    if (sub) sub.close()
    init()
    rimraf.sync(rootDir)
  }
})

test('extra empty line in the file is ignored', async () => {
  const rootDir = 'fixtures/monitor/monitor-extra-empty-line'
  let sub: MonitorSubscription | undefined
  try {
    init({ rootDir })
    await append({ rootDir }, noCoverage)
    const filepath = path.join(rootDir, PROGRESS_FOLDER, TEST_RESULT_FILENAME)
    fs.appendFileSync(filepath, '\n')

    const actual = await new Promise(a => {
      sub = monitor({ rootDir, awaitWriteFinish: { pollInterval: 10, stabilityThreshold: 50 } }, (_, testResults) => a(testResults))
    })


    t.deepStrictEqual(actual, noCoverage)
  }
  finally {
    if (sub) sub.close()
    init()
    rimraf.sync(rootDir)
  }
})

test('callback not invoked when root directory not exist', () => {
  let sub: MonitorSubscription | undefined
  try {
    store.value.rootDir = 'fixtures/monitor/not-exist'
    sub = monitor(undefined, () => { throw new Error('should not call') })
  }
  finally {
    if (sub) sub.close()
  }
})

test('callback not invoked when result file not exist', () => {
  const rootDir = 'fixtures/monitor/monitor-no-file'
  let sub: MonitorSubscription | undefined
  try {
    init({ rootDir })
    sub = monitor({ rootDir }, () => { throw new Error('should not call') })
  }
  finally {
    if (sub) sub.close()
    init()
    rimraf.sync(rootDir)
  }
})

test('delete result file should not trigger', async () => {
  const rootDir = 'fixtures/monitor/monitor-delete'

  let sub: MonitorSubscription | undefined
  try {
    init({ rootDir })
    await append({ rootDir }, noCoverage)

    const o = new AssertOrder()
    sub = monitor({ rootDir, awaitWriteFinish: { pollInterval: 10, stabilityThreshold: 50 } }, () => o.once(1))
    const filePath = path.join(rootDir, TEST_RESULT_FILENAME)
    rimraf.sync(filePath)
  }
  finally {
    if (sub) sub.close()
    init()
    rimraf.sync(rootDir)
  }
})

test('trigger on change', async () => {
  const rootDir = 'fixtures/monitor/monitor-change'
  let sub: MonitorSubscription | undefined
  try {
    init({ rootDir })
    await append({ rootDir }, noCoverage)
    const o = new AssertOrder(2)
    sub = monitor({ rootDir, awaitWriteFinish: { pollInterval: 10, stabilityThreshold: 50 } }, () => o.any([1, 2]))
    await delay(10)
    await append({ rootDir }, noCoverage)
    await delay(1000)
    o.end()
  }
  finally {
    if (sub) sub.close()
    init()
    rimraf.sync(rootDir)
  }
})

test('trigger on new file', async () => {
  const rootDir = 'fixtures/monitor/monitor-new'
  let sub: MonitorSubscription | undefined
  try {
    init({ rootDir })

    let accept: (v: TestResults) => void
    const p = new Promise<TestResults>(a => accept = a)
    sub = monitor(
      { rootDir, awaitWriteFinish: { pollInterval: 10, stabilityThreshold: 50 } },
      (_, testResults) => accept(testResults)
    )
    // Add a small delay because in circleCI it seems like chokidar can't pick up the next append (new file).
    await delay(10)
    await append({ rootDir }, noCoverage)
    const actual = await p
    t.deepStrictEqual(actual, noCoverage)
  }
  finally {
    if (sub) sub.close()
    init()
    rimraf.sync(rootDir)
  }
})

test('file already exists will call once', async () => {
  const rootDir = 'fixtures/monitor/exist'
  let sub: MonitorSubscription | undefined
  try {
    let count = 0
    sub = monitor({ rootDir, awaitWriteFinish: { pollInterval: 10, stabilityThreshold: 50 } }, () => count++)
    await delay(10)
    t.strictEqual(count, 1)
  }
  finally {
    if (sub) sub.close()
  }
})

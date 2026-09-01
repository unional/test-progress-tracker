import fs from 'node:fs'
import path from 'node:path'
import { unpartial } from 'unpartial'
import { promisify } from 'node:util'
import { compress } from './compress'
import { PROGRESS_FOLDER, TEST_RESULT_FILENAME } from './constants'
import type { FSContext, TestResults } from './interface'
import { minify } from './minify'
import { store } from './store'

let appendFile = fs.appendFile
let promisifiedAppendFile = promisify(fs.appendFile)

export async function append(context: Partial<FSContext<'appendFile'>> | undefined, results: TestResults) {
	const c = unpartial<FSContext<'appendFile'>>({ fs, rootDir: store.value.rootDir }, context)

	const filepath = path.join(c.rootDir, PROGRESS_FOLDER, TEST_RESULT_FILENAME)
	const minified = minify(results)
	const compressed = compress(minified)

	// istanbul ignore next
	if (c.fs.appendFile !== appendFile) {
		appendFile = c.fs.appendFile
		promisifiedAppendFile = promisify(appendFile)
	}

	await promisifiedAppendFile(filepath, compressed + '\n')
}

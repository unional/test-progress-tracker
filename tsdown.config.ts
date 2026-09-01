import { defineConfig } from 'tsdown'

// The published surface is CommonJS at `cjs/`, per module, with declarations and
// source maps — `main: cjs/index.js`, `typings: cjs/index.d.ts`. `jest-progress-tracker`
// consumes it through legacy `main` resolution (`require()` after TypeScript's
// `esModuleInterop` downlevel), so the paths and the format are a contract, not a
// preference. `unbundle` keeps the one-file-per-module shape `tsc` emitted, and
// `outExtensions` stops tsdown moving the output to `.cjs` / `.d.cts`.
export default defineConfig({
	entry: ['ts/index.ts'],
	format: 'cjs',
	outDir: 'cjs',
	unbundle: true,
	dts: true,
	sourcemap: true,
	clean: true,
	target: 'node20',
	outExtensions: () => ({ js: '.js', dts: '.d.ts' })
})

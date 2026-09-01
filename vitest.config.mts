import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		include: ['ts/**/*.{spec,test,integrate,accept,system,unit}.ts'],
		coverage: {
			provider: 'v8',
			include: ['ts/**/*.ts'],
			exclude: ['ts/**/*.spec.ts', 'ts/testResultsExamples.ts'],
			reporter: ['text', 'lcov'],
			// Set to what the suite already meets, so a regression fails the build
			// instead of quietly reporting a lower number.
			thresholds: {
				statements: 98,
				branches: 100,
				functions: 95,
				lines: 98
			}
		}
	}
})

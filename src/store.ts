import { createStore } from 'global-store'

export const store = createStore<{ rootDir: string }>({
  moduleName: 'test-progress-tracker',
  version: '1.0.0',
  initializer: (current) => ({
    rootDir: '.',
    ...current
  })
})

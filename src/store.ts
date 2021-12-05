import { createStore } from 'global-store'

export const store = createStore<{ rootDir: string }>({
  moduleName: 'test-progress-tracker',
  key: 'fc42d219-7e4e-5e80-82d8-2415e30bced0',
  version: '1.0.0',
  initializer: (current) => ({
    rootDir: '.',
    ...current
  })
})

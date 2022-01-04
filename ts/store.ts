import { createStore } from 'global-store'

export const store = createStore<{ rootDir: string }>({
  moduleName: 'test-progress-tracker',
  version: '1.0.0',
  key: 'eb969cee-8646-5b9c-9084-9093804d4121',
  initializer: (current) => ({
    rootDir: '.',
    ...current
  })
})

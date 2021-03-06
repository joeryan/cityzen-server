const { loadConfig } = require('../../src/config')
const path = require('path')

const CONFIG_PATH = path.resolve(__dirname, '..', '..', 'config', 'trello.json')

describe("Test that Trello's config values load correctly", () => {
  test('Test loading config values', async () => {
    const config = loadConfig(CONFIG_PATH)

    expect(config).toHaveProperty('tasks.backend.config.apiKey')
    // @ts-ignore
    expect(config.tasks.backend.config.apiKey).toBe('123')
  })
})

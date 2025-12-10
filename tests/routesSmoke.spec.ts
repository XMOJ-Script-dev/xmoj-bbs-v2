import { describe, it, expect, beforeAll } from 'vitest'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

describe('Routes smoke export default handlers', () => {
  beforeAll(() => {
    ;(globalThis as any).defineEventHandler = (h: any) => h
    ;(globalThis as any).eventHandler = (h: any) => h
    // Provide minimal DOM-like globals some modules expect under undici/cheerio
    ;(globalThis as any).File = class {} as any
    ;(globalThis as any).Blob = class {} as any
    ;(globalThis as any).FormData = class { append() {} } as any
  })

  const routesDir = path.resolve(__dirname, '../server/routes')
  const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.ts'))

  for (const file of files) {
    it(`${file} exports a handler`, async () => {
      const mod = await import(pathToFileURL(path.join(routesDir, file)).href)
      expect(typeof mod.default).toBe('function')
    })
  }
})

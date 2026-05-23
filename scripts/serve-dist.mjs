import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(new URL('..', import.meta.url)), 'dist')
const portArg = process.argv.find(arg => arg.startsWith('--port='))
const port = Number(portArg?.split('=')[1] || process.env.PORT || 5173)

const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
  '.webp': 'image/webp',
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || '/', `http://${request.headers.host || '127.0.0.1'}`)
    const cleanPath = normalize(decodeURIComponent(url.pathname))
      .replace(/^[/\\]+/, '')
      .replace(/^(\.\.[/\\])+/, '')
    const requestedPath = cleanPath === '' ? 'index.html' : cleanPath
    const candidate = join(root, requestedPath)
    const filePath = existsSync(candidate) ? candidate : join(root, 'index.html')
    const data = await readFile(filePath)
    response.writeHead(200, {
      'Cache-Control': 'no-store',
      'Content-Type': types[extname(filePath)] || 'application/octet-stream',
    })
    response.end(data)
  } catch (error) {
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end(error instanceof Error ? error.message : 'Server error')
  }
})

server.listen(port, '127.0.0.1', () => {
  console.log(`Serving dist at http://127.0.0.1:${port}/`)
})

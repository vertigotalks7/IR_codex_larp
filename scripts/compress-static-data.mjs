import { readdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { gzipSync } from 'node:zlib'

const dataDirectory = resolve('dist/data')
let jsonFiles = 0
let originalBytes = 0
let compressedBytes = 0

async function compressDirectory(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) {
      await compressDirectory(path)
      continue
    }
    if (!entry.isFile() || !entry.name.endsWith('.json')) continue

    const source = await readFile(path)
    const compressed = gzipSync(source, { level: 9 })
    await writeFile(`${path}.gz`, compressed)
    jsonFiles += 1
    originalBytes += source.byteLength
    compressedBytes += compressed.byteLength
  }
}

await compressDirectory(dataDirectory)
const ratio = originalBytes ? Math.round((1 - compressedBytes / originalBytes) * 100) : 0
console.log(`Compressed ${jsonFiles} JSON data bundles: ${originalBytes.toLocaleString()} → ${compressedBytes.toLocaleString()} bytes (${ratio}% smaller).`)

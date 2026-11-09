import fs from 'fs'
import path from 'path'

function listFiles(dir) {
  if (!fs.existsSync(dir)) return
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      listFiles(full)
    } else {
      console.log(full.replace(path.resolve('.'), ''))
    }
  }
}

listFiles(path.resolve('app/estudiante'))


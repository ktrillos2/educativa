import fs from 'fs'
import path from 'path'

function searchDir(dir, pattern) {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const fullPath = path.join(dir, file)
    if (file === 'node_modules' || file === '.next' || file === '.git') continue
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      searchDir(fullPath, pattern)
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8')
      const lines = content.split('\n')
      lines.forEach((line, idx) => {
        if (pattern.test(line)) {
          console.log(`${fullPath}:${idx + 1}: ${line.trim()}`)
        }
      })
    }
  }
}

console.log("--- Búsqueda de Estado Académico / Cursos y Pagos ---")
searchDir(path.resolve('app'), /Estado Acad[eé]mico|Cursos y Pagos/i)


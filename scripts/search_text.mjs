import fs from 'fs'
import path from 'path'

function searchDir(dir, searchStr) {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const fullPath = path.join(dir, file)
    if (file === 'node_modules' || file === '.next' || file === '.git') continue
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      searchDir(fullPath, searchStr)
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8')
      if (content.includes(searchStr)) {
        console.log(`Found in: ${fullPath}`)
      }
    }
  }
}

searchDir(path.resolve('.'), 'Estado Académico')
searchDir(path.resolve('.'), 'Cursos y Pagos')


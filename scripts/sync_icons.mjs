import fs from 'fs'
import path from 'path'

const source = path.join(process.cwd(), 'public', 'images', 'image.png')
const targets = [
  path.join(process.cwd(), 'public', 'favicon.ico'),
  path.join(process.cwd(), 'public', 'icon.png'),
  path.join(process.cwd(), 'public', 'apple-icon.png'),
  path.join(process.cwd(), 'public', 'icon-light-32x32.png'),
  path.join(process.cwd(), 'public', 'icon-dark-32x32.png'),
]

for (const target of targets) {
  try {
    fs.copyFileSync(source, target)
    console.log(`Copiado a ${path.basename(target)}`)
  } catch (err) {
    console.error(`Error copiando a ${target}:`, err)
  }
}

// Remove icon.svg if it exists to avoid browser SVG base64 render issues
const svgPath = path.join(process.cwd(), 'public', 'icon.svg')
if (fs.existsSync(svgPath)) {
  try {
    fs.unlinkSync(svgPath)
    console.log('Eliminado icon.svg para evitar bloqueos del navegador')
  } catch (err) {
    console.error('Error eliminando icon.svg:', err)
  }
}

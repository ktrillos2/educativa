const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputFiles = [
  'C:\\Users\\fergi\\.gemini\\antigravity\\brain\\464290f8-bd35-42f4-8f42-d0c86dc7d593\\diplomado_1_1779571822942.png',
  'C:\\Users\\fergi\\.gemini\\antigravity\\brain\\464290f8-bd35-42f4-8f42-d0c86dc7d593\\diplomado_2_1779571835650.png',
  'C:\\Users\\fergi\\.gemini\\antigravity\\brain\\464290f8-bd35-42f4-8f42-d0c86dc7d593\\diplomado_3_1779571847742.png',
  'C:\\Users\\fergi\\.gemini\\antigravity\\brain\\464290f8-bd35-42f4-8f42-d0c86dc7d593\\diplomado_4_1779571861066.png'
];

const outNames = ['diplomado-1.webp', 'diplomado-2.webp', 'diplomado-3.webp', 'diplomado-4.webp'];
const outDir = path.join(__dirname, 'public', 'images');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function convert() {
  for (let i = 0; i < inputFiles.length; i++) {
    const input = inputFiles[i];
    const output = path.join(outDir, outNames[i]);
    try {
      await sharp(input).webp({ quality: 80 }).toFile(output);
      console.log(`Converted ${input} to ${output}`);
    } catch (e) {
      console.error(`Failed to convert ${input}`, e);
    }
  }
}

convert();

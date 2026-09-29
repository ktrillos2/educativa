import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'public', 'certificado-diplomado');

const listonJpgPath = path.join(dir, 'liston-verde.jpeg');
const logoJpgPath = path.join(dir, 'logo-diploma.jpeg');

const listonSvgPath = path.join(dir, 'liston-verde.svg');
const logoSvgPath = path.join(dir, 'logo-diploma.svg');

if (fs.existsSync(listonJpgPath)) {
  const listonBuf = fs.readFileSync(listonJpgPath);
  const listonBase64 = listonBuf.toString('base64');
  const listonSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <clipPath id="crop-sides">
      <rect x="45" y="0" width="410" height="500" />
    </clipPath>
    <filter id="remove-white" color-interpolation-filters="sRGB">
      <feColorMatrix type="matrix" values="
        1 0 0 0 0
        0 1 0 0 0
        0 0 1 0 0
        -1.5 -1.5 -1.5 0 4.2"/>
    </filter>
  </defs>
  <g clip-path="url(#crop-sides)">
    <image href="data:image/jpeg;base64,${listonBase64}" x="0" y="0" width="500" height="500" preserveAspectRatio="xMidYMid meet" filter="url(#remove-white)"/>
  </g>
</svg>`;
  fs.writeFileSync(listonSvgPath, listonSvg);
  console.log('✅ Created liston-verde.svg with crop & transparent filter');
} else {
  console.log('❌ liston-verde.jpeg not found');
}

if (fs.existsSync(logoJpgPath)) {
  const logoBuf = fs.readFileSync(logoJpgPath);
  const logoBase64 = logoBuf.toString('base64');
  const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <clipPath id="crop-sides">
      <rect x="20" y="0" width="460" height="500" />
    </clipPath>
    <filter id="remove-white" color-interpolation-filters="sRGB">
      <feColorMatrix type="matrix" values="
        1 0 0 0 0
        0 1 0 0 0
        0 0 1 0 0
        -1.5 -1.5 -1.5 0 4.2"/>
    </filter>
  </defs>
  <g clip-path="url(#crop-sides)">
    <image href="data:image/jpeg;base64,${logoBase64}" x="0" y="0" width="500" height="500" preserveAspectRatio="xMidYMid meet" filter="url(#remove-white)"/>
  </g>
</svg>`;
  fs.writeFileSync(logoSvgPath, logoSvg);
  console.log('✅ Created logo-diploma.svg with transparent filter');
} else {
  console.log('❌ logo-diploma.jpeg not found');
}

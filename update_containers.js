const fs = require('fs');
const files = [
  'components/academic-offer.tsx',
  'components/benefits.tsx',
  'components/faq-section.tsx',
  'components/cta-section.tsx',
  'components/about-mission.tsx',
  'components/about-values.tsx',
  'components/about-team.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Remove justify-center from section
  content = content.replace(/h-\[100dvh\] flex flex-col justify-center/g, 'h-[100dvh] flex flex-col');
  
  // Add h-full flex flex-col justify-between to container
  content = content.replace(/className="container mx-auto px-4([^"]*)"/g, (match, p1) => {
    let classes = p1.split(' ').map(c => c.trim()).filter(Boolean);
    // remove justify-center if present
    classes = classes.filter(c => c !== 'justify-center');
    
    if (!classes.includes('h-full')) classes.push('h-full');
    if (!classes.includes('flex')) classes.push('flex');
    if (!classes.includes('flex-col')) classes.push('flex-col');
    if (!classes.includes('justify-between')) classes.push('justify-between');
    
    return `className="container mx-auto px-4 ${classes.join(' ')}"`;
  });

  fs.writeFileSync(file, content);
  console.log('Updated ' + file);
}

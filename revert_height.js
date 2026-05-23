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
  
  // Revert height and flex changes on sections to guarantee the 1cm rule
  content = content.replace(/h-\[100dvh\] flex flex-col justify-center/g, '');
  content = content.replace(/h-\[100dvh\] flex flex-col/g, '');
  content = content.replace(/min-h-\[100dvh\] flex flex-col justify-center/g, '');
  
  // Ensure we just have py-[1cm] and the original classes
  // The replace might leave trailing spaces, but that's fine for class names
  
  // Also remove w-full or h-full from container just in case
  content = content.replace(/className="container mx-auto px-4([^"]*)"/g, (match, p1) => {
    let classes = p1.split(' ').map(c => c.trim()).filter(Boolean);
    classes = classes.filter(c => c !== 'h-full' && c !== 'flex' && c !== 'flex-col' && c !== 'justify-between');
    return `className="container mx-auto px-4 ${classes.join(' ')}"`;
  });

  fs.writeFileSync(file, content);
  console.log('Reverted ' + file);
}

const fs = require('fs');
const files = [
  'components/academic-offer.tsx',
  'components/benefits.tsx',
  'components/faq-section.tsx',
  'components/cta-section.tsx',
  'components/about-hero.tsx',
  'components/about-mission.tsx',
  'components/about-values.tsx',
  'components/about-team.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace standard paddings with py-[1cm]
  content = content.replace(/py-(8|10|16|24)\s*(md:py-(10|24))?/g, 'py-[1cm]');
  
  // Replace pb-24 with pb-[1cm]
  content = content.replace(/pb-24/g, 'pb-[1cm]');
  
  // Also fix mb-20 in benefits.tsx
  content = content.replace(/mb-20/g, '');

  // Add the strict 100dvh rules to the section className
  content = content.replace(/<section\s+([^>]*?)className="([^"]+)"([^>]*)>/, (match, p1, p2, p3) => {
     let classes = p2.split(' ').map(c => c.trim()).filter(Boolean);
     
     // Remove old height classes if any
     classes = classes.filter(c => !c.includes('h-[') && c !== 'min-h-[500px]' && !c.includes('justify-center') && !c.includes('flex-col'));
     
     // Make sure flex is there
     if (!classes.includes('flex')) {
        classes.push('flex');
     }
     if (!classes.includes('items-center')) { // About-hero uses items-center, others will use flex-col
        classes.push('flex-col');
     }
     
     classes.push('justify-center');
     classes.push('h-[100dvh]');
     
     if (!classes.includes('overflow-hidden')) {
        classes.push('overflow-hidden');
     }

     return `<section ${p1}className="${classes.join(' ')}"${p3}>`;
  });

  fs.writeFileSync(file, content);
  console.log('Updated ' + file);
}

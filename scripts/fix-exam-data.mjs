import fs from 'fs';
import path from 'path';

const examDataPath = path.join(process.cwd(), 'lib/exam-data.ts');
const examConstantsPath = path.join(process.cwd(), 'lib/exam-constants.ts');
const dialogPath = path.join(process.cwd(), 'app/admin/usuarios/user-progress-dialog.tsx');

const content = fs.readFileSync(examDataPath, 'utf8');

const lines = content.split('\n');
let newContent = '';
let constantsContent = '';
let inConstants = true;

for(let line of lines) { 
    if (line.startsWith('import fs')) { 
        inConstants = false; 
    } 
    
    if (inConstants) { 
        constantsContent += line + '\n'; 
    } else { 
        newContent += line + '\n'; 
    } 
}

// Guarda lib/exam-constants.ts
fs.writeFileSync(examConstantsPath, constantsContent);

// Guarda lib/exam-data.ts actualizado
newContent = 'import { Question, FALLBACK_QUESTIONS, COURSE_9_QUESTIONS } from "./exam-constants";\n' + newContent;
fs.writeFileSync(examDataPath, newContent);

// Actualiza el import en user-progress-dialog.tsx
let dialogContent = fs.readFileSync(dialogPath, 'utf8');
dialogContent = dialogContent.replace(
    /from "@\/lib\/exam-data"/g, 
    'from "@/lib/exam-constants"'
);
fs.writeFileSync(dialogPath, dialogContent);

console.log('✅ Archivos refactorizados correctamente para solucionar el error de "fs".');

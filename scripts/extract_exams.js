const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const content = fs.readFileSync(path.join(rootDir, 'lib/exam-data.ts'), 'utf8');

// Use a simpler regex or manual extraction
const startIndex = content.indexOf('export const COURSE_9_QUESTIONS: Record<string, Question[]> = {');
if (startIndex !== -1) {
    const startObj = content.indexOf('{', startIndex);
    const endIndex = content.indexOf('};', startObj);
    
    if (startObj !== -1 && endIndex !== -1) {
        const objStr = content.substring(startObj, endIndex + 1);
        try {
            // Write directly as a json file
            fs.writeFileSync(
                path.join(rootDir, 'diplomados/exams_gestion-presupuesto-publico.json'), 
                objStr
            );
            console.log('✅ Creado: diplomados/exams_gestion-presupuesto-publico.json');
        } catch (e) {
            console.error('Error escribiendo archivo:', e);
        }
    }
} else {
    console.log('No se encontro COURSE_9_QUESTIONS');
}

// Para el otro curso, podemos crear un JSON con las preguntas de respaldo temporalmente
// Para no dejarlo vacio si antes usaba el fallback
const fallbackContent = content.indexOf('export const FALLBACK_QUESTIONS: Question[] = [');
if (fallbackContent !== -1) {
    const startArr = content.indexOf('[', fallbackContent);
    const endArr = content.indexOf(']', startArr);
    
    if (startArr !== -1 && endArr !== -1) {
        let arrStr = content.substring(startArr, endArr + 1);
        // Clean up TS types if any
        try {
            // Evaluamos el string para obtener el array, porque puede tener trailing commas
            const fallbackObj = {
                "mod-1": eval("(" + arrStr + ")"),
                "mod-2": eval("(" + arrStr + ")"),
                "mod-3": eval("(" + arrStr + ")"),
                "mod-4": eval("(" + arrStr + ")")
            };
            
            // Asume que el ID es control-interno o similar, necesitamos que el usuario nos confirme el ID exacto 
            // O podemos guardarlo de forma segura
            fs.writeFileSync(
                path.join(rootDir, 'diplomados/exams_programa-tecnico-sistemas.json'), 
                JSON.stringify(fallbackObj, null, 2)
            );
            console.log('✅ Creado: diplomados/exams_programa-tecnico-sistemas.json');
        } catch (e) {
            console.error('Error con fallback:', e);
        }
    }
}

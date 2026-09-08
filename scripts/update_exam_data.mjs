import fs from 'fs';

const COURSE_9_QUESTIONS = {};

for (let mod = 1; mod <= 4; mod++) {
    const text = fs.readFileSync(`./actualizaciones_modulos/mod${mod}.txt`, 'utf-8');
    const questions = [];
    
    const questionBlocks = text.split(/PREGUNTA \d+ ·/);
    questionBlocks.shift(); 
    
    for (let i = 0; i < questionBlocks.length; i++) {
        let block = questionBlocks[i];
        const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        
        let qText = "";
        let optionStartIdx = -1;
        for (let j = 1; j < lines.length; j++) {
            if (/^[A-D]\.\s/.test(lines[j])) {
                optionStartIdx = j;
                break;
            }
            qText += (qText.length > 0 ? " " : "") + lines[j];
        }
        
        const options = [];
        for (let j = optionStartIdx; j < optionStartIdx + 4; j++) {
            if (lines[j] && /^[A-D]\.\s/.test(lines[j])) {
                options.push(lines[j].substring(3).trim()); 
            }
        }
        
        questions.push({
            id: `m${mod}-q${i + 1}`,
            question: qText,
            options: options,
            correct: 0,
            feedbackCorrect: "",
            feedbackIncorrect: ""
        });
    }
    
    const answersBlockMatch = text.match(/Pregunta\nClave[\s\S]*?(?=\n\n1\.|Normativa y referentes|Retroalimentación|1\.\s)/i);
    let aLines = [];
    if (answersBlockMatch) {
        aLines = answersBlockMatch[0].split('\n').map(l => l.trim()).filter(l => l.length > 0);
    } else {
        const fallbackMatch = text.match(/Clave[\s\S]*?1\./i);
        if (fallbackMatch) aLines = fallbackMatch[0].split('\n').map(l => l.trim()).filter(l => l.length > 0);
    }
    
    for (let i = 1; i <= 10; i++) {
        let correctIdx = 0;
        const idx = aLines.findIndex(l => l === i.toString());
        if (idx !== -1 && idx + 1 < aLines.length) {
            const answerLetter = aLines[idx + 1];
            if (answerLetter === 'A') correctIdx = 0;
            if (answerLetter === 'B') correctIdx = 1;
            if (answerLetter === 'C') correctIdx = 2;
            if (answerLetter === 'D') correctIdx = 3;
        } else {
            const rx = new RegExp(`^${i}\\..*?Respuesta correcta:\\s*([A-D])\\.`);
            const textLines = text.split('\n');
            for(let l of textLines) {
                const match = l.match(rx);
                if (match) {
                    const ans = match[1];
                    if (ans === 'A') correctIdx = 0;
                    if (ans === 'B') correctIdx = 1;
                    if (ans === 'C') correctIdx = 2;
                    if (ans === 'D') correctIdx = 3;
                    break;
                }
            }
        }
        
        let feedbackCorrect = "";
        let feedbackIncorrect = "";
        
        const blockRegex = new RegExp(`\\n${i}\\.\\s.*?(?=\\n${i+1}\\.\\s|\\nNormativa|$)`, 's');
        const feedbackMatch = text.match(blockRegex);
        if (feedbackMatch) {
            const fbBlock = feedbackMatch[0];
            const fundMatch = fbBlock.match(/Fundamento normativo y técnico:(.*?)(?=\nPor qué es correcta:)/s);
            const whyMatch = fbBlock.match(/Por qué es correcta:(.*?)(?=\nPor qué no las demás:)/s);
            const whyNotMatch = fbBlock.match(/Por qué no las demás:(.*?)$/s);
            
            if (fundMatch) feedbackCorrect += `Fundamento normativo y técnico: ${fundMatch[1].trim()}`;
            if (whyMatch) feedbackCorrect += `\n\nPor qué es correcta: ${whyMatch[1].trim()}`;
            if (whyNotMatch) feedbackIncorrect = `Por qué no las demás: ${whyNotMatch[1].trim()}`;
        }
        
        if(questions[i-1]) {
            questions[i-1].correct = correctIdx;
            questions[i-1].feedbackCorrect = feedbackCorrect;
            questions[i-1].feedbackIncorrect = feedbackIncorrect;
        }
    }
    
    COURSE_9_QUESTIONS[`mod-${mod}`] = questions;
}

const targetFile = './lib/exam-data.ts';
let fileContent = fs.readFileSync(targetFile, 'utf-8');

const startMarker = "export const COURSE_9_QUESTIONS: Record<string, Question[]> = {";
const endMarker = "export function getQuestionsForClient";

const startIdx = fileContent.indexOf(startMarker);
const endIdx = fileContent.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
    const stringified = JSON.stringify(COURSE_9_QUESTIONS, null, 4);
    const newBlock = `export const COURSE_9_QUESTIONS: Record<string, Question[]> = ${stringified};\n\n`;
    fileContent = fileContent.substring(0, startIdx) + newBlock + fileContent.substring(endIdx);
    fs.writeFileSync(targetFile, fileContent, 'utf-8');
    
    // Also remove COURSE_9_QUESTIONS and FALLBACK_QUESTIONS from exam-form.tsx to avoid duplication and expose
    const examFormFile = './app/diplomados/[id]/exam/[moduleId]/exam-form.tsx';
    let examFormContent = fs.readFileSync(examFormFile, 'utf-8');
    const qStart = examFormContent.indexOf("interface Question {");
    const qEnd = examFormContent.indexOf("export function ExamForm");
    if (qStart !== -1 && qEnd !== -1) {
        examFormContent = examFormContent.substring(0, qStart) + "import { Question } from \"@/lib/exam-data\"\n\n" + examFormContent.substring(qEnd);
        fs.writeFileSync(examFormFile, examFormContent, 'utf-8');
    }
    
    console.log("¡Datos del examen movidos al servidor (lib/exam-data.ts) exitosamente!");
} else {
    console.log("No se pudo encontrar el bloque en exam-data.ts");
}

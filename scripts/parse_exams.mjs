import fs from 'fs';

const COURSE_9_QUESTIONS = {};

for (let mod = 1; mod <= 4; mod++) {
    const text = fs.readFileSync(`./actualizaciones_modulos/mod${mod}.txt`, 'utf-8');
    const questions = [];
    
    // Parse Questions
    const questionBlocks = text.split(/PREGUNTA \d+ ·/);
    questionBlocks.shift(); // remove header
    
    for (let i = 0; i < questionBlocks.length; i++) {
        let block = questionBlocks[i];
        
        // Find question text
        const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        
        // lines[0] is usually something like "CASO HIPOTÉTICO"
        // the next lines are the question, until we hit "A. "
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
                options.push(lines[j].substring(3).trim()); // remove "A. "
            }
        }
        
        questions.push({
            id: `m${mod}-q${i + 1}`,
            question: qText,
            options: options,
            correct: 0 // placeholder
        });
    }
    
    // Parse Answers
    const answersBlockMatch = text.match(/Pregunta\nClave[\s\S]*?(?=\n\n1\.|Normativa y referentes)/);
    if (answersBlockMatch) {
        const aLines = answersBlockMatch[0].split('\n').map(l => l.trim()).filter(l => l.length > 0);
        // It goes: Pregunta, Clave, Tema, Referencia
        // Then: 1, B, Tema, Ref, 2, C, Tema, Ref...
        
        // It's a bit hard to parse reliably if the number of lines per row varies.
        // Let's just find the letters "A", "B", "C", "D" immediately after the question number.
        for (let i = 1; i <= 10; i++) {
            const idx = aLines.indexOf(i.toString());
            if (idx !== -1 && idx + 1 < aLines.length) {
                const answerLetter = aLines[idx + 1];
                let correctIdx = 0;
                if (answerLetter === 'A') correctIdx = 0;
                if (answerLetter === 'B') correctIdx = 1;
                if (answerLetter === 'C') correctIdx = 2;
                if (answerLetter === 'D') correctIdx = 3;
                questions[i-1].correct = correctIdx;
            }
        }
    }
    
    COURSE_9_QUESTIONS[`mod-${mod}`] = questions;
}

fs.writeFileSync('./actualizaciones_modulos/parsed_exams.json', JSON.stringify(COURSE_9_QUESTIONS, null, 4));
console.log("Exams parsed successfully.");

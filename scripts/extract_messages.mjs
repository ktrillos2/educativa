const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\fergi\\.gemini\\antigravity-ide\\brain\\fb1811b4-4c5f-4974-b6fe-6fad3b58d575\\.system_generated\\logs\\transcript.jsonl';
const outPath = 'C:\\Users\\fergi\\.gemini\\antigravity-ide\\brain\\fb1811b4-4c5f-4974-b6fe-6fad3b58d575\\scratch\\user_messages.md';

const content = fs.readFileSync(logPath, 'utf8');
const lines = content.split('\n').filter(l => l.trim() !== '');

let md = '# Historial de Mensajes del Usuario\n\n';

for (const line of lines) {
    try {
        const obj = JSON.parse(line);
        if (obj.type === 'USER_INPUT') {
            md += `## Mensaje (${obj.created_at || 'unknown time'})\n\n`;
            md += `${obj.content}\n\n---\n\n`;
        }
    } catch(e) {}
}

// Asegurarse que el directorio exista
const dir = path.dirname(outPath);
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(outPath, md);
console.log('Done!');

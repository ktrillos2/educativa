const fs = require('fs');

const path = 'C:\\Users\\fergi\\.gemini\\antigravity-ide\\brain\\fb1811b4-4c5f-4974-b6fe-6fad3b58d575\\.system_generated\\logs\\transcript.jsonl';
const content = fs.readFileSync(path, 'utf8');

const lines = content.split('\n').filter(l => l.trim() !== '');

const userMessages = [];

for (const line of lines) {
    try {
        const obj = JSON.parse(line);
        if (obj.type === 'USER_INPUT') {
            userMessages.push(obj.content);
        }
    } catch(e) {}
}

// Print the last 20 user messages
console.log("LAST 20 USER MESSAGES:");
userMessages.slice(-20).forEach((msg, i) => {
    console.log(`\n--- Message ${i+1} ---`);
    console.log(msg);
});

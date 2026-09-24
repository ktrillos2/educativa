const fs = require('fs');
const pdfParse = require('pdf-parse');
console.log('pdfParse is a:', typeof pdfParse);
if (typeof pdfParse === 'function') {
    console.log('It is a function');
} else {
    console.log('Keys:', Object.keys(pdfParse));
}

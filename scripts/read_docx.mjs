import fs from 'fs';
import zlib from 'zlib';
import path from 'path';

function readDocx(filePath) {
    return new Promise((resolve, reject) => {
        const buffer = fs.readFileSync(filePath);
        
        // Find the central directory
        let eocdOffset = buffer.length - 22;
        while (eocdOffset >= 0 && buffer.readUInt32LE(eocdOffset) !== 0x06054b50) {
            eocdOffset--;
        }
        
        if (eocdOffset < 0) return reject(new Error("Not a valid ZIP/DOCX file"));

        const cdOffset = buffer.readUInt32LE(eocdOffset + 16);
        const cdEntries = buffer.readUInt16LE(eocdOffset + 8);
        
        let offset = cdOffset;
        for (let i = 0; i < cdEntries; i++) {
            const fileNameLen = buffer.readUInt16LE(offset + 28);
            const extraFieldLen = buffer.readUInt16LE(offset + 30);
            const fileCommentLen = buffer.readUInt16LE(offset + 32);
            const localHeaderOffset = buffer.readUInt32LE(offset + 42);
            
            const fileName = buffer.toString('utf8', offset + 46, offset + 46 + fileNameLen);
            
            if (fileName === 'word/document.xml') {
                // Read local header
                const compressionMethod = buffer.readUInt16LE(localHeaderOffset + 8);
                const localFileNameLen = buffer.readUInt16LE(localHeaderOffset + 26);
                const localExtraFieldLen = buffer.readUInt16LE(localHeaderOffset + 28);
                
                const dataOffset = localHeaderOffset + 30 + localFileNameLen + localExtraFieldLen;
                const compressedSize = buffer.readUInt32LE(offset + 20);
                
                const compressedData = buffer.slice(dataOffset, dataOffset + compressedSize);
                
                if (compressionMethod === 8) { // Deflate
                    const xmlData = zlib.inflateRawSync(compressedData).toString('utf8');
                    // Strip XML tags to get plain text
                    const plainText = xmlData.replace(/<\/w:p>/g, '\n').replace(/<[^>]+>/g, '');
                    resolve(plainText);
                } else if (compressionMethod === 0) { // Store
                    resolve(compressedData.toString('utf8').replace(/<\/w:p>/g, '\n').replace(/<[^>]+>/g, ''));
                } else {
                    reject(new Error("Unsupported compression"));
                }
                return;
            }
            
            offset += 46 + fileNameLen + extraFieldLen + fileCommentLen;
        }
        reject(new Error("word/document.xml not found"));
    });
}

async function extractAll() {
    const dir = './actualizaciones_modulos';
    for (let i = 1; i <= 4; i++) {
        const file = path.join(dir, `EVALUACION_MODULO_${i}.docx`);
        try {
            const text = await readDocx(file);
            fs.writeFileSync(path.join(dir, `mod${i}.txt`), text);
            console.log(`Extracted Modulo ${i}`);
        } catch (e) {
            console.error(`Error on Modulo ${i}:`, e.message);
        }
    }
}

extractAll();

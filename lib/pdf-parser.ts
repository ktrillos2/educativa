/**
 * Utility to extract text content from a PDF buffer using pdf-parse.
 */
export async function extractTextFromPdfBuffer(pdfBuffer: Buffer): Promise<string> {
  const pdfParseLib = require("pdf-parse")
  const pdfParse = typeof pdfParseLib === "function" ? pdfParseLib : (pdfParseLib.default || pdfParseLib)

  const data = await pdfParse(pdfBuffer)
  return cleanPdfText(data.text)
}

function cleanPdfText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

/**
 * Utility to extract text content from a PDF buffer using pdf-parse.
 */
export async function extractTextFromPdfBuffer(pdfBuffer: Buffer): Promise<string> {
  // Polyfill for DOMMatrix which pdf.js expects in some environments
  if (typeof global !== "undefined") {
    if (!global.DOMMatrix) {
      ;(global as any).DOMMatrix = class DOMMatrix {
        constructor(init?: string | number[]) {}
      }
    }
    if (!(global as any).Path2D) {
      ;(global as any).Path2D = class Path2D {
        constructor(path?: string | Path2D) {}
      }
    }
  }

  const pdfParseLib = await import("pdf-parse")
  const pdfParse = typeof pdfParseLib === "function" ? pdfParseLib : (pdfParseLib.default || pdfParseLib)

  if (typeof pdfParse !== "function") {
    throw new Error(`pdfParse resolved to type ${typeof pdfParse}, keys: ${Object.keys(pdfParse).join(',')}`)
  }

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

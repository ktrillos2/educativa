/**
 * Lista todos los cursos con su estado de PDFs y exámenes.
 * Ejecutar: node scripts/check-courses-status.mjs
 */
import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, "../.env.local") })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/"/g, ""),
  process.env.SUPABASE_SERVICE_ROLE_KEY?.replace(/"/g, ""),
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function main() {
  const { data: courses, error } = await supabase
    .from("courses")
    .select("id, title, type, modules, module_pdfs, exam_pdfs, exams_data")
    .order("title")

  if (error) { console.error("❌ Error:", error.message); return }

  console.log("\n" + "═".repeat(70))
  console.log(`CURSOS EN BASE DE DATOS (${courses.length} total)`)
  console.log("═".repeat(70))

  for (const c of courses) {
    const pdfCount = Object.values(c.module_pdfs || {}).filter(Boolean).length
    const examCount = Object.keys(c.exams_data || {}).filter(
      k => Array.isArray(c.exams_data[k]) && c.exams_data[k].length > 0
    ).length
    const totalQ = Object.values(c.exams_data || {}).reduce(
      (sum, q) => sum + (Array.isArray(q) ? q.length : 0), 0
    )

    const pdfStatus = pdfCount > 0 ? `✅ ${pdfCount}/${c.modules || "?"}` : "❌ Sin PDFs"
    const examStatus = examCount > 0 ? `✅ ${examCount} mód (${totalQ} pregs)` : "❌ Sin exámenes"

    console.log(`\n  ID    : ${c.id}`)
    console.log(`  Título: ${c.title}`)
    console.log(`  Tipo  : ${c.type || "diplomado"}`)
    console.log(`  PDFs  : ${pdfStatus}`)
    console.log(`  Exáms : ${examStatus}`)
  }

  console.log("\n" + "═".repeat(70) + "\n")
}

main().catch(console.error)

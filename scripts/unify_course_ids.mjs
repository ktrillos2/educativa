import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function main() {
  console.log("🚀 Iniciando unificación de IDs y limpieza de títulos...\n")

  // --- PASO 1: Corregir el título de "seguridad-social" ---
  console.log("⏳ 1. Restaurando el título original de 'seguridad-social'...")
  const { error: updErr } = await supabase
    .from('courses')
    .update({ title: 'Seguridad social' })
    .eq('id', 'seguridad-social')
  
  if (updErr) {
    console.error("❌ Error restaurando el título:", updErr)
  } else {
    console.log("✅ Título de 'seguridad-social' restaurado con éxito.")
  }

  // --- PASO 2: Migrar el ID "9" a texto ("gestion-presupuesto-publico") ---
  const OLD_ID = "9"
  const NEW_ID = "gestion-presupuesto-publico"
  
  console.log(`\n⏳ 2. Migrando el curso con ID numérico '${OLD_ID}' a formato texto '${NEW_ID}'...`)
  
  const { data: oldCourse, error: courseErr } = await supabase
    .from('courses')
    .select('*')
    .eq('id', OLD_ID)
    .single()

  if (courseErr || !oldCourse) {
    console.log(`⚠️ No se encontró el curso '${OLD_ID}'. Es posible que ya se haya migrado.`)
  } else {
    const newCourseData = { ...oldCourse, id: NEW_ID }
    
    // Insert new ID
    const { error: insertErr } = await supabase.from('courses').insert(newCourseData)
    
    if (insertErr && insertErr.code !== '23505') {
      console.error("❌ Error creando el nuevo curso con ID texto:", insertErr)
      process.exit(1)
    }
    console.log(`✅ Nuevo registro de curso creado con ID: "${NEW_ID}"`)

    // Update related tables
    const tablesToUpdate = ['orders', 'enrollments', 'progress', 'course_groups', 'forum_posts', 'diplomas', 'live_classes']
    
    for (const table of tablesToUpdate) {
      const { error: updateErr } = await supabase
        .from(table)
        .update({ course_id: NEW_ID })
        .eq('course_id', OLD_ID)
      
      if (!updateErr) console.log(`   - Relaciones actualizadas en: ${table}`)
    }

    // Delete old numeric ID
    await supabase.from('courses').delete().eq('id', OLD_ID)
    console.log(`✅ Registro antiguo numérico eliminado.`)

    // Rename files in diplomados folder
    const diplomadosDir = path.join(process.cwd(), "diplomados")
    if (fs.existsSync(diplomadosDir)) {
      const files = fs.readdirSync(diplomadosDir)
      for (const file of files) {
        if (file.includes(`- ${OLD_ID}.pdf`) || file === `exams_${OLD_ID}.json` || file.includes(`_${OLD_ID}_`)) {
          const newFileName = file.replace(`- ${OLD_ID}.pdf`, `- ${NEW_ID}.pdf`).replace(`_${OLD_ID}.json`, `_${NEW_ID}.json`)
          try {
            fs.renameSync(path.join(diplomadosDir, file), path.join(diplomadosDir, newFileName))
            console.log(`   - Archivo renombrado a: ${newFileName}`)
          } catch (e) {}
        }
      }
    }
  }

  console.log("\n🎉 Estandarización completada con éxito.")
  process.exit(0)
}

main().catch(console.error)

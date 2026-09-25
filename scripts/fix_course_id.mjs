import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Faltan las variables de entorno de Supabase")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const OLD_ID = "3"
const NEW_ID = "seguridad-social"

async function main() {
  console.log(`🚀 Iniciando migración de ID: "${OLD_ID}" a "${NEW_ID}"...`)

  // 1. Get the old course
  const { data: oldCourse, error: courseErr } = await supabase
    .from('courses')
    .select('*')
    .eq('id', OLD_ID)
    .single()

  if (courseErr || !oldCourse) {
    console.error("❌ No se encontró el curso antiguo:", courseErr)
    process.exit(1)
  }

  // 2. Create the new course
  const newCourseData = { ...oldCourse, id: NEW_ID }
  
  const { error: insertErr } = await supabase
    .from('courses')
    .insert(newCourseData)

  if (insertErr) {
    if (insertErr.code === '23505') {
      console.log(`⚠️ El curso con ID "${NEW_ID}" ya existe, procediendo a actualizar referencias...`)
    } else {
      console.error("❌ Error creando el nuevo curso:", insertErr)
      process.exit(1)
    }
  } else {
    console.log(`✅ Nuevo curso creado con ID: "${NEW_ID}"`)
  }

  // 3. Update all related tables
  const tablesToUpdate = [
    'orders',
    'enrollments',
    'progress',
    'course_groups',
    'forum_posts',
    'diplomas',
    'live_classes'
  ]

  for (const table of tablesToUpdate) {
    console.log(`⏳ Actualizando referencias en la tabla '${table}'...`)
    const { error: updateErr, count } = await supabase
      .from(table)
      .update({ course_id: NEW_ID })
      .eq('course_id', OLD_ID)
    
    if (updateErr) {
      console.log(`⚠️ Error o tabla no existe para '${table}':`, updateErr.message)
    } else {
      console.log(`✅ Tabla '${table}' actualizada.`)
    }
  }

  // 4. Delete the old course
  console.log(`⏳ Eliminando el curso antiguo con ID: "${OLD_ID}"...`)
  const { error: delErr } = await supabase
    .from('courses')
    .delete()
    .eq('id', OLD_ID)

  if (delErr) {
    console.error(`❌ Error eliminando el curso antiguo:`, delErr)
  } else {
    console.log(`✅ Curso antiguo eliminado.`)
  }

  // 5. Rename files in the filesystem
  const diplomadosDir = path.join(process.cwd(), "diplomados")
  if (fs.existsSync(diplomadosDir)) {
    console.log(`⏳ Buscando archivos asociados al ID "${OLD_ID}" en la carpeta diplomados...`)
    const files = fs.readdirSync(diplomadosDir)
    
    for (const file of files) {
      if (file.includes(`- ${OLD_ID}.pdf`) || file === `exams_${OLD_ID}.json`) {
        const newFileName = file.replace(`- ${OLD_ID}.pdf`, `- ${NEW_ID}.pdf`).replace(`_${OLD_ID}.json`, `_${NEW_ID}.json`)
        const oldPath = path.join(diplomadosDir, file)
        const newPath = path.join(diplomadosDir, newFileName)
        
        try {
          fs.renameSync(oldPath, newPath)
          console.log(`✅ Archivo renombrado: ${newFileName}`)
        } catch (e) {
          console.error(`❌ Error renombrando archivo ${file}:`, e)
        }
      }
    }
  }

  console.log(`\n🎉 Migración completada. Ahora puedes usar: /admin/cursos/${NEW_ID}/modulos`)
}

main().catch(console.error)

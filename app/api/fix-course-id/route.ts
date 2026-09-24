import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const supabase = createAdminClient();
    const OLD_ID = "3";
    const NEW_ID = "seguridad-social";

    // 1. Rename files in filesystem first
    const diplomadosDir = path.join(process.cwd(), "diplomados");
    let logs = [];

    if (fs.existsSync(diplomadosDir)) {
      const oldJsonPath = path.join(diplomadosDir, `exams_${OLD_ID}.json`);
      if (fs.existsSync(oldJsonPath)) {
        fs.renameSync(oldJsonPath, path.join(diplomadosDir, `exams_${NEW_ID}.json`));
        logs.push(`Renamed exams_${OLD_ID}.json to exams_${NEW_ID}.json`);
      }

      const files = fs.readdirSync(diplomadosDir);
      for (const file of files) {
        if (file.endsWith(`- ${OLD_ID}.pdf`)) {
          const newFile = file.replace(`- ${OLD_ID}.pdf`, `- ${NEW_ID}.pdf`);
          fs.renameSync(path.join(diplomadosDir, file), path.join(diplomadosDir, newFile));
          logs.push(`Renamed ${file} to ${newFile}`);
        }
      }
    }

    // 2. Clone the course and update foreign keys
    const { data: courseData, error: getErr } = await supabase
      .from('courses')
      .select('*')
      .eq('id', OLD_ID)
      .single();

    if (getErr || !courseData) {
      return NextResponse.json({ error: 'Curso original no encontrado' }, { status: 404 });
    }

    // Insert new course
    const newCourse = { ...courseData, id: NEW_ID };
    const { error: insertErr } = await supabase.from('courses').insert(newCourse);
    if (insertErr && insertErr.code !== '23505') { // Ignore unique violation if it already exists
      return NextResponse.json({ error: `Error creando nuevo curso: ${insertErr.message}` }, { status: 500 });
    }

    // Update related tables
    const tablesToUpdate = ['orders', 'enrollments', 'progress', 'study_acts'];
    for (const table of tablesToUpdate) {
      const { error: fkeyErr } = await supabase
        .from(table)
        .update({ course_id: NEW_ID })
        .eq('course_id', OLD_ID);
      
      if (fkeyErr) {
        logs.push(`Warning: No se pudo actualizar ${table}: ${fkeyErr.message}`);
      } else {
        logs.push(`Actualizado course_id en ${table}`);
      }
    }

    // Delete old course
    const { error: deleteErr } = await supabase.from('courses').delete().eq('id', OLD_ID);
    if (deleteErr) {
      logs.push(`Warning: No se pudo borrar el curso antiguo: ${deleteErr.message}`);
    } else {
      logs.push(`Curso antiguo '${OLD_ID}' eliminado.`);
    }

    return NextResponse.json({ 
      success: true, 
      message: `ID del curso actualizado exitosamente de '${OLD_ID}' a '${NEW_ID}'`,
      logs
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

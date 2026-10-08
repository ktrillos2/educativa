import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { createAdminClient } from "@/utils/supabase/admin"

export async function GET(request: Request) {
  const session = await getSession()
  if (!session || (session.role !== "admin" && session.role !== "ADMIN")) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const groupId = searchParams.get("groupId")
  const format = searchParams.get("format") || "csv" // 'csv', 'word', 'doc', 'json', 'html', 'pdf'

  if (!groupId) {
    return new NextResponse("Falta groupId", { status: 400 })
  }

  const supabase = createAdminClient()

  // 1. Validar que el grupo exista y obtener el curso
  const { data: group, error: groupError } = await supabase
    .from("course_groups")
    .select("id, name, course_id, registration_start, registration_end")
    .eq("id", groupId)
    .single()

  if (groupError || !group) {
    return new NextResponse("Grupo no encontrado", { status: 404 })
  }

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id, title, type")
    .eq("id", group.course_id)
    .single()

  if (courseError || !course) {
    return new NextResponse("Curso no encontrado", { status: 404 })
  }

  if (course.type !== "etdh") {
    return new NextResponse("Este grupo no pertenece a un programa académico ETDH", { status: 400 })
  }

  // 2. Obtener inscripciones del grupo (con fallback al curso completo si el group_id no se asignó explícitamente)
  let { data: enrollments, error: enrollError } = await supabase
    .from("enrollments")
    .select("user_id, created_at, group_id, payment_verified")
    .eq("group_id", groupId)

  if (enrollError) {
    return new NextResponse("Error obteniendo inscripciones", { status: 500 })
  }

  if (!enrollments || enrollments.length === 0) {
    // Si no hay inscripciones directamente asociadas a group_id, obtener todas las del curso
    const { data: courseEnrollments } = await supabase
      .from("enrollments")
      .select("user_id, created_at, group_id, payment_verified")
      .eq("course_id", group.course_id)

    if (courseEnrollments) {
      enrollments = courseEnrollments
    }
  }

  enrollments = enrollments || []

  const userIds = enrollments.map(e => e.user_id)
  
  // 3. Obtener usuarios (Ficha)
  let users: any[] = []
  if (userIds.length > 0) {
    const { data: uData } = await supabase
      .from("users")
      .select("id, name, document, email, phone, address")
      .in("id", userIds)
    if (uData) users = uData
  }

  // 4. Obtener study_acts (Diplomas y Actas)
  let studyActs: any[] = []
  if (userIds.length > 0) {
    const { data: acts } = await supabase
      .from("study_acts")
      .select("user_id, type, created_at")
      .eq("course_id", group.course_id)
      .in("user_id", userIds)
    if (acts) studyActs = acts
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No"
    return new Date(dateString).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    })
  }

  // Fecha de inicio del programa (Fecha del cohorte/grupo, no de inscripción)
  const programStartDate = formatDate(group.registration_start)

  // Estructurar datos unificados
  const studentRecords = enrollments.map((enrollment, index) => {
    const user = users.find(u => u.id === enrollment.user_id) || {}
    const actsForUser = studyActs.filter(a => a.user_id === enrollment.user_id)
    
    const diploma = actsForUser.find(a => a.type === "CERTIFICATE" || a.type === "DIPLOMA")
    const acta = actsForUser.find(a => a.type === "ACTA")

    // Fecha de certificación es la misma fecha del diploma (cuándo se certificó)
    const certificationDate = diploma ? formatDate(diploma.created_at) : "No certificado"

    return {
      index: index + 1,
      id: user.id || enrollment.user_id,
      name: user.name || "Sin Nombre",
      document: user.document || "No registrado",
      email: user.email || "No registrado",
      phone: user.phone || "No registrado",
      address: user.address || "No registrada",
      startDate: programStartDate, // Fecha de inicio del programa
      status: (enrollment as any).is_expired ? "Expirado" : (enrollment.payment_verified ? "Activo (Pagado)" : "Pendiente"),
      certificationDate: certificationDate, // Fecha de certificación
      actaDownloaded: acta ? "Sí" : "No",
      actaDate: formatDate(acta?.created_at),
    }
  })

  // 5. Retornar formato JSON si se solicita preview
  if (format === "json") {
    return NextResponse.json({
      success: true,
      course: course.title,
      group: group.name,
      registrationStart: programStartDate,
      registrationEnd: formatDate(group.registration_end),
      totalStudents: studentRecords.length,
      students: studentRecords
    })
  }

  const safeTitle = course.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()
  const safeGroupName = group.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()

  // 6. Retornar formato WORD (.doc)
  if (format === "word" || format === "doc") {
    const wordFilename = `Planilla_ETDH_${safeTitle}_${safeGroupName}.doc`

    const tableRowsHtml = studentRecords.map(s => `
      <tr>
        <td style="text-align: center; border: 1px solid #cbd5e1; padding: 6px;">${s.index}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px; font-weight: bold;">${s.name}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px;">${s.document}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px;">${s.email}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px;">${s.phone}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px;">${s.address}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px;">${s.startDate}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px;">${s.status}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">${s.certificationDate}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">${s.actaDownloaded} ${s.actaDate !== "No" ? `(${s.actaDate})` : ""}</td>
      </tr>
    `).join('')

    const currentYear = new Date().getFullYear()

    const wordContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Planilla ETDH - ${course.title}</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; margin: 20px; color: #1e293b; }
          h1 { color: #0f172a; font-size: 20px; margin-bottom: 4px; }
          h2 { color: #166534; font-size: 14px; margin-top: 0; font-weight: 600; }
          .header-box { background-color: #f1f5f9; padding: 12px; border-left: 4px solid #166534; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 11px; }
          th { background-color: #1e293b; color: #ffffff; padding: 8px; font-size: 11px; text-align: left; border: 1px solid #0f172a; }
          td { padding: 6px 8px; font-size: 11px; border: 1px solid #cbd5e1; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .footer { margin-top: 30px; font-size: 10px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header-box">
          <h1>PLANILLA DE ESTUDIANTES - PROGRAMA ETDH</h1>
          <h2>${course.title} — Cohorte: ${group.name}</h2>
          <p style="font-size: 11px; margin: 4px 0 0 0; color: #475569;">
            <strong>Fecha de Generación:</strong> ${new Date().toLocaleDateString('es-CO')} | <strong>Fecha de Inicio del Programa:</strong> ${programStartDate} | <strong>Total Estudiantes:</strong> ${studentRecords.length}
          </p>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 30px; text-align: center;">#</th>
              <th>Nombre Completo</th>
              <th>Documento (CC)</th>
              <th>Correo Electrónico</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Fecha de Inicio</th>
              <th>Estado</th>
              <th>Fecha de Certificación</th>
              <th>Acta Descargada</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml.length > 0 ? tableRowsHtml : '<tr><td colspan="10" style="text-align: center; padding: 15px; color: #64748b;">No hay estudiantes matriculados en este cohorte.</td></tr>'}
          </tbody>
        </table>

        <div class="footer">
          Desarrollado por K&T ♥ — ${currentYear} | https://www.kytcode.lat
        </div>
      </body>
      </html>
    `

    return new NextResponse(wordContent, {
      headers: {
        "Content-Type": "application/msword; charset=utf-8",
        "Content-Disposition": `attachment; filename="${wordFilename}"`
      }
    })
  }

  // 7. Retornar formato IMPRIMIBLE / PDF (HTML)
  if (format === "html" || format === "pdf") {
    const tableRowsHtml = studentRecords.map(s => `
      <tr>
        <td style="text-align: center; border: 1px solid #cbd5e1; padding: 6px;">${s.index}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px; font-weight: 600; color: #0f172a;">${s.name}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px;">${s.document}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px;">${s.email}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px;">${s.phone}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px;">${s.address}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px;">${s.startDate}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px;">${s.status}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">${s.certificationDate}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">${s.actaDownloaded} ${s.actaDate !== "No" ? `<br><small style="color: #64748b;">(${s.actaDate})</small>` : ""}</td>
      </tr>
    `).join('')

    const currentYear = new Date().getFullYear()

    const htmlPrint = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="utf-8">
        <title>Planilla ETDH - ${course.title}</title>
        <style>
          @media print {
            @page { size: landscape; margin: 10mm; }
            .no-print { display: none !important; }
          }
          body { font-family: system-ui, -apple-system, sans-serif; margin: 20px; color: #1e293b; background: #fff; }
          .header-box { background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 20px; }
          h1 { color: #0f172a; font-size: 22px; margin: 0 0 4px 0; }
          h2 { color: #15803d; font-size: 15px; margin: 0; font-weight: 600; }
          .btn-print { background: #166534; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th { background-color: #0f172a; color: #ffffff; padding: 8px 10px; font-size: 11px; text-align: left; }
          td { padding: 8px 10px; font-size: 11px; border: 1px solid #e2e8f0; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .footer { margin-top: 30px; font-size: 11px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 12px; }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 12px;">
          <button onclick="window.print()" class="btn-print">🖨️ Imprimir / Guardar como PDF</button>
        </div>
        <div class="header-box">
          <h1>PLANILLA DE ESTUDIANTES - FORMACIÓN ACADÉMICA ETDH</h1>
          <h2>${course.title} — Cohorte: ${group.name}</h2>
          <p style="font-size: 12px; margin: 6px 0 0 0; color: #475569;">
            <strong>Fecha de Generación:</strong> ${new Date().toLocaleDateString('es-CO')} | <strong>Fecha de Inicio:</strong> ${programStartDate} | <strong>Total Estudiantes Inscritos:</strong> ${studentRecords.length}
          </p>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 30px; text-align: center;">#</th>
              <th>Nombre Completo</th>
              <th>Documento (CC)</th>
              <th>Correo Electrónico</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Fecha de Inicio</th>
              <th>Estado</th>
              <th>Fecha de Certificación</th>
              <th>Acta Descargada</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml.length > 0 ? tableRowsHtml : '<tr><td colspan="10" style="text-align: center; padding: 20px; color: #64748b;">No hay estudiantes matriculados en este cohorte.</td></tr>'}
          </tbody>
        </table>

        <div class="footer">
          <a href="https://www.kytcode.lat" target="_blank" style="text-decoration: none; color: inherit;">
            Desarrollado por K&T <span style="color: #000;">♥</span> — ${currentYear}
          </a>
        </div>

        <script>
          if (window.location.search.includes('format=pdf')) {
            setTimeout(() => { window.print(); }, 500);
          }
        </script>
      </body>
      </html>
    `

    return new NextResponse(htmlPrint, {
      headers: {
        "Content-Type": "text/html; charset=utf-8"
      }
    })
  }

  // 8. Formato CSV por defecto (Excel)
  const headers = [
    "#",
    "Nombre Completo",
    "Documento (CC)",
    "Correo",
    "Teléfono",
    "Dirección",
    "Fecha de Inicio",
    "Estado",
    "Fecha de Certificación",
    "Acta Descargada",
    "Fecha de Acta"
  ]

  const rows = studentRecords.map(s => [
    `"${s.index}"`,
    `"${s.name.replace(/"/g, '""')}"`,
    `"${s.document.replace(/"/g, '""')}"`,
    `"${s.email.replace(/"/g, '""')}"`,
    `"${s.phone.replace(/"/g, '""')}"`,
    `"${s.address.replace(/"/g, '""')}"`,
    `"${s.startDate}"`,
    `"${s.status}"`,
    `"${s.certificationDate}"`,
    `"${s.actaDownloaded}"`,
    `"${s.actaDate}"`
  ].join(","))

  const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n")

  const csvFilename = `Planilla_${safeTitle}_${safeGroupName}.csv`

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${csvFilename}"`
    }
  })
}

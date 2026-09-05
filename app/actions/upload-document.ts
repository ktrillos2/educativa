"use server"

import { createClient } from "@/utils/supabase/server"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function uploadIdDocument(formData: FormData) {
    const session = await getSession()
    if (!session?.userId) {
        return { success: false, error: "No autorizado" }
    }

    const file = formData.get("file") as File
    if (!file) {
        return { success: false, error: "No se proporcionó ningún archivo" }
    }

    // Validar tipo de archivo
    if (file.type !== "application/pdf") {
        return { success: false, error: "El documento debe ser un archivo PDF" }
    }

    // Validar tamaño máximo (ej. 5MB)
    const MAX_SIZE = 5 * 1024 * 1024
    if (file.size > MAX_SIZE) {
        return { success: false, error: "El archivo no debe pesar más de 5MB" }
    }

    try {
        const supabase = await createClient()
        
        // Nombrar el archivo de forma única para este usuario
        // Al usar upsert: true, si el usuario vuelve a subirlo, se sobrescribirá su cédula anterior
        const filePath = `${session.userId}/cedula.pdf`

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("user_documents")
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: true,
                contentType: "application/pdf"
            })

        if (uploadError) {
            console.error("Error uploading to storage:", uploadError)
            return { success: false, error: "Error al subir el archivo al servidor." }
        }

        // Obtener la URL pública (asumiendo que el bucket es público, o generar SignedUrl si es privado)
        const { data: { publicUrl } } = supabase.storage
            .from("user_documents")
            .getPublicUrl(filePath)

        // Forzar un parámetro de cache-busting en caso de actualización para evitar que el navegador cachee el viejo PDF
        const finalUrl = `${publicUrl}?t=${Date.now()}`

        // Actualizar el perfil del usuario en la base de datos
        const { error: updateError } = await supabase
            .from("users")
            .update({ id_document_url: finalUrl })
            .eq("id", session.userId)

        if (updateError) {
            console.error("Error updating user record:", updateError)
            return { success: false, error: "Documento subido, pero falló el registro en base de datos." }
        }

        // Revalidar las rutas de los certificados para refrescar el acceso
        // Lo ideal sería invalidar rutas específicas, pero podemos confiar en que la UI manejará el estado local
        // o revalidar layouts si es necesario
        
        return { success: true, url: finalUrl }
    } catch (err) {
        console.error("Unexpected error in uploadIdDocument:", err)
        return { success: false, error: "Error inesperado al procesar el archivo" }
    }
}

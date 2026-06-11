import { getSession } from "@/lib/auth"
import { createAdminClient } from "@/utils/supabase/admin"
import { Users, Mail, Phone, Calendar } from "lucide-react"

export default async function AdminUsuariosPage() {
  const session = await getSession()
  const supabase = createAdminClient()

  const { data: users } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[oklch(0.25_0.10_145)]">Gestión de Usuarios</h1>
        <p className="text-[oklch(0.55_0.04_145)] text-sm">Administra los estudiantes y roles de la plataforma.</p>
      </div>

      <div className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[oklch(0.97_0.01_145)] border-b border-[oklch(0.88_0.04_145)]">
              <tr>
                <th className="px-6 py-4 font-semibold text-[oklch(0.40_0.08_145)]">Nombre y Documento</th>
                <th className="px-6 py-4 font-semibold text-[oklch(0.40_0.08_145)]">Contacto</th>
                <th className="px-6 py-4 font-semibold text-[oklch(0.40_0.08_145)]">Rol</th>
                <th className="px-6 py-4 font-semibold text-[oklch(0.40_0.08_145)]">Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[oklch(0.94_0.01_145)]">
              {users?.map((u) => (
                <tr key={u.id} className="hover:bg-[oklch(0.98_0.01_145)] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-[oklch(0.25_0.10_145)]">{u.name}</p>
                    <p className="text-xs text-[oklch(0.55_0.04_145)] mt-0.5">CC: {u.document || 'N/A'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-[oklch(0.45_0.08_145)] mb-1">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{u.email}</span>
                    </div>
                    {u.phone && (
                      <div className="flex items-center gap-1.5 text-[oklch(0.45_0.08_145)] text-xs">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{u.phone}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      u.role === 'admin' 
                        ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                        : 'bg-green-100 text-green-800 border border-green-200'
                    }`}>
                      {u.role || 'user'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[oklch(0.45_0.08_145)]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(u.created_at).toLocaleDateString("es-CO")}
                    </div>
                  </td>
                </tr>
              ))}
              {(!users || users.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-[oklch(0.55_0.04_145)]">
                    No hay usuarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { registerAction, loginAction } from "@/app/actions/auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const registerSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    document: z.string().min(5, "El documento es requerido"),
    phone: z.string().min(7, "El teléfono es requerido"),
    email: z.string().email("Correo electrónico inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

const loginSchema = z.object({
    email: z.string().email("Correo electrónico inválido"),
    password: z.string().min(1, "La contraseña es requerida"),
})

export function EnrollmentDialog({ courseId, courseName }: { courseId: string; courseName: string }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("register")
    const router = useRouter()

    const registerForm = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: "", document: "", phone: "", email: "", password: "" },
    })

    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    })

    async function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
        setLoading(true)
        const result = await registerAction(values, courseId)
        setLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Inscripción exitosa")
            setOpen(false)
            router.refresh()
        }
    }

    async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
        setLoading(true)
        const result = await loginAction(values)
        setLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Inicio de sesión exitoso. Ahora puedes inscribirte o ver tus cursos.")
            // Ideally here we also enroll the user if they aren't enrolled yet.
            // For now, we just close the dialog and refresh.
            setOpen(false)
            router.refresh()
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="w-full sm:w-auto font-bold text-lg bg-secondary hover:bg-secondary/90 text-white">
                    Inscribirse al Diplomado
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Inscripción a {courseName}</DialogTitle>
                    <DialogDescription>
                        Completa tus datos o inicia sesión para acceder al contenido del diplomado.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="register" onValueChange={setActiveTab} value={activeTab}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="register">Crear Cuenta</TabsTrigger>
                        <TabsTrigger value="login">Ya tengo cuenta</TabsTrigger>
                    </TabsList>

                    <TabsContent value="register">
                        <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre Completo</Label>
                                <Input id="name" {...registerForm.register("name")} placeholder="Juan Pérez" />
                                {registerForm.formState.errors.name && <p className="text-xs text-red-500">{registerForm.formState.errors.name.message}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="document">Documento</Label>
                                    <Input id="document" {...registerForm.register("document")} placeholder="123456789" />
                                    {registerForm.formState.errors.document && <p className="text-xs text-red-500">{registerForm.formState.errors.document.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Celular</Label>
                                    <Input id="phone" {...registerForm.register("phone")} placeholder="3001234567" />
                                    {registerForm.formState.errors.phone && <p className="text-xs text-red-500">{registerForm.formState.errors.phone.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input id="email" type="email" {...registerForm.register("email")} placeholder="juan@ejemplo.com" />
                                {registerForm.formState.errors.email && <p className="text-xs text-red-500">{registerForm.formState.errors.email.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input id="password" type="password" {...registerForm.register("password")} />
                                {registerForm.formState.errors.password && <p className="text-xs text-red-500">{registerForm.formState.errors.password.message}</p>}
                            </div>

                            <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-white" disabled={loading}>
                                {loading ? "Procesando..." : "Completar Inscripción"}
                            </Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="login">
                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="login-email">Correo Electrónico</Label>
                                <Input id="login-email" type="email" {...loginForm.register("email")} />
                                {loginForm.formState.errors.email && <p className="text-xs text-red-500">{loginForm.formState.errors.email.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="login-password">Contraseña</Label>
                                <Input id="login-password" type="password" {...loginForm.register("password")} />
                                {loginForm.formState.errors.password && <p className="text-xs text-red-500">{loginForm.formState.errors.password.message}</p>}
                            </div>
                            <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-white" disabled={loading}>
                                {loading ? "Procesando..." : "Iniciar Sesión"}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

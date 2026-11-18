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
    address: z.string().min(3, "La dirección es requerida"),
    email: z.string().email("Correo electrónico inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirma tu contraseña"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
})

const loginSchema = z.object({
    email: z.string().email("Correo electrónico inválido"),
    password: z.string().min(1, "La contraseña es requerida"),
})

export function EnrollmentDialog({ courseId, courseName, price }: { courseId: string; courseName: string; price?: string | number }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("register")
    const router = useRouter()

    const registerForm = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: "", document: "", phone: "", address: "", email: "", password: "", confirmPassword: "" },
    })

    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    })

    async function triggerCheckout() {
        let numericPrice = 350000
        if (typeof price === 'number' && price > 0) {
            numericPrice = price
        } else if (typeof price === 'string' && price.trim()) {
            const cleanDigits = price.replace(/[^0-9]/g, '')
            if (cleanDigits) {
                const parsed = parseInt(cleanDigits, 10)
                if (!isNaN(parsed) && parsed > 0) {
                    numericPrice = parsed
                }
            }
        }

        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseId,
                    programName: courseName,
                    amount: numericPrice
                })
            })

            const data = await res.json()
            if (data.success && data.checkoutUrl) {
                toast.loading("Redirigiendo a la pasarela de pagos...")
                window.location.href = data.checkoutUrl
            } else {
                toast.error(data.error || "No se pudo generar el enlace de pago.")
                router.push("/estudiante")
            }
        } catch (err: any) {
            toast.error(err.message || "Error al procesar el pago")
            router.push("/estudiante")
        }
    }

    async function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
        setLoading(true)
        const { confirmPassword: _, ...dataToSend } = values
        const result = await registerAction(dataToSend, courseId)

        if (result.error) {
            toast.error(result.error)
            setLoading(false)
        } else {
            toast.success("¡Registro exitoso! Redirigiendo al pago...")
            await triggerCheckout()
        }
    }

    async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
        setLoading(true)
        const result = await loginAction(values)

        if (result.error) {
            toast.error(result.error)
            setLoading(false)
        } else {
            toast.success("Sesión iniciada. Redirigiendo al pago...")
            await triggerCheckout()
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" size="lg" onClick={() => router.prefetch('/estudiante')} className="w-full sm:w-auto font-bold text-xs sm:text-base text-white whitespace-normal py-3 h-auto leading-tight">
                    Inscribirse al Diplomado
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[460px] max-h-[90vh] overflow-y-auto">
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

                            {/* Nombre Completo */}
                            <div className="space-y-2">
                                <Label htmlFor="reg-name">Nombre Completo</Label>
                                <Input id="reg-name" {...registerForm.register("name")} placeholder="Juan Pérez" disabled={loading} />
                                {registerForm.formState.errors.name && <p className="text-xs text-red-500">{registerForm.formState.errors.name.message}</p>}
                            </div>

                            {/* Documento */}
                            <div className="space-y-2">
                                <Label htmlFor="reg-document">Documento de Identidad (Cédula)</Label>
                                <Input id="reg-document" {...registerForm.register("document")} placeholder="12345678" disabled={loading} />
                                {registerForm.formState.errors.document && <p className="text-xs text-red-500">{registerForm.formState.errors.document.message}</p>}
                            </div>

                            {/* Teléfono */}
                            <div className="space-y-2">
                                <Label htmlFor="reg-phone">Número de Teléfono</Label>
                                <Input id="reg-phone" type="tel" {...registerForm.register("phone")} placeholder="3001234567" disabled={loading} />
                                {registerForm.formState.errors.phone && <p className="text-xs text-red-500">{registerForm.formState.errors.phone.message}</p>}
                            </div>

                            {/* Dirección */}
                            <div className="space-y-2">
                                <Label htmlFor="reg-address">Dirección de Residencia</Label>
                                <Input id="reg-address" {...registerForm.register("address")} placeholder="Calle 123 # 45-67, Ciudad" disabled={loading} />
                                {registerForm.formState.errors.address && <p className="text-xs text-red-500">{registerForm.formState.errors.address.message}</p>}
                            </div>

                            {/* Correo */}
                            <div className="space-y-2">
                                <Label htmlFor="reg-email">Correo Electrónico</Label>
                                <Input id="reg-email" type="email" {...registerForm.register("email")} placeholder="nombre@ejemplo.com" disabled={loading} />
                                {registerForm.formState.errors.email && <p className="text-xs text-red-500">{registerForm.formState.errors.email.message}</p>}
                            </div>

                            {/* Contraseña */}
                            <div className="space-y-2">
                                <Label htmlFor="reg-password">Contraseña (Mínimo 6 caracteres)</Label>
                                <Input id="reg-password" type="password" {...registerForm.register("password")} disabled={loading} />
                                {registerForm.formState.errors.password && <p className="text-xs text-red-500">{registerForm.formState.errors.password.message}</p>}
                            </div>

                            {/* Confirmar Contraseña */}
                            <div className="space-y-2">
                                <Label htmlFor="reg-confirm-password">Confirmar Contraseña</Label>
                                <Input id="reg-confirm-password" type="password" {...registerForm.register("confirmPassword")} disabled={loading} />
                                {registerForm.formState.errors.confirmPassword && <p className="text-xs text-red-500">{registerForm.formState.errors.confirmPassword.message}</p>}
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
                                <Input id="login-email" type="email" {...loginForm.register("email")} placeholder="nombre@ejemplo.com" disabled={loading} />
                                {loginForm.formState.errors.email && <p className="text-xs text-red-500">{loginForm.formState.errors.email.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="login-password">Contraseña</Label>
                                <Input id="login-password" type="password" {...loginForm.register("password")} disabled={loading} />
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

"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Lock, Mail } from "@/components/ui/icons"
import { loginAction } from "@/app/actions/auth"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Precarga ambas rutas en cuanto el usuario empieza a escribir
  const handlePrefetch = () => {
    router.prefetch("/admin")
    router.prefetch("/estudiante")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error("Por favor, completa todos los campos")
      return
    }

    setIsLoading(true)
    try {
      const res = await loginAction({ email, password })
      if (res?.error) {
        toast.error(res.error)
        setIsLoading(false)
      } else if (res?.success) {
        // Navegar de inmediato sin esperar toast para máxima velocidad
        if (res.role === 'admin') {
          router.push("/admin")
        } else {
          router.push("/estudiante")
        }
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado. Inténtalo de nuevo.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 md:p-8 animate-fade-in pt-32">
      <Card className="w-full max-w-md shadow-lg border-muted-foreground/10 animate-fade-up">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  placeholder="nombre@ejemplo.com"
                  type="email"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={handlePrefetch}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link
                  href="#"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={handlePrefetch}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">Recordar mi dispositivo</Label>
            </div>
            <Button className="w-full" size="lg" type="submit" disabled={isLoading}>
              {isLoading ? "Ingresando..." : "Ingresar"}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col space-y-2 mt-2">
          <div className="text-center text-sm text-muted-foreground w-full">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Regístrate ahora
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

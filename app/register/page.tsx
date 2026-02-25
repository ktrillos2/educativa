import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Lock } from "@/components/ui/icons"

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 md:p-8 animate-fade-in">
            <Card className="w-full max-w-md shadow-lg border-muted-foreground/10 animate-fade-up">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">Crear Cuenta</CardTitle>
                    <CardDescription>
                        Ingresa tus datos para registrarte en la plataforma
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre Completo</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="name"
                                placeholder="Juan Pérez"
                                className="pl-9"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                placeholder="nombre@ejemplo.com"
                                type="email"
                                className="pl-9"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                className="pl-9"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="confirm-password"
                                type="password"
                                className="pl-9"
                            />
                        </div>
                    </div>
                    <Button className="w-full" size="lg">
                        Registrarse
                    </Button>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2 mt-2">
                    <div className="text-center text-sm text-muted-foreground w-full">
                        ¿Ya tienes una cuenta?{" "}
                        <Link href="/login" className="font-semibold text-primary hover:underline">
                            Inicia sesión
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

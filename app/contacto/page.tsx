"use client"

import { motion } from "framer-motion"
import { Breadcrumb } from "@/components/breadcrumb"
import { MapPin, Phone, Mail, Clock3, Send, CheckCircle } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export const metadata = {
    title: "Contacto - Academia de Formación Líderes del Mérito",
    description: "Contáctanos para más información sobre nuestros programas académicos, inscripciones y alianzas institucionales.",
}

// Reusable animation variants
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
}

export default function ContactoPage() {
    return (
        <main className="flex-grow bg-muted/20">

            {/* Contact Header */}
            <section className="pt-16 pb-24 bg-gradient-to-br from-primary via-primary/95 to-primary/90 relative overflow-hidden text-white">
                <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.png')] bg-repeat" />
                <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl pt-8">
                    <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                        <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Contacto" }]} />
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mt-8 mb-6 tracking-tight leading-tight">
                            ¿En qué podemos ayudarte?
                        </h1>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
                            Estamos aquí para resolver tus dudas y orientarte en la mejor decisión para tu futuro profesional. No dudes en comunicarte con nosotros.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Content Area */}
            <section className="py-20 relative">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-border/50 -mt-32 relative z-20 flex flex-col lg:flex-row">

                        {/* Contact Info Sidebar */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-primary text-white p-10 lg:w-2/5 flex flex-col justify-between relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-2">Información de Contacto</h3>
                                <p className="text-white/80 mb-10 text-sm">Contáctanos directamente mediante nuestros canales oficiales de atención al estudiante.</p>

                                <div className="space-y-8">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-secondary/20 p-3 rounded-xl text-secondary mt-1">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-lg">Nuestra Sede</h4>
                                            <p className="text-white/70 text-sm mt-1 leading-relaxed">Edificio Empresarial Centro<br />Oficina 402<br />Bogotá, Colombia</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-secondary/20 p-3 rounded-xl text-secondary mt-1">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-lg">Llámanos</h4>
                                            <p className="text-white/70 text-sm mt-1 leading-relaxed">+57 (300) 123 4567<br />+57 (601) 987 6543</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-secondary/20 p-3 rounded-xl text-secondary mt-1">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-lg">Escríbenos</h4>
                                            <p className="text-white/70 text-sm mt-1 leading-relaxed">contacto@lideresdelmerito.edu.co<br />admisiones@lideresdelmerito.edu.co</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-secondary/20 p-3 rounded-xl text-secondary mt-1">
                                            <Clock3 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-lg">Horario de Atención</h4>
                                            <p className="text-white/70 text-sm mt-1 leading-relaxed">Lunes a Viernes: 8:00 AM - 6:00 PM<br />Sábados: 9:00 AM - 1:00 PM</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-16 relative z-10 flex gap-4">
                                {/* Social Placeholders */}
                                {["facebook", "instagram", "linkedin", "twitter"].map((social) => (
                                    <a key={social} href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-secondary flex items-center justify-center transition-colors">
                                        <span className="sr-only">{social}</span>
                                        <div className="w-4 h-4 rounded-sm bg-white/80" />
                                    </a>
                                ))}
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="p-10 lg:w-3/5"
                        >
                            <h3 className="text-3xl font-extrabold text-foreground mb-2">Envíanos un mensaje</h3>
                            <p className="text-muted-foreground mb-8">Completa el formulario y un asesor académico se pondrá en contacto contigo lo antes posible.</p>

                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-semibold text-foreground">Nombre Completo</label>
                                        <Input id="name" placeholder="Ej. Juan Pérez" className="h-12 bg-muted/30 border-muted focus-visible:ring-primary/20 rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-semibold text-foreground">Correo Electrónico</label>
                                        <Input id="email" type="email" placeholder="ejemplo@correo.com" className="h-12 bg-muted/30 border-muted focus-visible:ring-primary/20 rounded-xl" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="text-sm font-semibold text-foreground">Teléfono Móvil</label>
                                        <Input id="phone" placeholder="+57 --- --- --" className="h-12 bg-muted/30 border-muted focus-visible:ring-primary/20 rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="subject" className="text-sm font-semibold text-foreground">Asunto</label>
                                        <Input id="subject" placeholder="Ej. Información sobre diplomados" className="h-12 bg-muted/30 border-muted focus-visible:ring-primary/20 rounded-xl" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-semibold text-foreground">Mensaje</label>
                                    <Textarea id="message" placeholder="¿Cómo podemos ayudarte?" className="min-h-[150px] bg-muted/30 border-muted focus-visible:ring-primary/20 rounded-xl resize-none" />
                                </div>

                                <div className="pt-2">
                                    <Button type="submit" size="lg" className="w-full sm:w-auto h-14 px-8 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 font-bold group">
                                        <span className="flex items-center gap-2">
                                            <Send className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                                            Enviar Mensaje Privado
                                        </span>
                                    </Button>
                                </div>

                                <p className="text-xs text-muted-foreground mt-4 text-center sm:text-left flex items-center justify-center sm:justify-start gap-1">
                                    <CheckCircle className="w-3 h-3 text-secondary" />
                                    Tus datos están protegidos y no serán compartidos con terceros.
                                </p>
                            </form>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="h-96 w-full bg-muted relative">
                {/* Placeholder for iframe Google Maps */}
                <div className="absolute inset-0 bg-secondary/5 flex items-center justify-center">
                    <div className="text-center">
                        <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground font-medium">Integración de Google Maps</p>
                    </div>
                </div>
            </section>
        </main>
    )
}

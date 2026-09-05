"use client"

import { motion } from "framer-motion"
import { Breadcrumb } from "@/components/breadcrumb"
import { MapPin, Phone, Mail, Clock3, Send, CheckCircle, Facebook, Instagram, Linkedin, Twitter } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"


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

            <section className="pt-[calc(6rem+1cm)] pb-[1cm] min-h-[50dvh] bg-gradient-to-br from-primary via-primary/95 to-primary/90 relative overflow-hidden text-white flex flex-col">
                <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.png')] bg-repeat" />
                <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl h-full flex flex-col justify-between flex-grow">
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} className="my-auto">
                        <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Contacto" }]} />
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mt-8 mb-6 tracking-tight leading-tight">
                            ¿En qué podemos ayudarte?
                        </h1>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
                            Estamos aquí para resolver tus dudas y orientarte en la elección de programas de formación académica que fortalezcan tus conocimientos y habilidades. 
                            <span className="block font-bold mt-2 text-white">Comunícate con nosotros.</span>
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Content Area */}
            <section className="py-[1cm] min-h-[100dvh] relative flex flex-col">
                <div className="container mx-auto px-4 h-full flex flex-col justify-between flex-grow">
                    <div className="max-w-6xl w-full mx-auto bg-white rounded-none shadow-[8px_8px_0_0_#C5A059] overflow-hidden border-2 border-border relative z-20 flex flex-col lg:flex-row my-auto">

                        {/* Contact Info Sidebar */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-primary text-white p-8 lg:p-10 lg:w-2/5 flex flex-col justify-between relative overflow-hidden h-full"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-none blur-3xl -mr-20 -mt-20 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-none blur-3xl -ml-20 -mb-20 pointer-events-none" />

                            <div className="relative z-10 flex flex-col flex-grow">
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">Información de Contacto</h3>
                                    <p className="text-white/80 mb-8 text-sm">Contáctanos directamente mediante nuestros canales oficiales.</p>
                                </div>

                                <div className="space-y-6 flex-grow flex flex-col justify-center">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-secondary/20 p-3 rounded-none text-secondary">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-base">Nuestra Sede</h4>
                                            <p className="text-white/70 text-sm mt-1 leading-relaxed">CL 19E 18C 112<br />Barrio Guatapurí, Valledupar</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-secondary/20 p-3 rounded-none text-secondary">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-base">Llámanos</h4>
                                            <p className="text-white/70 text-sm mt-1 leading-relaxed">+57 (300) 123 4567<br />+57 (601) 987 6543</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-secondary/20 p-3 rounded-none text-secondary">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-base">Escríbenos</h4>
                                            <p className="text-white/70 text-sm mt-1 leading-relaxed">direccionacademica@lideresdelmerito.edu.co</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-secondary/20 p-3 rounded-none text-secondary">
                                            <Clock3 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-base">Horario de Atención</h4>
                                            <p className="text-white/70 text-sm mt-1 leading-relaxed">Lun - Vie: 8:00 am a 12:00 pm y de 2:00 pm a 6:00 pm</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 relative z-10 flex gap-4 pt-4 border-t border-white/10">
                                <a href="#" className="w-10 h-10 rounded-none bg-white/10 hover:bg-secondary flex items-center justify-center transition-colors">
                                    <span className="sr-only">facebook</span>
                                    <Facebook className="w-5 h-5 text-white" />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-none bg-white/10 hover:bg-secondary flex items-center justify-center transition-colors">
                                    <span className="sr-only">instagram</span>
                                    <Instagram className="w-5 h-5 text-white" />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-none bg-white/10 hover:bg-secondary flex items-center justify-center transition-colors">
                                    <span className="sr-only">linkedin</span>
                                    <Linkedin className="w-5 h-5 text-white" />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-none bg-white/10 hover:bg-secondary flex items-center justify-center transition-colors">
                                    <span className="sr-only">twitter</span>
                                    <Twitter className="w-5 h-5 text-white" />
                                </a>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="p-8 lg:p-10 lg:w-3/5 flex flex-col justify-between h-full"
                        >
                            <div>
                                <h3 className="text-3xl font-extrabold text-foreground mb-2">Envíanos un mensaje</h3>
                                <p className="text-muted-foreground text-sm mb-6">Completa el formulario y te contactaremos pronto.</p>
                            </div>

                            <form className="flex flex-col flex-grow justify-between" onSubmit={(e) => e.preventDefault()}>
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="text-sm font-semibold text-foreground">Nombre Completo</label>
                                            <Input id="name" placeholder="Ej. Juan Pérez" className="h-12 bg-muted/30 border-muted focus-visible:ring-primary/20 rounded-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-semibold text-foreground">Correo Electrónico</label>
                                            <Input id="email" type="email" placeholder="ejemplo@correo.com" className="h-12 bg-muted/30 border-muted focus-visible:ring-primary/20 rounded-none" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label htmlFor="phone" className="text-sm font-semibold text-foreground">Teléfono Móvil</label>
                                            <Input id="phone" placeholder="+57 --- --- --" className="h-12 bg-muted/30 border-muted focus-visible:ring-primary/20 rounded-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="subject" className="text-sm font-semibold text-foreground">Asunto</label>
                                            <Input id="subject" placeholder="Ej. Información sobre diplomados" className="h-12 bg-muted/30 border-muted focus-visible:ring-primary/20 rounded-none" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="message" className="text-sm font-semibold text-foreground">Mensaje</label>
                                        <Textarea id="message" placeholder="¿Cómo podemos ayudarte?" className="min-h-[120px] bg-muted/30 border-muted focus-visible:ring-primary/20 rounded-none resize-none" />
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-col gap-4">
                                    <Button type="submit" size="lg" className="w-full sm:w-auto h-14 px-8 bg-primary hover:bg-primary/90 text-white rounded-none shadow-[4px_4px_0_0_#C5A059] font-bold group">
                                        <span className="flex items-center gap-2">
                                            <Send className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                                            Enviar Mensaje
                                        </span>
                                    </Button>

                                    <p className="text-xs text-muted-foreground text-center sm:text-left flex items-center justify-center sm:justify-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-secondary" />
                                        Tus datos están protegidos y no serán compartidos.
                                    </p>
                                </div>
                            </form>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-[1cm] min-h-[100dvh] w-full bg-muted/20 relative flex flex-col">
                <div className="container mx-auto px-4 h-full flex flex-col justify-between flex-grow">
                    <div className="relative w-full flex-grow flex flex-col border-2 border-border shadow-[8px_8px_0_0_#C5A059] bg-white group overflow-hidden">
                        
                        {/* Map Header Bar */}
                        <div className="w-full bg-white border-b-2 border-border p-4 z-20 flex items-center justify-between relative">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary text-white rounded-none">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground text-lg leading-none uppercase tracking-wider">Sede Principal</h3>
                                    <p className="text-muted-foreground text-sm mt-1">Ubicación de nuestras instalaciones</p>
                                </div>
                            </div>
                            <div className="hidden sm:block px-4 py-2 bg-secondary text-primary font-bold text-sm uppercase tracking-widest border-2 border-primary shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                                Abierto Hoy
                            </div>
                        </div>

                        {/* Interactive Google Map Iframe */}
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127254.34685167733!2d-74.17094248550186!3d4.648283716912386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9bfd2da6cb29%3A0x239d63ce97e37608!2zQm9nb3TDoSwgQm9nb3Rh!5e0!3m2!1sen!2sco!4v1716503923985!5m2!1sen!2sco" 
                            className="w-full h-full flex-grow grayscale contrast-110 opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:contrast-100 transition-all duration-700 ease-in-out border-none" 
                            allowFullScreen 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Mapa de Ubicación"
                        />
                    </div>
                </div>
            </section>
        </main>
    )
}

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BookOpen, CheckCircle2, MousePointerClick } from "lucide-react"

interface ProgramInfoDialogProps {
  type: "diplomados" | "etdh"
}

export function ProgramInfoDialog({ type }: ProgramInfoDialogProps) {
  const isDiplomado = type === "diplomados"
  
  const title = isDiplomado ? "Programa de Formación Académica" : "Programas de Educación para el Trabajo"
  
  return (
    <div className="w-full mb-12 flex justify-center">
      <Dialog>
        <DialogTrigger className="flex items-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground font-bold rounded-md hover:bg-secondary/90 transition-all shadow-xl hover:scale-105 active:scale-95 text-lg">
          {isDiplomado ? "¿Por qué cursar nuestros Diplomados?" : "¿Por qué cursar nuestros programas ETDH?"}
          <MousePointerClick className="w-6 h-6 ml-2 animate-pulse" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-4xl md:max-w-5xl lg:max-w-[1000px] w-11/12 bg-white text-slate-800 p-0 overflow-hidden border-none rounded-sm shadow-2xl">
          <DialogHeader className="bg-white p-6 text-center border-b shadow-sm">
            <div className="text-yellow-600 font-bold uppercase tracking-widest text-lg md:text-xl mb-1">
              ¡El Mérito es Tuyo!
            </div>
            <DialogTitle className="text-xl md:text-2xl font-black uppercase text-green-900">
              {title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="px-4 py-4 md:px-8 md:py-6 max-h-[75vh] overflow-y-auto custom-scrollbar bg-gray-50/50">
            {isDiplomado ? <DiplomadosContent /> : <ETDHContent />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SectionHeader({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`bg-[#0a4d2e] border-l-4 border-l-yellow-500 text-white font-bold px-4 py-2 uppercase mb-4 shadow-sm text-sm tracking-wider ${className || 'mt-6'}`}>
      {children}
    </div>
  )
}

function DiplomadosContent() {
  return (
    <div className="space-y-4 text-justify leading-relaxed text-[15px] text-slate-700 w-full">
      <SectionHeader className="mt-0">¿POR QUÉ CURSAR EL PROGRAMA?</SectionHeader>
      <p>
        El manejo del presupuesto público es una competencia directamente relacionada con la planeación, ejecución y control de los recursos del Estado. Conocer cómo se programan los ingresos y gastos, cómo se ejecutan las apropiaciones presupuestales, cuáles son los controles aplicables y qué responsabilidades asumen los servidores públicos, permite comprender mejor el funcionamiento financiero de las entidades estatales.
      </p>
      <p>
        El <strong>Diplomado en Presupuesto Público</strong> de la Academia de Formación Líderes del Mérito S.A.S. está orientado a servidores públicos, contratistas, profesionales, técnicos, tecnólogos, estudiantes y ciudadanos interesados en fortalecer conocimientos aplicables a la administración pública.
      </p>

      <SectionHeader>FORTALEZCA SU HOJA DE VIDA</SectionHeader>
      <p>
        La formación complementaria relacionada directamente con las funciones de un empleo puede aportar valor al perfil profesional, especialmente para quienes trabajan o desean vincularse a áreas como presupuesto, hacienda pública, contratación, control interno, planeación, tesorería, contabilidad pública, gestión administrativa o control fiscal.
      </p>
      <p>
        Contar con formación específica en presupuesto público permite acreditar actualización académica en un área estrechamente vinculada con la gestión estatal y demuestra interés por mantener y ampliar las competencias necesarias para desempeñarse en el sector público.
      </p>

      <SectionHeader>PUEDE APORTAR EN LA VALORACIÓN DE ANTECEDENTES DE PROCESOS DE SELECCIÓN</SectionHeader>
      <p>
        En los concursos de mérito y procesos de selección de la Comisión Nacional del Servicio Civil – CNSC, la valoración de antecedentes se realiza conforme al Acuerdo, Anexo Técnico y reglas particulares de cada convocatoria.
      </p>
      <p>
        Cuando una convocatoria reconoce dentro de la educación adicional la educación informal, formación complementaria o cursos relacionados con las funciones del empleo, un certificado que cumpla las condiciones establecidas en esas reglas puede ser objeto de valoración y otorgar puntaje, según la intensidad horaria, relación temática, fecha, límites y demás criterios determinados para el proceso.
      </p>
      <p>
        Por esta razón, realizar formación relacionada con el empleo al cual se aspira puede convertirse en una decisión estratégica para construir anticipadamente una hoja de vida más sólida.
      </p>
      
      <div className="bg-yellow-50 border border-yellow-300 p-4 mt-4 text-sm text-yellow-900 rounded-sm shadow-sm">
        <strong>Importante:</strong> La Academia no garantiza puntajes ni resultados en concursos. El reconocimiento depende exclusivamente de las reglas de cada convocatoria y de la validación efectuada por la autoridad u operador competente.
      </div>

      <SectionHeader>¿QUÉ CONOCIMIENTOS PUEDE FORTALECER?</SectionHeader>
      <p className="mb-4">Durante el diplomado, el participante aborda contenidos relacionados con:</p>
      <ul className="space-y-4">
        {[
          <span><strong>Presupuesto público y marco presupuestal.</strong> Comprensión de los conceptos, principios y disposiciones que orientan la gestión presupuestal de las entidades públicas.</span>,
          <span><strong>Ingresos y gastos públicos.</strong> Identificación de las fuentes de financiación, clasificación del gasto y estructura presupuestal.</span>,
          <span><strong>Liquidación y ejecución presupuestal.</strong> Apropiaciones, disponibilidad presupuestal, compromisos, obligaciones, pagos y registros asociados a la ejecución del gasto.</span>,
          <span><strong>Modificaciones presupuestales.</strong> Adiciones, reducciones, créditos, contracréditos, traslados y demás operaciones que pueden presentarse durante la ejecución.</span>,
          <span><strong>Saneamiento fiscal y límites del gasto.</strong> Análisis de disposiciones relacionadas con los gastos de funcionamiento y sostenibilidad de las entidades territoriales.</span>,
          <span><strong>Control y seguimiento presupuestal.</strong> Control interno, control fiscal, control político, seguimiento financiero, responsabilidades e informes presupuestales.</span>
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <SectionHeader>FORMACIÓN ORIENTADA A SITUACIONES DE LA ADMINISTRACIÓN PÚBLICA</SectionHeader>
      <p>
        La propuesta académica busca que el participante no memorice únicamente conceptos. Los contenidos pueden trabajarse mediante casos hipotéticos contextualizados en entidades públicas, análisis de situaciones presupuestales, interpretación de normas, ejercicios de ejecución del gasto y evaluación de decisiones propias de la gestión pública.
      </p>
      <p>
        Este enfoque resulta especialmente útil para quienes se preparan para procesos de selección por mérito, debido a que las evaluaciones de competencias suelen exigir la aplicación del conocimiento a situaciones concretas.
      </p>

      <SectionHeader>¿A QUIÉN ESTÁ DIRIGIDO?</SectionHeader>
      <p className="mb-4">El diplomado resulta pertinente para personas que:</p>
      <ul className="space-y-2 mb-4">
        {[
          "Aspiran a empleos públicos mediante concursos de mérito.",
          "Actualmente ejercen funciones en entidades estatales.",
          "Trabajan como contratistas del Estado.",
          "Desarrollan actividades relacionadas con presupuesto, contabilidad, tesorería, planeación, contratación o control interno.",
          "Buscan fortalecer su hoja de vida con formación relacionada con gestión pública.",
          "Desean comprender de manera aplicada el manejo de los recursos públicos."
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4">
        La preparación académica puede realizarse desde ahora. Cuando llegue una oportunidad laboral, contar previamente con formación relacionada con el empleo puede marcar una diferencia en la acreditación de su trayectoria académica, siempre dentro de las reglas establecidas para cada proceso.
      </p>

      <SectionHeader>REQUISITOS DE INGRESO</SectionHeader>
      <p>
        Contar con acceso a Internet y a un computador o dispositivo compatible, manejo básico de correo electrónico, herramientas ofimáticas y navegadores web, y realizar el pago de los derechos de matrícula establecidos por la Academia de Formación Líderes del Mérito S.A.S.
      </p>
    </div>
  )
}

function ETDHContent() {
  return (
    <div className="space-y-4 text-justify leading-relaxed text-[15px] text-slate-700 w-full">
      <SectionHeader className="mt-0">¿POR QUÉ CURSAR EL PROGRAMA?</SectionHeader>
      <p>
        La <strong>Educación para el Trabajo y el Desarrollo Humano (ETDH)</strong> es un pilar fundamental en la construcción de perfiles laborales altamente competitivos. Orientada a la adquisición de competencias específicas, destrezas prácticas y conocimientos técnicos, esta formación permite una rápida y efectiva inserción en el mercado laboral y el fortalecimiento del sector productivo y público.
      </p>
      <p>
        Nuestros programas técnicos laborales de la Academia de Formación Líderes del Mérito S.A.S. están diseñados para responder a las necesidades reales del entorno, preparando a los estudiantes para asumir retos operativos, administrativos y técnicos con excelencia.
      </p>

      <SectionHeader>FORTALEZCA SU HOJA DE VIDA</SectionHeader>
      <p>
        Contar con un título de técnico laboral certifica formalmente que usted posee las competencias necesarias para desempeñar oficios y ocupaciones altamente demandados. Esto representa una ventaja competitiva inmediata en los procesos de contratación, demostrando no solo conocimientos teóricos, sino también habilidades prácticas listas para ser aplicadas en el entorno laboral.
      </p>

      <SectionHeader>PUEDE APORTAR EN LA VALORACIÓN DE ANTECEDENTES DE PROCESOS DE SELECCIÓN</SectionHeader>
      <p>
        En los concursos de mérito y procesos de selección del Estado, la formación para el trabajo y el desarrollo humano cuenta con un marco de reconocimiento formal.
      </p>
      <p>
        Dependiendo de los requisitos específicos de cada convocatoria y del manual específico de funciones, los títulos de ETDH pueden ser valorados para el cumplimiento de requisitos mínimos en empleos de nivel técnico o asistencial, o para otorgar puntaje adicional en la fase de valoración de antecedentes, posicionando al aspirante con mayor ventaja competitiva.
      </p>
      
      <div className="bg-yellow-50 border border-yellow-300 p-4 mt-4 text-sm text-yellow-900 rounded-sm shadow-sm">
        <strong>Importante:</strong> La Academia no garantiza puntajes ni resultados en concursos. El reconocimiento depende exclusivamente de las reglas de cada convocatoria y de la validación efectuada por la autoridad u operador competente.
      </div>

      <SectionHeader>¿QUÉ CONOCIMIENTOS PUEDE FORTALECER?</SectionHeader>
      <p className="mb-4">A través de nuestros programas ETDH, el estudiante desarrolla:</p>
      <ul className="space-y-4">
        {[
          <span><strong>Habilidades Técnicas Especializadas.</strong> Dominio de herramientas, normativas y procedimientos específicos de su área de estudio.</span>,
          <span><strong>Competencias Transversales.</strong> Liderazgo, trabajo en equipo, resolución de conflictos y comunicación asertiva en entornos laborales.</span>,
          <span><strong>Criterio Práctico.</strong> Capacidad para resolver problemas operativos diarios, optimizar procesos y aplicar el conocimiento teórico a situaciones del mundo real.</span>,
          <span><strong>Adaptabilidad Tecnológica.</strong> Manejo de software y plataformas requeridas en la gestión moderna de empresas y entidades del Estado.</span>
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <SectionHeader>FORMACIÓN ORIENTADA A LA PRÁCTICA</SectionHeader>
      <p>
        Nuestra metodología prioriza el aprendizaje aplicado. Los estudiantes participan en simulaciones, estudios de caso y prácticas que emulan los escenarios reales del sector público y privado, garantizando que al egresar tengan la confianza y destreza necesarias para ejercer sus funciones inmediatamente.
      </p>

      <SectionHeader>¿A QUIÉN ESTÁ DIRIGIDO?</SectionHeader>
      <p className="mb-4">Nuestros programas son ideales para:</p>
      <ul className="space-y-2 mb-4">
        {[
          "Jóvenes y adultos que buscan una rápida inserción al mercado laboral.",
          "Personas que desean formalizar y certificar conocimientos empíricos adquiridos con la experiencia.",
          "Aspirantes a cargos asistenciales y técnicos en el sector público mediante concursos de mérito.",
          "Trabajadores que buscan mejorar su perfil ocupacional para ascender en sus actuales empleos."
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <SectionHeader>REQUISITOS DE INGRESO</SectionHeader>
      <p>
        Haber cursado y aprobado la educación básica secundaria (noveno grado), presentar el documento de identidad, y cumplir con los procesos de admisión y pago de matrícula establecidos por la Academia de Formación Líderes del Mérito S.A.S.
      </p>
    </div>
  )
}

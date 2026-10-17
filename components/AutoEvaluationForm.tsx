"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Award, ArrowRight } from '@/components/ui/icons';

interface QuestionItem {
  id: string;
  text: string;
}
interface Section {
  id: string;
  title: string;
  items: QuestionItem[];
}

// -----------------------------------------------------------------------------
// Data (hard‑coded from the DOCX text). Only the statements are needed; the
// scale (1‑5 + N/A) is rendered automatically.
// -----------------------------------------------------------------------------
const sections: Section[] = [
  {
    id: 'claridad',
    title: '01. Claridad y pertinencia de los contenidos',
    items: [
      { id: 'c1', text: 'Los objetivos de aprendizaje están formulados de manera comprensible y se relacionan con el propósito del programa.' },
      { id: 'c2', text: 'Los contenidos responden a necesidades reales del ejercicio del control interno en entidades públicas colombianas.' },
      { id: 'c3', text: 'Los temas distinguen adecuadamente control interno, gestión del riesgo, auditoría interna y responsabilidades de gestión.' },
      { id: 'c4', text: 'Los ejemplos permiten aplicar los contenidos a procesos, procedimientos y servicios de la administración pública.' },
      { id: 'c5', text: 'Los contenidos incorporan referentes normativos y técnicos pertinentes, identificando su vigencia cuando corresponde.' },
    ],
  },
  {
    id: 'organizacion',
    title: '02. Organización del programa',
    items: [
      { id: 'o1', text: 'La estructura del programa presenta una secuencia lógica de módulos y temas.' },
      { id: 'o2', text: 'La carga académica prevista es coherente con los objetivos y la complejidad de los contenidos.' },
      { id: 'o3', text: 'El cronograma, las fechas de entrega y los criterios de evaluación se comunican desde el inicio.' },
      { id: 'o4', text: 'La distribución entre actividades teóricas y prácticas favorece un aprendizaje progresivo.' },
      { id: 'o5', text: 'La información sobre responsables, canales de comunicación y recursos está organizada y es fácil de localizar.' },
    ],
  },
  {
    id: 'cumplimiento',
    title: '03. Cumplimiento de la programación',
    items: [
      { id: 'cp1', text: 'Las sesiones se desarrollan en las fechas y horarios comunicados.' },
      { id: 'cp2', text: 'Los contenidos programados se abordan dentro de los tiempos previstos.' },
      { id: 'cp3', text: 'Las actividades y evaluaciones se habilitan y reciben conforme al cronograma.' },
      { id: 'cp4', text: 'Los cambios de agenda se informan oportunamente y con instrucciones claras.' },
      { id: 'cp5', text: 'El programa cumple la intensidad y los compromisos académicos anunciados.' },
    ],
  },
  {
    id: 'formador',
    title: '04. Dominio temático del formador',
    items: [
      { id: 'f1', text: 'El formador demuestra conocimiento del sistema de control interno y su relación con la gestión pública.' },
      { id: 'f2', text: 'Explica con solvencia la identificación, valoración y tratamiento de riesgos en procesos públicos.' },
      { id: 'f3', text: 'Distingue los roles y responsabilidades de la dirección, los líderes de procesos y la auditoría interna.' },
      { id: 'f4', text: 'Responde a preguntas con argumentos técnicos, ejemplos y referencias pertinentes.' },
      { id: 'f5', text: 'Reconoce límites, excepciones o actualizaciones normativas sin presentar opiniones como obligaciones legales.' },
    ],
  },
  {
    id: 'pertinencia',
    title: '05. Pertinencia de las actividades y evaluaciones',
    items: [
      { id: 'p1', text: 'Las actividades guardan relación directa con los resultados de aprendizaje definidos.' },
      { id: 'p2', text: 'Los ejercicios plantean problemas propios del control interno y la gestión pública.' },
      { id: 'p3', text: 'Las evaluaciones valoran aplicación, análisis y toma de decisiones, además de conocimientos conceptuales.' },
      { id: 'p4', text: 'Los criterios y rúbricas de calificación son conocidos antes de entregar los trabajos.' },
      { id: 'p5', text: 'Las actividades ofrecen oportunidades para identificar riesgos, proponer controles y sustentar hallazgos.' },
    ],
  },
  {
    id: 'plataforma',
    title: '06. Facilidad de utilización de la plataforma',
    items: [
      { id: 'pl1', text: 'El ingreso a la plataforma y a los módulos del programa es sencillo.' },
      { id: 'pl2', text: 'Los recursos, enlaces, grabaciones y actividades se encuentran con facilidad.' },
      { id: 'pl3', text: 'La plataforma permite entregar tareas y presentar evaluaciones sin dificultades recurrentes.' },
      { id: 'pl4', text: 'Las instrucciones para usar las herramientas virtuales son suficientes y comprensibles.' },
      { id: 'pl5', text: 'La plataforma funciona de manera aceptable desde los dispositivos y conexiones habituales de los participantes.' },
    ],
  },
  {
    id: 'atencion',
    title: '07. Atención académica, administrativa y tecnológica',
    items: [
      { id: 'at1', text: 'Las consultas académicas reciben respuestas pertinentes por los canales establecidos.' },
      { id: 'at2', text: 'Los trámites de inscripción, certificación y registro de resultados se gestionan con claridad.' },
      { id: 'at3', text: 'Las solicitudes administrativas se atienden dentro de plazos razonables y comunicados.' },
      { id: 'at4', text: 'Los incidentes técnicos cuentan con canales de reporte y seguimiento conocidos.' },
      { id: 'at5', text: 'La atención recibida es respetuosa, accesible y orientada a resolver las solicitudes.' },
    ],
  },
  {
    id: 'percepcion',
    title: '08. Percepción general sobre el cumplimiento de las expectativas de formación',
    items: [
      { id: 'per1', text: 'El programa ha cumplido los objetivos de aprendizaje anunciados al inicio.' },
      { id: 'per2', text: 'La formación responde a las expectativas profesionales que motivaron mi participación.' },
      { id: 'per3', text: 'Los conocimientos adquiridos son aplicables a responsabilidades o procesos de una entidad pública.' },
      { id: 'per4', text: 'La experiencia formativa corresponde con la información ofrecida antes de la matrícula o inscripción.' },
      { id: 'per5', text: 'En conjunto, considero satisfactorio el programa y recomendaría su realización a personas con necesidades similares.' },
    ],
  },
];

// -----------------------------------------------------------------------------
// Helper to calculate averages (admin view only)
// -----------------------------------------------------------------------------
const calculateResults = (answers: Record<string, number>) => {
  const dimensionAverages: Record<string, { count: number; sum: number }> = {};
  sections.forEach((sec) => {
    let count = 0;
    let sum = 0;
    sec.items.forEach((it) => {
      const value = answers[`${sec.id}_${it.id}`];
      if (value && value !== 0) {
        // 0 will be used for N/A
        count++;
        sum += value;
      }
    });
    dimensionAverages[sec.id] = { count, sum };
  });
  // overall average across all valid answers
  const total = Object.values(dimensionAverages).reduce(
    (acc, cur) => ({ count: acc.count + cur.count, sum: acc.sum + cur.sum }),
    { count: 0, sum: 0 },
  );
  const overall = total.count ? total.sum / total.count : 0;
  return { dimensionAverages, overall };
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
interface AutoEvaluationFormProps {
  programId?: string;
}

const AutoEvaluationForm: React.FC<AutoEvaluationFormProps> = ({ programId: propProgramId }) => {
  const params = useParams();
  const router = useRouter();
  const routeProgramId = params?.id ? decodeURIComponent(params.id as string) : '';
  const resolvedProgramId = propProgramId || routeProgramId;

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAnswers((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validación: verificar que cada ítem tenga respuesta seleccionada
    const allAnswered = sections.every((sec) =>
      sec.items.every((it) => answers[`${sec.id}_${it.id}`] !== undefined)
    );

    if (!allAnswered) {
      setError('Por favor, responda todas las preguntas antes de enviar. Si no tiene información suficiente sobre algún punto, seleccione N/A.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/admin/autoevaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programId: resolvedProgramId,
          answers,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'No se pudo guardar la evaluación.');
      }

      setSubmitted(true);
      router.refresh();
    } catch (err: any) {
      console.error('Error al enviar autoevaluación:', err);
      setError(err.message || 'Ocurrió un error al enviar las respuestas. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-green-200 p-8 md:p-12 text-center animate-fade-in">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
          ¡Autoevaluación Completada!
        </h2>
        <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
          Muchas gracias por tus aportes. Tu percepción es fundamental para el mejoramiento continuo de la calidad formativa de nuestros programas.
        </p>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 mb-8 text-emerald-800 text-sm">
          ✅ <strong>Requisito cumplido:</strong> Tu autoevaluación ha sido registrada satisfactoriamente. Ya tienes habilitado el acceso a tu certificado y acta de grado.
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href={`/formacion-academica/${resolvedProgramId}/certificado`}
            className="inline-flex items-center justify-center gap-2 bg-[#006838] hover:bg-[#00522c] text-white text-base font-bold px-8 py-3.5 rounded-lg shadow-md transition-all hover:shadow-lg"
          >
            <Award className="w-5 h-5" />
            Continuar y Generar mi Certificado
          </Link>
          <Link
            href={`/formacion-academica/${resolvedProgramId}`}
            className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-base font-semibold px-6 py-3.5 rounded-lg transition-colors"
          >
            Volver al Programa
          </Link>
        </div>
      </div>
    );
  }


  return (
    <section className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-10">
      <div className="border-b border-gray-200 pb-6 mb-8 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Instrumento de Percepción del Participante y Mejoramiento Continuo
        </h1>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          Valore cada afirmación de acuerdo con su experiencia en el programa. Marque una sola opción por ítem. Si no dispone de información suficiente, seleccione <strong>N/A</strong>.
        </p>
        <div className="mt-4 inline-flex flex-wrap gap-2 text-xs font-semibold bg-gray-100 text-gray-700 px-4 py-2 rounded-md">
          <span>Escala:</span>
          <span>1 = Totalmente en desacuerdo</span>
          <span>·</span>
          <span>2 = En desacuerdo</span>
          <span>·</span>
          <span>3 = Neutral</span>
          <span>·</span>
          <span>4 = De acuerdo</span>
          <span>·</span>
          <span>5 = Totalmente de acuerdo</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {sections.map((section, sIdx) => (
          <div key={section.id} className="border border-gray-200 rounded-lg p-5 md:p-6 bg-gray-50/50">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              {section.title}
            </h2>
            <div className="space-y-6">
              {section.items.map((item, iIdx) => {
                const fieldName = `${section.id}_${item.id}`;
                return (
                  <div key={item.id} className="bg-white p-4 rounded-md border border-gray-100 shadow-2xs">
                    <h3 className="text-sm md:text-base font-medium text-gray-800 mb-3">
                      {sIdx + 1}.{iIdx + 1} {item.text}
                    </h3>
                    <div className="flex flex-wrap gap-3 items-center">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <label
                          key={val}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm font-medium cursor-pointer transition-colors ${
                            answers[fieldName] === val
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <input
                            type="radio"
                            name={fieldName}
                            value={val}
                            checked={answers[fieldName] === val}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          {val}
                        </label>
                      ))}
                      <label
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm font-medium cursor-pointer transition-colors ${
                          answers[fieldName] === 0
                            ? 'bg-gray-700 text-white border-gray-700 shadow-xs'
                            : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name={fieldName}
                          value={0}
                          checked={answers[fieldName] === 0}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        N/A
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="pt-4 text-center">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-[#006838] hover:bg-[#00522c] text-white text-lg font-bold px-10 py-4 rounded-lg shadow-md transition-all hover:shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Guardando evaluación...' : 'Enviar Evaluación y Continuar'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AutoEvaluationForm;


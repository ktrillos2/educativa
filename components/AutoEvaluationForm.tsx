import React, { useState } from 'react';
import { useSession } from '@/lib/auth'; // assuming a hook similar to other pages

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
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
// Component
// -----------------------------------------------------------------------------
const AutoEvaluationForm: React.FC = () => {
  const { data: session } = useSession(); // session.role === 'admin' for admin view
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<ReturnType<typeof calculateResults> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAnswers((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // simple validation: every question must have a value (including 0 for N/A)
    const allAnswered = sections.every((sec) =>
      sec.items.every((it) => answers[`${sec.id}_${it.id}`] !== undefined),
    );
    if (!allAnswered) {
      alert('Por favor, responda todas las preguntas antes de enviar. Si no tiene información, seleccione N/A.');
      return;
    }
    const calc = calculateResults(answers);
    setResults(calc);
    setSubmitted(true);
    console.log('Respuestas de la auto‑evaluación:', answers);
  };

  return (
    <section className="auto-eval">
      <h1 className="title">Auto‑evaluación del programa</h1>
      <p className="intro">
        Valoré cada afirmación de acuerdo con su experiencia en el programa. Marque una sola opción por ítem. Si no dispone de información suficiente, seleccione N/A.
      </p>
      <form onSubmit={handleSubmit} className="eval-form">
        {sections.map((section) => (
          <div key={section.id} className="section-block">
            <h2 className="section-title">{section.title}</h2>
            {section.items.map((item) => {
              const fieldName = `${section.id}_${item.id}`;
              return (
                <div key={item.id} className="item-block">
                  <h3 className="item-text">{item.text}</h3>
                  <div className="options" role="radiogroup" aria-labelledby={fieldName}>
                    {[1, 2, 3, 4, 5].map((val) => (
                      <label key={val} className="option-label">
                        <input
                          type="radio"
                          name={fieldName}
                          value={val}
                          checked={answers[fieldName] === val}
                          onChange={handleChange}
                          required
                        />
                        {val}
                      </label>
                    ))}
                    <label className="option-label na-label">
                      <input
                        type="radio"
                        name={fieldName}
                        value={0}
                        checked={answers[fieldName] === 0}
                        onChange={handleChange}
                        required
                      />
                      N/A
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <button type="submit" className="submit-btn">
          Enviar evaluación
        </button>
      </form>

      {submitted && (
        <div className="post-submit">
          {session?.role === 'admin' && results ? (
            <div className="results-block">
              <h2>Resultados de la auto‑evaluación</h2>
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Dimensión</th>
                    <th>Respuestas válidas</th>
                    <th>Promedio (1‑5)</th>
                  </tr>
                </thead>
                <tbody>
                  {sections.map((sec) => {
                    const { count, sum } = results.dimensionAverages[sec.id];
                    const avg = count ? (sum / count).toFixed(2) : '-';
                    return (
                      <tr key={sec.id}>
                        <td>{sec.title}</td>
                        <td>{count}</td>
                        <td>{avg}</td>
                      </tr>
                    );
                  })}
                  <tr className="overall-row">
                    <td><strong>Resultado general</strong></td>
                    <td>{Object.values(results.dimensionAverages).reduce((a, b) => a + b.count, 0)}</td>
                    <td><strong>{results.overall.toFixed(2)}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p className="thank-you">¡Gracias por completar la auto‑evaluación!</p>
          )}
        </div>
      )}
    </section>
  );
};

export default AutoEvaluationForm;

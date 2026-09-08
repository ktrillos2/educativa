export interface Question {
    id: string
    question: string
    options: string[]
    correct: number
    feedbackCorrect?: string
    feedbackIncorrect?: string
}

export const FALLBACK_QUESTIONS: Question[] = [
    {
        id: "q1",
        question: "¿Cuál es el objetivo principal de este módulo?",
        options: ["Mejorar procesos", "Ignorar protocolos", "Aumentar gastos", "Ninguna de las anteriores"],
        correct: 0,
    },
    {
        id: "q2",
        question: "¿Qué herramienta es fundamental para el seguimiento?",
        options: ["Calculadora", "Software de Gestión", "Papel y lápiz", "Calendario físico"],
        correct: 1,
    },
    {
        id: "q3",
        question: "La normativa actual exige:",
        options: ["Reportes anuales", "No exige reportes", "Reportes mensuales", "Reportes diarios"],
        correct: 2,
    },
    {
        id: "q4",
        question: "¿Quién es el responsable directo de la implementación?",
        options: ["El cliente", "El proveedor", "El gerente de proyecto", "El becario"],
        correct: 2,
    },
    {
        id: "q5",
        question: "El éxito del proyecto se mide por:",
        options: ["Cantidad de horas", "Cumplimiento de KPIs", "Número de empleados", "Ninguna"],
        correct: 1,
    },
]

// EL SCRIPT INYECTARÁ COURSE_9_QUESTIONS AQUÍ
export const COURSE_9_QUESTIONS: Record<string, Question[]> = {
    "mod-1": [
        {
            "id": "m1-q1",
            "question": "La alcaldía prepara el anteproyecto de presupuesto para la próxima vigencia. El director financiero sostiene que basta con estimar ingresos y gastos, porque el Plan Financiero y el Plan Operativo Anual de Inversiones (POAI) pueden elaborarse después de que el concejo apruebe el presupuesto. La coordinación presupuestal debe emitir concepto. ¿Cuál recomendación se ajusta mejor a la estructura del Sistema Presupuestal?",
            "options": [
                "Formular únicamente el presupuesto anual y elaborar el Plan Financiero y el POAI durante la etapa de ejecución.",
                "Articular desde la programación el Plan Financiero, el POAI y el Presupuesto General o Anual, por ser componentes del Sistema Presupuestal.",
                "Sustituir el Plan Financiero por el Programa Anual Mensualizado de Caja (PAC), porque ambos cumplen la misma función.",
                "Preparar solamente el POAI y el presupuesto anual, porque el Plan Financiero no integra el Sistema Presupuestal."
            ],
            "correct": 1,
            "feedbackCorrect": "Fundamento normativo y técnico: Decreto 111 de 1996 (EOP), artículo 6, conforme al cuestionario y al Módulo 1: el Sistema Presupuestal está constituido por el Plan Financiero, el Plan Operativo Anual de Inversiones y el Presupuesto General o Anual.\n\nPor qué es correcta: La situación exige identificar que el presupuesto anual no opera como un instrumento aislado. La recomendación técnicamente consistente es integrar los tres componentes desde la programación.",
            "feedbackIncorrect": "Por qué no las demás: A y D excluyen componentes expresamente integrados al sistema. C confunde el Plan Financiero con el PAC, que cumple una función de programación de caja y no sustituye al Plan Financiero."
        },
        {
            "id": "m1-q2",
            "question": "Una secretaría de infraestructura solicita incluir en el proyecto de presupuesto una obra que no está prevista en el Plan de Desarrollo vigente. Existe disponibilidad estimada de recursos y el responsable del sector argumenta que la aprobación del presupuesto por el concejo sería suficiente para legitimar la inversión. ¿Qué actuación debería adoptar el equipo presupuestal antes de incorporar la obra?",
            "options": [
                "Incluirla de inmediato, porque la autorización presupuestal reemplaza la obligación de armonía con el Plan de Desarrollo.",
                "Incluirla siempre que se financie con ingresos de libre destinación, sin revisar los instrumentos de planeación.",
                "Revisar y ajustar la propuesta para que guarde concordancia con el Plan de Desarrollo y los instrumentos de planeación aplicables antes de presupuestarla.",
                "Presupuestarla provisionalmente y dejar la armonización con el Plan de Desarrollo para la fase de ejecución."
            ],
            "correct": 2,
            "feedbackCorrect": "Fundamento normativo y técnico: El cuestionario base vincula el principio de planificación con el artículo 346 de la Constitución y con el EOP. El Módulo 1 señala que el presupuesto debe guardar armonía con el Plan de Desarrollo y los instrumentos de planeación.\n\nPor qué es correcta: La existencia de recursos no elimina la exigencia de coherencia entre la programación presupuestal y las prioridades formalizadas en la planeación.",
            "feedbackIncorrect": "Por qué no las demás: A atribuye al presupuesto una autonomía que el principio de planificación niega. B confunde la fuente de financiación con la coherencia del gasto. D traslada indebidamente la armonización a una etapa posterior."
        },
        {
            "id": "m1-q3",
            "question": "Durante la ejecución presupuestal, una dependencia solicita pagar un servicio ya recibido. La tesorería dispone de efectivo suficiente, pero el gasto no figura dentro de las apropiaciones autorizadas. El ordenador del gasto propone efectuar el pago y “legalizarlo” posteriormente. ¿Cuál decisión se ajusta al principio de universalidad?",
            "options": [
                "Pagar de inmediato, porque la existencia de caja suficiente permite realizar gastos no apropiados.",
                "Cargar el pago a la apropiación más cercana por su objeto, aunque haya sido autorizada para una finalidad diferente.",
                "Autorizar el pago si el gasto pertenece al mismo sector administrativo de la dependencia solicitante.",
                "Abstenerse de ejecutar el gasto mientras no exista la correspondiente autorización o apropiación presupuestal conforme al marco aplicable."
            ],
            "correct": 3,
            "feedbackCorrect": "Fundamento normativo y técnico: El material aportado establece que ninguna autoridad puede efectuar gastos públicos que no figuren en el presupuesto.\n\nPor qué es correcta: Tener disponibilidad de caja no equivale a contar con autorización presupuestal. La situación evalúa la diferencia entre liquidez y apropiación.",
            "feedbackIncorrect": "Por qué no las demás: A convierte la existencia de efectivo en autorización de gasto. B permitiría usar una apropiación para una finalidad distinta. C introduce un criterio sectorial que no sustituye la exigencia presupuestal."
        },
        {
            "id": "m1-q4",
            "question": "La secretaría de hacienda propone que cada dependencia conserve en una “bolsa” separada una parte de los ingresos municipales de libre destinación y que esos recursos solo puedan utilizarse por la dependencia que los recibió. La medida limitaría su uso para atender otras apropiaciones autorizadas. ¿Cuál alternativa refleja mejor el principio de unidad de caja?",
            "options": [
                "Integrar los ingresos de libre destinación a la gestión común de tesorería para atender oportunamente las apropiaciones autorizadas.",
                "Mantener bolsas independientes por dependencia, porque cada una debe financiarse exclusivamente con los recursos que recaude.",
                "Destinar todos los ingresos de libre destinación únicamente a inversión, sin considerar las demás apropiaciones aprobadas.",
                "Distribuir los ingresos según el porcentaje recaudado por cada dependencia en la vigencia anterior, con independencia del presupuesto aprobado."
            ],
            "correct": 0,
            "feedbackCorrect": "Fundamento normativo y técnico: El Módulo 1 explica que, con el recaudo de las rentas y recursos de capital, se atiende el pago oportuno de las apropiaciones autorizadas, bajo el principio de unidad de caja.\n\nPor qué es correcta: El caso se refiere expresamente a ingresos de libre destinación y a una propuesta que fragmentaría innecesariamente su administración por dependencias.",
            "feedbackIncorrect": "Por qué no las demás: B transforma las dependencias en propietarias de los recursos recaudados. C restringe el uso a inversión sin sustento en el caso. D reemplaza la autorización presupuestal por un criterio histórico de recaudo."
        },
        {
            "id": "m1-q5",
            "question": "El concejo municipal estudia aprobar un único presupuesto que cubra desde el 1 de enero de 2027 hasta el 31 de diciembre de 2028. La propuesta se justifica en que varios proyectos del Plan de Desarrollo requieren más de un año para completarse. ¿Qué concepto corresponde emitir frente a esa propuesta?",
            "options": [
                "Aprobarla, porque los proyectos de inversión pueden extender automáticamente la vigencia del presupuesto.",
                "Aprobarla siempre que el Plan de Desarrollo cubra el mismo periodo de dos años.",
                "Rechazarla como presupuesto bienal, porque la vigencia presupuestal se circunscribe al año fiscal comprendido entre el 1 de enero y el 31 de diciembre.",
                "Aplicar la anualidad solo a los gastos de funcionamiento y mantener los ingresos autorizados por dos años."
            ],
            "correct": 2,
            "feedbackCorrect": "Fundamento normativo y técnico: El cuestionario base y el Módulo 1 señalan que la vigencia presupuestal comprende del 1 de enero al 31 de diciembre.\n\nPor qué es correcta: Que un proyecto tenga horizonte superior a un año no convierte el presupuesto anual en una autorización presupuestal de dos vigencias.",
            "feedbackIncorrect": "Por qué no las demás: A y B confunden la duración de proyectos o planes con la vigencia del presupuesto. D limita indebidamente la anualidad a una sola categoría de gasto."
        },
        {
            "id": "m1-q6",
            "question": "La junta directiva de una Empresa Industrial y Comercial del Estado del orden nacional decide conservar el 100 % de los excedentes de la vigencia para financiar su modernización. La gerencia sostiene que, por su naturaleza empresarial, puede definir autónomamente el destino total de esos recursos. Con base en el material del módulo, ¿cuál es la conclusión más adecuada?",
            "options": [
                "La decisión es válida porque los excedentes de una EICE son de libre disposición de su junta directiva.",
                "La entidad no puede disponer libremente de la totalidad de los excedentes: su distribución está sujeta a las directrices aplicables y a la decisión del CONPES sobre la cuantía a reintegrar, con el mínimo de reinversión señalado en el material.",
                "La EICE debe transferir obligatoriamente el 100 % de los excedentes al Tesoro, sin posibilidad de reinversión.",
                "La distribución de excedentes corresponde exclusivamente al revisor fiscal o al auditor externo de la entidad."
            ],
            "correct": 1,
            "feedbackCorrect": "Fundamento normativo y técnico: El cuestionario base y el Módulo 1 indican que los excedentes de las EICE del orden nacional están sujetos a directrices y a la definición del CONPES sobre la cuantía a reintegrar, señalando además el mínimo de reinversión trabajado en el material.\n\nPor qué es correcta: La autonomía de gestión de la empresa no equivale a libertad absoluta sobre los excedentes financieros cuando el régimen presupuestal establece reglas de distribución.",
            "feedbackIncorrect": "Por qué no las demás: A desconoce las reglas de distribución señaladas. C elimina toda posibilidad de reinversión y contradice el material. D atribuye la decisión a un órgano de control que no aparece como competente en el contenido evaluado."
        },
        {
            "id": "m1-q7",
            "question": "En el proyecto de presupuesto municipal se incluye, dentro de las disposiciones generales, un artículo que crea una nueva contribución temporal para financiar tecnología y, en el mismo texto, autoriza un gasto adicional no previsto en las apropiaciones. ¿Qué debería recomendar el equipo jurídico-presupuestal?",
            "options": [
                "Mantener el artículo, porque las disposiciones generales pueden regular cualquier asunto con impacto financiero.",
                "Mantenerlo si la contribución y el gasto solo rigen durante la misma vigencia fiscal.",
                "Mantenerlo si el alcalde y el concejo manifiestan conjuntamente su conveniencia.",
                "Retirarlo de las disposiciones generales, porque estas buscan asegurar la ejecución del presupuesto y no pueden crear nuevos impuestos ni ordenar nuevos gastos."
            ],
            "correct": 3,
            "feedbackCorrect": "Fundamento normativo y técnico: El material indica que las disposiciones generales buscan asegurar la correcta ejecución del Presupuesto General y que mediante ellas no se pueden crear nuevos impuestos ni ordenar nuevos gastos.\n\nPor qué es correcta: El artículo propuesto usa una sección instrumental del presupuesto para producir efectos que el propio marco del módulo excluye.",
            "feedbackIncorrect": "Por qué no las demás: A desconoce la finalidad limitada de las disposiciones generales. B no convierte en válida una materia prohibida por el hecho de ser temporal. C tampoco sustituye las restricciones materiales aplicables."
        },
        {
            "id": "m1-q8",
            "question": "A mitad de la vigencia, la tesorería advierte que el recaudo mensual será menor al previsto y propone modificar el Programa Anual Mensualizado de Caja (PAC) para reprogramar pagos. El equipo técnico pretende hacer el ajuste directamente para evitar demoras. ¿Cuál procedimiento se ajusta a las funciones del Comité de Hacienda o CONFIS descritas en el módulo?",
            "options": [
                "Someter la modificación del PAC a la aprobación del Comité de Hacienda o CONFIS, instancia que aprueba el PAC y autoriza sus modificaciones.",
                "Permitir que tesorería modifique el PAC de manera autónoma, porque se trata de un instrumento operativo.",
                "Solicitar la aprobación de la oficina de planeación, que reemplaza al Comité de Hacienda en materia de caja.",
                "Remitir la modificación a la Contraloría para que autorice directamente la reprogramación de pagos."
            ],
            "correct": 0,
            "feedbackCorrect": "Fundamento normativo y técnico: Entre las funciones del Comité de Hacienda o CONFIS desarrolladas en el Módulo 1 se encuentran aprobar el PAC y autorizar sus modificaciones.\n\nPor qué es correcta: La variación del recaudo puede justificar una reprogramación de caja, pero la decisión debe pasar por la instancia competente definida en el sistema presupuestal.",
            "feedbackIncorrect": "Por qué no las demás: B atribuye a tesorería una competencia decisoria que el material asigna al Comité. C confunde planeación con aprobación del PAC. D entrega a un órgano de control externo una función de administración presupuestal."
        },
        {
            "id": "m1-q9",
            "question": "En la discusión del anteproyecto se propone aumentar de manera considerable el presupuesto de rentas respecto de la vigencia anterior. Las proyecciones de crecimiento de la economía son mucho menores y el expediente no contiene análisis que explique la congruencia entre ambos comportamientos. ¿Qué principio exige revisar de forma más directa esa relación antes de recomendar la aprobación?",
            "options": [
                "Especialización, porque toda apropiación debe ejecutarse exclusivamente conforme a su finalidad.",
                "Unidad de caja, porque el crecimiento del presupuesto depende de que todos los ingresos se administren en una sola bolsa.",
                "Homeóstasis presupuestal, porque el crecimiento real del presupuesto de rentas debe guardar congruencia con el crecimiento de la economía para evitar desequilibrios.",
                "Anualidad, porque las estimaciones presupuestales solo pueden referirse a una vigencia fiscal."
            ],
            "correct": 2,
            "feedbackCorrect": "Fundamento normativo y técnico: El Módulo 1 define la homeóstasis presupuestal como la exigencia de que el crecimiento real del presupuesto de rentas guarde congruencia con el crecimiento de la economía, evitando desequilibrio económico.\n\nPor qué es correcta: El dato determinante del caso es la diferencia entre el crecimiento proyectado del presupuesto y el crecimiento económico.",
            "feedbackIncorrect": "Por qué no las demás: A se refiere al destino específico de las apropiaciones. B regula la administración de recursos en caja. D determina la duración de la vigencia, no la relación entre tasas de crecimiento."
        },
        {
            "id": "m1-q10",
            "question": "Una entidad formula un proyecto para ampliar una sede educativa. El presupuesto contempla la obra y los equipos, pero omite los gastos de funcionamiento indispensables para ponerla en operación, pese a que son previsibles y necesarios para que el proyecto cumpla su finalidad. ¿Qué ajuste responde al principio de programación integral?",
            "options": [
                "Mantener únicamente la inversión, porque los gastos de funcionamiento nunca deben relacionarse con un programa de inversión.",
                "Revisar el programa para contemplar simultáneamente los gastos de inversión y los gastos de funcionamiento que sean necesarios para su ejecución y operación.",
                "Trasladar todos los costos del proyecto al servicio de la deuda pública para evitar mezclar categorías de gasto.",
                "Aplicar el principio de unidad de caja y omitir cualquier estimación previa de los costos de funcionamiento."
            ],
            "correct": 1,
            "feedbackCorrect": "Fundamento normativo y técnico: El Módulo 1 señala que todo programa presupuestal debe contemplar simultáneamente los gastos de inversión y de funcionamiento que las exigencias técnicas y administrativas demanden para su ejecución y operación.\n\nPor qué es correcta: El proyecto está incompleto desde la perspectiva presupuestal si financia la infraestructura pero omite costos previsibles indispensables para que opere.",
            "feedbackIncorrect": "Por qué no las demás: A separa artificialmente inversión y funcionamiento. C reclasifica sin fundamento los costos como deuda. D invoca unidad de caja, que no resuelve la suficiencia integral del programa."
        }
    ],
    "mod-2": [
        {
            "id": "m2-q1",
            "question": "La comisión de presupuesto del concejo municipal anuncia que iniciará formalmente el trámite del presupuesto de la próxima vigencia, aunque el alcalde todavía no ha radicado el proyecto. Los concejales argumentan que, como corporación administrativa, pueden elaborar y presentar directamente el proyecto para evitar retrasos. ¿Cuál actuación se ajusta mejor a las reglas de iniciativa presupuestal?",
            "options": [
                "Permitir que la comisión presente el proyecto, siempre que la Secretaría de Hacienda certifique las cifras.",
                "Autorizar la presentación por parte de la Secretaría de Planeación, porque cualquier dependencia técnica puede ejercer la iniciativa.",
                "Esperar la presentación del proyecto por el alcalde, a quien corresponde la iniciativa presupuestal en el nivel municipal.",
                "Permitir que cualquier concejal radique el proyecto si obtiene previamente el respaldo de la mayoría de la corporación."
            ],
            "correct": 2,
            "feedbackCorrect": "Fundamento normativo y técnico: El cuestionario base establece que la iniciativa presupuestal en el nivel municipal corresponde al alcalde y que las modificaciones que requieran iniciativa o aval de la administración deben respetar esa competencia. La referencia principal suministrada es la Constitución Política y las reglas orgánicas territoriales desarrolladas en el Decreto 111 de 1996.\n\nPor qué es correcta: El problema central no es la capacidad técnica del concejo para estudiar cifras, sino quién puede iniciar formalmente el trámite del proyecto de presupuesto. La actuación adecuada es esperar la radicación por la autoridad que ejerce la iniciativa.",
            "feedbackIncorrect": "Por qué no las demás: A y B trasladan la iniciativa a órganos que no la tienen según el material base. D confunde la capacidad deliberativa del concejo con la facultad de presentar el proyecto."
        },
        {
            "id": "m2-q2",
            "question": "Durante el estudio del proyecto de presupuesto, un concejal propone incrementar de manera sustancial la apropiación para mantenimiento vial. La iniciativa no cuenta con concepto ni aceptación del gobierno municipal, pero el proponente sostiene que la mayoría del concejo puede disponer libremente de las partidas mientras el presupuesto se encuentre en debate. ¿Cuál decisión resulta más adecuada frente a la propuesta?",
            "options": [
                "Tramitar el incremento únicamente si cuenta con la aceptación o aprobación del gobierno municipal y se ajusta a las reglas orgánicas aplicables.",
                "Aprobar el incremento por mayoría simple, porque durante el debate el concejo tiene competencia plena para aumentar cualquier partida.",
                "Aprobarlo si se financia con ingresos de libre destinación, aunque el gobierno municipal no lo acepte.",
                "Rechazar cualquier modificación del concejo, incluso las reducciones o ajustes que estén permitidos por las reglas presupuestales."
            ],
            "correct": 0,
            "feedbackCorrect": "Fundamento normativo y técnico: El cuestionario base señala que el concejo no puede aumentar libremente las partidas presentadas por el alcalde y remite al Decreto 111 de 1996, artículo 63, para el trámite territorial de modificaciones que requieren aprobación del gobierno municipal.\n\nPor qué es correcta: La decisión propuesta altera el monto de una apropiación. El dato decisivo es que el incremento carece de aceptación del gobierno municipal, por lo que la mayoría del concejo no basta para hacerlo procedente.",
            "feedbackIncorrect": "Por qué no las demás: B atribuye autonomía absoluta al concejo. C convierte la naturaleza de la fuente en sustituto de la aprobación requerida. D es excesiva porque desconoce que existen modificaciones permitidas dentro de las reglas del trámite."
        },
        {
            "id": "m2-q3",
            "question": "A mitad de la vigencia, el municipio recibe recursos adicionales no previstos inicialmente y la administración desea destinarlos a un nuevo programa social. La Secretaría de Hacienda propone incorporarlos mediante una resolución interna para comenzar la ejecución de inmediato, sin acudir nuevamente al concejo. ¿Qué procedimiento se ajusta mejor a la modificación presupuestal descrita?",
            "options": [
                "Incorporar los recursos mediante resolución de tesorería, porque se trata de ingresos ya recibidos.",
                "Ejecutar el programa con cargo a cualquier apropiación disponible y formalizar la adición al cierre de la vigencia.",
                "Autorizar el gasto mediante un acta del Comité de Hacienda, sin modificar formalmente el presupuesto.",
                "Tramitar la adición o modificación mediante el instrumento presupuestal correspondiente, de iniciativa de la administración, identificando la fuente de financiación."
            ],
            "correct": 3,
            "feedbackCorrect": "Fundamento normativo y técnico: El cuestionario aportado indica que las adiciones o modificaciones requieren el trámite presupuestal correspondiente y deben expresar las fuentes de financiación o los contracréditos, dentro de los mecanismos previstos por el Decreto 111 de 1996.\n\nPor qué es correcta: Recibir recursos adicionales no autoriza por sí mismo su ejecución. Para convertirlos en capacidad legal de gasto deben incorporarse al presupuesto mediante el procedimiento formal aplicable.",
            "feedbackIncorrect": "Por qué no las demás: A confunde recaudo con apropiación. B permite ejecutar antes de modificar el presupuesto. C atribuye al Comité de Hacienda una decisión que no sustituye el acto presupuestal requerido."
        },
        {
            "id": "m2-q4",
            "question": "La Secretaría de Infraestructura pretende iniciar un proyecto de mejoramiento de una vía rural. Existe disponibilidad presupuestal, pero el proyecto no está inscrito ni viabilizado en el banco de programas y proyectos. El responsable sostiene que el Certificado de Disponibilidad Presupuestal (CDP) es suficiente para iniciar la contratación. ¿Cuál actuación es procedente antes de comprometer recursos de inversión?",
            "options": [
                "Iniciar la contratación con el CDP y registrar el proyecto en el banco únicamente antes del primer pago.",
                "Exigir la inscripción y viabilización del proyecto en el banco correspondiente y cumplir, además, los requisitos presupuestales previos como el CDP.",
                "Autorizar el proyecto si el alcalde lo declara prioritario, aun sin inscripción ni viabilidad técnica.",
                "Sustituir la inscripción en el banco por una certificación de disponibilidad de caja expedida por tesorería."
            ],
            "correct": 1,
            "feedbackCorrect": "Fundamento normativo y técnico: El cuestionario base establece que las erogaciones de inversión deben corresponder a proyectos inscritos y viabilizados y que, además, requieren los soportes presupuestales previos, entre ellos el CDP; remite al Decreto 111 de 1996, artículos 68 y siguientes.\n\nPor qué es correcta: El CDP acredita disponibilidad presupuestal, pero no sustituye la exigencia técnica y procedimental de que el proyecto de inversión esté incorporado y viabilizado en el banco correspondiente.",
            "feedbackIncorrect": "Por qué no las demás: A posterga un requisito previo. C reemplaza la viabilidad técnica por una decisión política. D confunde disponibilidad de caja con formulación y registro del proyecto."
        },
        {
            "id": "m2-q5",
            "question": "Por demoras internas, el alcalde no presenta el proyecto de presupuesto dentro del término legal. Cuando finalmente lo radica, la fecha prevista para su presentación ya ha vencido. El concejo consulta cuál presupuesto debe regir ante la falta de presentación oportuna. ¿Cuál consecuencia corresponde aplicar según el marco procedimental trabajado en el módulo?",
            "options": [
                "El concejo debe elaborar un presupuesto provisional con vigencia de tres meses.",
                "El presupuesto extemporáneo presentado por el alcalde entra a regir automáticamente sin debate.",
                "Rige el presupuesto del año anterior, conforme a la regla aplicable cuando el proyecto no se presenta oportunamente.",
                "La Secretaría de Hacienda puede prorrogar el presupuesto anterior solo para gastos de funcionamiento."
            ],
            "correct": 2,
            "feedbackCorrect": "Fundamento normativo y técnico: El cuestionario base señala como consecuencia de la falta de presentación oportuna que rige el presupuesto del año anterior y cita el Decreto 111 de 1996, artículo 64.\n\nPor qué es correcta: El supuesto pregunta por la consecuencia de incumplir el término de presentación, no por la falta de aprobación del concejo. El elemento decisivo es la extemporaneidad atribuible a la administración.",
            "feedbackIncorrect": "Por qué no las demás: A crea una figura no indicada en el material. B premia la radicación tardía con vigencia automática. D restringe sin sustento la repetición del presupuesto únicamente a funcionamiento."
        },
        {
            "id": "m2-q6",
            "question": "El concejo aprueba el presupuesto municipal. El alcalde formula objeciones porque considera que varias disposiciones pueden ser contrarias a la Constitución o a la ley. El concejo estudia las objeciones y decide insistir en el texto aprobado sin introducir cambios. ¿Qué actuación debe seguir frente a la controversia por posible ilegalidad?",
            "options": [
                "El alcalde debe sancionar de inmediato el presupuesto, porque la insistencia del concejo elimina cualquier control posterior.",
                "La controversia debe ser resuelta por el gobernador, como superior jerárquico del alcalde.",
                "El alcalde puede archivar definitivamente el presupuesto y ordenar la repetición automática del presupuesto anterior.",
                "El asunto debe remitirse al Tribunal Administrativo competente para que decida sobre las objeciones de ilegalidad o inconstitucionalidad."
            ],
            "correct": 3,
            "feedbackCorrect": "Fundamento normativo y técnico: El cuestionario base indica que, cuando el alcalde formula objeciones por ilegalidad o inconstitucionalidad y el concejo insiste, el asunto se remite al Tribunal Administrativo para decisión, con referencia a la Ley 136 de 1994 y al procedimiento presupuestal territorial.\n\nPor qué es correcta: La insistencia del concejo no elimina el conflicto jurídico. La controversia debe resolverse por la instancia judicial prevista en el procedimiento señalado por el material.",
            "feedbackIncorrect": "Por qué no las demás: A obliga a sancionar pese a la objeción jurídica. B atribuye la decisión al gobernador. C permite archivar unilateralmente un presupuesto ya aprobado por el concejo."
        },
        {
            "id": "m2-q7",
            "question": "El alcalde presentó oportunamente el proyecto de presupuesto, pero el periodo de sesiones concluye sin que el concejo lo haya expedido dentro del plazo previsto. La administración debe garantizar continuidad en la programación presupuestal de la siguiente vigencia. ¿Cuál solución se ajusta mejor al procedimiento señalado en el cuestionario base?",
            "options": [
                "Rige el proyecto presentado oportunamente por el alcalde y este puede adoptarlo mediante decreto, conforme a la regla aplicable.",
                "Se repite necesariamente el presupuesto del año anterior, aunque el alcalde lo haya presentado dentro del término.",
                "La administración debe operar sin presupuesto hasta que el concejo vuelva a sesionar y apruebe uno nuevo.",
                "La Secretaría de Hacienda puede adoptar un presupuesto provisional mediante resolución administrativa."
            ],
            "correct": 0,
            "feedbackCorrect": "Fundamento normativo y técnico: El cuestionario base diferencia este evento de la falta de presentación: si el concejo no expide oportunamente el presupuesto y el alcalde sí presentó el proyecto dentro del término, rige el presentado por la administración y se adopta por decreto, según la referencia al artículo 64 del Decreto 111 de 1996.\n\nPor qué es correcta: La presentación oportuna del alcalde activa una consecuencia diferente a la repetición del presupuesto anterior. El incumplimiento relevante, en este caso, corresponde a la falta de expedición por el concejo.",
            "feedbackIncorrect": "Por qué no las demás: B aplica la consecuencia prevista para otro supuesto. C impediría la continuidad presupuestal. D atribuye a la Secretaría de Hacienda una facultad de adopción que el material asigna al alcalde."
        },
        {
            "id": "m2-q8",
            "question": "Al revisar el anteproyecto presupuestal, la oficina de planeación detecta varios proyectos de inversión que cuentan con recursos estimados, pero no aparecen articulados con el Plan de Desarrollo. Un directivo propone mantenerlos porque considera que la disponibilidad financiera es suficiente para justificar su inclusión. ¿Cuál recomendación debe formular la oficina de planeación? Mantener los proyectos, porque la existencia de recursos prevalece sobre los instrumentos de planeación.",
            "options": [
                "Revisar y ajustar la programación para asegurar concordancia entre el presupuesto, el Plan de Desarrollo y los instrumentos anuales de inversión aplicables.",
                "Incluir los proyectos de manera provisional y exigir su incorporación al Plan de Desarrollo después de iniciar la ejecución.",
                "Excluir únicamente los proyectos financiados con crédito y conservar los que se paguen con ingresos corrientes."
            ],
            "correct": 1,
            "feedbackCorrect": "Fundamento normativo y técnico: El cuestionario base señala que el presupuesto debe articularse con el Plan de Desarrollo y el Plan Anual de Inversiones, con referencia a los artículos 339 y 315 de la Constitución y al Decreto 111 de 1996.\n\nPor qué es correcta: La suficiencia financiera no reemplaza la obligación de coherencia entre la programación del gasto y las prioridades formalizadas en la planeación pública.",
            "feedbackIncorrect": "Por qué no las demás: A convierte la disponibilidad de recursos en criterio único. C posterga una exigencia que debe verificarse antes de la ejecución. D introduce una distinción por fuente de financiación que no resuelve la falta de concordancia."
        },
        {
            "id": "m2-q9",
            "question": "El municipio recibe recursos del Sistema General de Participaciones (SGP). Para atender temporalmente gastos generales de la administración, el tesorero propone mezclarlos con los demás ingresos de libre destinación, utilizarlos durante algunos meses y reintegrarlos posteriormente, invocando el principio de unidad de caja. ¿Cuál decisión respeta mejor el régimen de estos recursos?",
            "options": [
                "Aceptar la propuesta, porque la unidad de caja permite utilizar transitoriamente cualquier ingreso para cualquier gasto autorizado.",
                "Permitir el uso temporal únicamente si existe autorización del concejo, aunque se cambie la destinación legal de los recursos.",
                "Mantener los recursos del SGP sujetos a su destinación específica y programarlos conforme a la ley, sin tratarlos como recursos de libre uso.",
                "Destinar libremente los recursos del SGP que no se ejecuten durante el primer semestre de la vigencia."
            ],
            "correct": 2,
            "feedbackCorrect": "Fundamento normativo y técnico: El cuestionario aportado indica que los recursos del Sistema General de Participaciones tienen destinación específica, son inembargables y deben programarse conforme a la Ley 715 de 2001; cita como referencias los artículos 18, 89 y 91.\n\nPor qué es correcta: La unidad de caja no puede invocarse para convertir recursos legalmente condicionados en ingresos de libre disposición. El uso propuesto altera temporalmente la destinación que el material reconoce como específica.",
            "feedbackIncorrect": "Por qué no las demás: A aplica la unidad de caja sin considerar la excepción material indicada. B supone que una autorización local puede sustituir la destinación legal. D crea una libertad de uso por el transcurso del semestre que no aparece en el marco suministrado."
        },
        {
            "id": "m2-q10",
            "question": "Usted integra el equipo técnico que prepara el Plan Operativo Anual de Inversiones (POAI) para la siguiente vigencia. Un integrante propone que el documento se limite a enumerar proyectos y metas cualitativas, dejando los costos, las fuentes de financiación y la programación de acciones para una fase posterior. ¿Cuál orientación técnica debe adoptar el equipo?",
            "options": [
                "Estructurar el POAI con los programas y proyectos priorizados, sus costos, asignación de recursos, fuentes de financiación y la programación o cronograma correspondiente.",
                "Limitar el POAI a una lista de proyectos, porque los costos solo pertenecen al presupuesto de gastos.",
                "Registrar únicamente metas cualitativas y definir las fuentes de financiación después de aprobado el presupuesto.",
                "Incluir exclusivamente proyectos financiados con recursos propios y excluir los que tengan cofinanciación."
            ],
            "correct": 0,
            "feedbackCorrect": "Fundamento normativo y técnico: El cuestionario base señala que la elaboración del POAI implica identificar programas o proyectos priorizados, costos, asignación de recursos, fuentes de financiación y cronograma, dentro del procedimiento del EOP y de los lineamientos del Plan Anual de Inversiones.\n\nPor qué es correcta: El POAI no es una simple lista de intenciones. Debe permitir traducir las prioridades de inversión de la vigencia en una programación financieramente sustentada y operativamente identificable.",
            "feedbackIncorrect": "Por qué no las demás: B omite la cuantificación financiera. C separa indebidamente metas y financiación. D excluye proyectos cofinanciados sin que el caso ni el material establezcan esa restricción."
        }
    ],
    "mod-3": [
        {
            "id": "m3-q1",
            "question": "El Concejo Municipal aprobó el presupuesto de la vigencia e introdujo varias modificaciones durante los debates. Antes de iniciar la ejecución, el alcalde solicita a la Secretaría de Hacienda consolidar el texto definitivo y dejar discriminado el gasto aprobado. ¿Cuál actuación corresponde a la fase de liquidación del presupuesto?",
            "options": [
                "Iniciar los pagos con base únicamente en el acuerdo aprobado, sin expedir un acto adicional.",
                "Crear nuevas apropiaciones para corregir las necesidades detectadas después de la aprobación.",
                "Expedir el decreto de liquidación e incorporar un anexo con la discriminación del gasto y las modificaciones aprobadas.",
                "Sustituir las modificaciones del concejo por las cifras inicialmente presentadas por la administración."
            ],
            "correct": 2,
            "feedbackCorrect": "Fundamento normativo y técnico: El cuestionario base indica que la liquidación consolida las modificaciones aprobadas, permite corregir errores y se formaliza mediante el decreto de liquidación acompañado del anexo del gasto. La fuente remitida relaciona este procedimiento con el Módulo 3, p. 2, y con el Estatuto Orgánico del Presupuesto.\n\nPor qué es correcta: El caso ocurre después de la aprobación y antes de la ejecución. La tarea requerida es convertir el presupuesto aprobado y modificado en el instrumento definitivo para su ejecución, preservando el detalle de las apropiaciones.",
            "feedbackIncorrect": "Por qué no las demás: A omite el acto formal de liquidación. B atribuye a esta fase la creación unilateral de nuevas apropiaciones. D desconoce las modificaciones aprobadas durante el trámite."
        },
        {
            "id": "m3-q2",
            "question": "Usted integra el equipo de Hacienda que prepara la presentación del presupuesto de gastos. Para ordenar la información, el equipo separa las apropiaciones en funcionamiento, servicio de la deuda e inversión y las organiza según la estructura presupuestal correspondiente. ¿Qué actividad está realizando principalmente el equipo?",
            "options": [
                "Estructurando la presentación del presupuesto de gastos conforme a sus categorías.",
                "Elaborando el Programa Anual Mensualizado de Caja para programar pagos.",
                "Aplicando una reducción presupuestal por menor expectativa de recaudo.",
                "Clasificando los ingresos corrientes y los recursos de capital."
            ],
            "correct": 0,
            "feedbackCorrect": "Fundamento normativo y técnico: El cuestionario aportado señala que la presentación de los gastos comprende categorías como funcionamiento, servicio de la deuda e inversión, además de los elementos de clasificación desarrollados en el Módulo 3, p. 3.\n\nPor qué es correcta: La actividad descrita consiste en ordenar y clasificar las apropiaciones del gasto. No se están programando pagos, reduciendo el presupuesto ni clasificando fuentes de ingreso.",
            "feedbackIncorrect": "Por qué no las demás: B corresponde a programación de caja. C supone una modificación por menor recaudo. D se refiere a la estructura de los ingresos, no de los gastos."
        },
        {
            "id": "m3-q3",
            "question": "Una dependencia solicita iniciar un proceso contractual. Antes de asumir cualquier compromiso, el responsable presupuestal verifica la apropiación disponible y expide el Certificado de Disponibilidad Presupuestal (CDP). Todavía no existe obligación causada ni pago. Según la secuencia de ejecución trabajada en el módulo, ¿en qué momento se encuentra la actuación?",
            "options": [
                "Pago, porque ya existe una afectación definitiva de caja.",
                "Obligación, porque la entidad ya recibió el bien o servicio.",
                "Perfeccionamiento, porque el registro de la obligación ya fue efectuado.",
                "Intención, porque la disponibilidad y el CDP anteceden al compromiso y a la obligación."
            ],
            "correct": 3,
            "feedbackCorrect": "Fundamento normativo y técnico: El cuestionario base ubica en la fase de intención las apropiaciones y el CDP antes de comprometer recursos, con referencia al Módulo 3, p. 13.\n\nPor qué es correcta: El supuesto termina antes de que exista una obligación o un pago. El dato decisivo es la expedición previa del CDP para verificar que exista apropiación disponible para el compromiso.",
            "feedbackIncorrect": "Por qué no las demás: A exige desembolso. B supone recepción del bien o servicio y reconocimiento de una obligación. C presupone un momento posterior al descrito."
        },
        {
            "id": "m3-q4",
            "question": "Durante la vigencia, una secretaría identifica que un rubro tiene saldo que ya no necesita, mientras otro rubro del mismo presupuesto resulta insuficiente. La administración pretende trasladar recursos entre ambos sin aumentar ni disminuir el valor total aprobado. ¿Qué modificación presupuestal describe mejor esta operación?",
            "options": [
                "Una adición presupuestal, porque aumenta la apropiación del rubro receptor.",
                "Un traslado mediante crédito y contracrédito, porque redistribuye apropiaciones sin variar el total del presupuesto.",
                "Una reducción presupuestal, porque disminuye el rubro que entrega recursos.",
                "Una reserva presupuestal, porque conserva los recursos para la siguiente vigencia."
            ],
            "correct": 1,
            "feedbackCorrect": "Fundamento normativo y técnico: El cuestionario base establece que los traslados permiten financiar apropiaciones nuevas o insuficientes mediante redistribución de recursos, sin modificar el valor total del presupuesto, con referencia al Módulo 3, p. 21.\n\nPor qué es correcta: Un rubro disminuye y otro aumenta por el mismo valor. Esa compensación interna mantiene inalterado el total autorizado, que es el rasgo distintivo del traslado planteado.",
            "feedbackIncorrect": "Por qué no las demás: A aumenta el total presupuestado. C disminuye el monto global. D se refiere a recursos comprometidos que no se pagan en la misma vigencia, situación distinta."
        },
        {
            "id": "m3-q5",
            "question": "A mitad del año, la Secretaría de Hacienda actualiza sus proyecciones y concluye que los recaudos serán sensiblemente inferiores a los previstos al aprobar el presupuesto. Mantener todas las apropiaciones pondría en riesgo el equilibrio financiero de la vigencia. ¿Cuál medida se ajusta al tratamiento previsto en el cuestionario base?",
            "options": [
                "Aprobar una adición presupuestal para compensar la caída del recaudo.",
                "Realizar únicamente un traslado interno entre rubros, sin modificar el monto global.",
                "Reducir el presupuesto mediante el mecanismo previsto para disminuir apropiaciones ante menores recaudos.",
                "Convertir automáticamente las apropiaciones no financiadas en reservas presupuestales."
            ],
            "correct": 0,
            "feedbackCorrect": "Fundamento normativo y técnico: El cuestionario aportado indica que la reducción procede cuando se prevén recaudos inferiores y cita los artículos 76 y 77 del Decreto 111 de 1996, además del Módulo 3, p. 20.\n\nPor qué es correcta: El problema no es redistribuir apropiaciones sino adecuar el nivel de gasto a una menor expectativa real de ingresos. Por eso se requiere disminuir el monto presupuestado.",
            "feedbackIncorrect": "Por qué no las demás: A incrementaría el presupuesto pese a la caída del recaudo. B mantiene el monto total y no resuelve la insuficiencia financiera. D confunde una medida de ajuste con la figura de reserva."
        },
        {
            "id": "m3-q6",
            "question": "Una ley autoriza un nuevo servicio público que no estaba contemplado al aprobarse el presupuesto. La entidad dispone de una fuente adicional de financiación y necesita crear la apropiación necesaria para poner en marcha el servicio durante la vigencia. ¿Qué actuación presupuestal corresponde?",
            "options": [
                "Tramitar una adición presupuestal para aumentar el monto autorizado y crear o completar la apropiación necesaria.",
                "Aplazar indefinidamente otras apropiaciones sin incorporar formalmente los nuevos recursos.",
                "Constituir una reserva presupuestal antes de que exista un compromiso legalmente asumido.",
                "Efectuar un contracrédito sin identificar una apropiación que pueda ser reducida."
            ],
            "correct": 0,
            "feedbackCorrect": "Fundamento normativo y técnico: Según el cuestionario base, las adiciones incrementan el monto total del presupuesto para completar apropiaciones o atender nuevos servicios autorizados, con referencia al Módulo 3, p. 20.\n\nPor qué es correcta: El servicio está autorizado, no fue contemplado inicialmente y existe una fuente adicional de financiación. La necesidad es incorporar capacidad presupuestal nueva, no redistribuir la existente.",
            "feedbackIncorrect": "Por qué no las demás: B no incorpora formalmente los nuevos recursos. C requiere un compromiso previo y cumple otra finalidad. D supone una disminución compensatoria de otra apropiación, dato que el caso no presenta."
        },
        {
            "id": "m3-q7",
            "question": "Una entidad contrató el mantenimiento de varios equipos. El proveedor cumplió la prestación, la dependencia recibió a satisfacción los servicios y el área financiera procede a reconocer y registrar formalmente el valor a cargo de la entidad. ¿En qué fase de ejecución presupuestal se encuentra esta actuación?",
            "options": [
                "Intención, porque apenas se verifica que exista apropiación disponible.",
                "Pago, porque el registro de la obligación equivale al desembolso.",
                "Perfeccionamiento, porque todavía no se ha recibido el bien o servicio.",
                "Obligación, porque la prestación ya fue recibida y se reconoce formalmente el valor exigible."
            ],
            "correct": 0,
            "feedbackCorrect": "Fundamento normativo y técnico: El cuestionario base señala que la fase de obligación comprende la recepción de bienes o servicios y el registro formal de la obligación, con referencia al Módulo 3, p. 13.\n\nPor qué es correcta: La prestación ya fue recibida a satisfacción y la entidad reconoce el valor exigible. Esos hechos sitúan el caso después del compromiso y antes del pago.",
            "feedbackIncorrect": "Por qué no las demás: A se ubica antes de comprometer recursos. B confunde reconocimiento con desembolso. C niega precisamente el hecho que el caso confirma: la prestación ya fue recibida."
        },
        {
            "id": "m3-q8",
            "question": "Al revisar la estructura del presupuesto de gastos, un analista debe ubicar la partida denominada “servicios personales asociados a la nómina”. La discusión no se refiere a un programa de inversión ni a una modificación del presupuesto. ¿A qué elemento de la estructura presupuestal corresponde esa denominación?",
            "options": [
                "A una fuente de financiación, porque identifica el origen de los recursos.",
                "Al objeto del gasto, porque especifica la naturaleza de la erogación.",
                "A un programa de inversión, porque toda remuneración se clasifica como inversión social.",
                "A un traslado presupuestal, porque redistribuye apropiaciones entre rubros."
            ],
            "correct": 0,
            "feedbackCorrect": "Fundamento normativo y técnico: El cuestionario aportado indica que el objeto del gasto detalla categorías como los servicios personales asociados a la nómina, con referencia al Módulo 3, p. 7.\n\nPor qué es correcta: La expresión describe la naturaleza concreta de la erogación. No identifica el origen del recurso, un proyecto de inversión ni una operación de modificación presupuestal.",
            "feedbackIncorrect": "Por qué no las demás: A clasifica fuentes de financiación. C confunde gasto de funcionamiento con inversión. D corresponde a una redistribución de apropiaciones y no a una categoría del gasto."
        },
        {
            "id": "m3-q9",
            "question": "Durante la vigencia, la entidad aprueba un ajuste que incrementa el monto total inicialmente autorizado por la corporación administrativa. El área contable propone registrarlo como una simple reclasificación interna. ¿Cómo debe entenderse la operación según el material evaluado?",
            "options": [
                "Como un acto ordinario de ejecución, porque no requiere alterar el presupuesto aprobado.",
                "Como un registro contable sin efectos presupuestales, porque solo cambia la forma de presentación.",
                "Como una modificación presupuestal, porque el ajuste incrementa valores parciales o el total previamente aprobado.",
                "Como una reserva presupuestal, porque traslada recursos de una vigencia a otra."
            ],
            "correct": 0,
            "feedbackCorrect": "Fundamento normativo y técnico: El cuestionario base define como modificaciones presupuestales los ajustes que incrementan valores parciales o el total aprobado, con referencia al Módulo 3, p. 18.\n\nPor qué es correcta: El ajuste altera el monto previamente autorizado. Por ello tiene efecto presupuestal sustantivo y no puede tratarse como una simple reclasificación contable.",
            "feedbackIncorrect": "Por qué no las demás: A desconoce que cambia el valor aprobado. B reduce la operación a un registro sin efecto presupuestal. D corresponde a una figura asociada a compromisos y vigencias, no al incremento descrito."
        },
        {
            "id": "m3-q10",
            "question": "Una obligación ya fue reconocida y registrada. Después de verificar los requisitos correspondientes, tesorería realiza el desembolso al beneficiario y registra la salida de recursos. ¿Qué momento de la ejecución presupuestal se está materializando?",
            "options": [
                "Pago, porque se efectúa el desembolso y se registra la cancelación de la obligación.",
                "Intención, porque apenas se reserva la apropiación mediante el CDP.",
                "Obligación, porque todavía no se ha realizado el desembolso.",
                "Perfeccionamiento, porque se está constituyendo el compromiso antes de recibir la prestación."
            ],
            "correct": 0,
            "feedbackCorrect": "Fundamento normativo y técnico: El cuestionario base ubica en la fase de pago el desembolso y el registro de los pagos, con referencia al Módulo 3, p. 14.\n\nPor qué es correcta: La obligación ya estaba reconocida y el hecho nuevo es la salida efectiva de recursos hacia el beneficiario. Ese evento corresponde al momento final de la secuencia descrita.",
            "feedbackIncorrect": "Por qué no las demás: B corresponde a una etapa previa vinculada al CDP. C ya ocurrió antes del desembolso. D describe un momento anterior al reconocimiento de la obligación."
        }
    ],
    "mod-4": [
        {
            "id": "m4-q1",
            "question": "La Secretaría de Hacienda de un municipio de categoría cuarta proyecta que, para la próxima vigencia, el 90 % de sus ingresos corrientes de libre destinación se destine a gastos de funcionamiento. El alcalde sostiene que el porcentaje puede mantenerse porque el presupuesto será aprobado por el concejo. ¿Cuál recomendación debe formular el equipo presupuestal?",
            "options": [
                "Mantener el 90 %, porque la autonomía territorial permite fijar libremente el porcentaje de funcionamiento.",
                "Trasladar contablemente el exceso a inversión sin modificar la naturaleza real del gasto.",
                "Ajustar el proyecto para que los gastos de funcionamiento respeten el límite máximo aplicable a los municipios de cuarta categoría.",
                "Aprobar el 90 % y efectuar la corrección únicamente al cierre de la vigencia si se presenta déficit."
            ],
            "correct": 2,
            "feedbackCorrect": "Fundamento normativo y técnico: El cuestionario base y el Módulo 4 señalan que la Ley 617 de 2000 fija límites máximos de gastos de funcionamiento según la categoría territorial; para los municipios de cuarta a sexta categoría, el material aportado identifica un límite del 80 %.\n\nPor qué es correcta: El caso plantea un porcentaje del 90 %, superior al límite indicado en el material. La respuesta adecuada es ajustar el proyecto antes de su ejecución para que la relación entre gastos de funcionamiento e ingresos corrientes de libre destinación se mantenga dentro del máximo permitido.",
            "feedbackIncorrect": "Por qué no las demás: A desconoce el límite legal; B altera la denominación sin corregir la naturaleza del gasto; D posterga una corrección que debe reflejarse en la programación o, cuando corresponda, en la ejecución presupuestal."
        },
        {
            "id": "m4-q2",
            "question": "Una gobernación realiza aportes periódicos al Fondo Nacional de Pensiones de las Entidades Territoriales (FONPET) y, al mismo tiempo, paga directamente mesadas pensionales a beneficiarios. En la preparación del indicador de gastos de funcionamiento surge discusión sobre el tratamiento de ambos conceptos. ¿Cuál clasificación se ajusta mejor al contenido trabajado en el módulo?",
            "options": [
                "Tanto los aportes al FONPET como las mesadas directas computan como gastos de funcionamiento.",
                "Las mesadas pensionales pagadas directamente computan como gastos de funcionamiento, mientras los aportes al FONPET no se computan como tales.",
                "Los aportes al FONPET computan como funcionamiento y las mesadas directas se registran exclusivamente como inversión.",
                "Ninguno de los dos conceptos tiene incidencia en el cálculo de los gastos de funcionamiento."
            ],
            "correct": 1,
            "feedbackCorrect": "Fundamento normativo y técnico: El material explica que los aportes al FONPET se orientan a provisionar el pasivo pensional y no computan como gastos de funcionamiento, mientras que los pagos directos de mesadas pensionales sí conservan esa naturaleza. Se cita la Ley 549 de 1999.\n\nPor qué es correcta: La diferencia está en el tratamiento presupuestal señalado para cada concepto: la provisión mediante FONPET no se computa como funcionamiento, pero el pago directo y periódico de mesadas sí.",
            "feedbackIncorrect": "Por qué no las demás: A equipara dos tratamientos que el módulo diferencia; C invierte la regla expuesta; D excluye indebidamente las mesadas directas del cálculo."
        },
        {
            "id": "m4-q3",
            "question": "Al preparar el proyecto de presupuesto, la administración municipal confirma que la vigencia anterior cerró con déficit fiscal. Un asesor propone omitirlo del nuevo presupuesto y manejarlo mediante un informe financiero separado para no afectar las apropiaciones del año siguiente. ¿Qué actuación corresponde según el tratamiento señalado en el material?",
            "options": [
                "Mantener el déficit por fuera del presupuesto y reconocerlo únicamente en la contabilidad patrimonial.",
                "Compensarlo con ingresos futuros sin crear una apropiación específica.",
                "Trasladarlo automáticamente a una reserva presupuestal, aunque no provenga de compromisos legalmente constituidos.",
                "Incluir en el presupuesto la partida necesaria para saldar el déficit conforme al marco orgánico aplicable."
            ],
            "correct": 3,
            "feedbackCorrect": "Fundamento normativo y técnico: El cuestionario base remite al artículo 46 del Decreto 111 de 1996 y al tratamiento del déficit previsto en la Ley 617 de 2000, según el cual debe incorporarse en el nuevo presupuesto la partida necesaria para saldarlo.\n\nPor qué es correcta: El déficit no puede quedar como un simple dato extracontable cuando el marco presupuestal exige prever su saneamiento en la vigencia siguiente.",
            "feedbackIncorrect": "Por qué no las demás: A y B omiten la apropiación necesaria; C confunde el déficit con una reserva presupuestal, figura asociada a compromisos y no a la simple existencia de un déficit fiscal."
        },
        {
            "id": "m4-q4",
            "question": "El concejo municipal cita al secretario de Hacienda para que explique el comportamiento de la ejecución del gasto, las fuentes de financiación y las variaciones frente al presupuesto aprobado. La citación se realiza en ejercicio de las atribuciones de la corporación administrativa. ¿Qué modalidad de control se ejerce principalmente en este caso?",
            "options": [
                "Control político, porque el concejo requiere explicaciones a la administración sobre la gestión y ejecución del gasto.",
                "Control fiscal, porque la citación reemplaza la vigilancia de la contraloría territorial.",
                "Control interno, porque el concejo forma parte del sistema de autocontrol de la alcaldía.",
                "Control financiero de auditoría, porque toda citación implica dictamen sobre estados financieros."
            ],
            "correct": 0,
            "feedbackCorrect": "Fundamento normativo y técnico: El Módulo 4 señala que el control político del gasto corresponde al Congreso y, en el nivel municipal, al concejo, mediante mecanismos como citaciones e informes. El material menciona la Constitución, el Estatuto Orgánico del Presupuesto y la Ley 5 de 1992 para el nivel nacional.\n\nPor qué es correcta: La finalidad de la citación es que un funcionario de la administración rinda explicaciones ante la corporación política sobre la ejecución del gasto, lo que corresponde a control político.",
            "feedbackIncorrect": "Por qué no las demás: B atribuye al concejo una función de vigilancia fiscal propia de las contralorías; C confunde la corporación política con el sistema interno de la alcaldía; D convierte una citación en una auditoría financiera."
        },
        {
            "id": "m4-q5",
            "question": "Una entidad pública carece de procedimientos documentados de autocontrol, no ha definido mecanismos de seguimiento para sus procesos y considera que basta con las auditorías externas que eventualmente practiquen los órganos de control. ¿Cuál es la principal deficiencia institucional frente al marco desarrollado en el módulo?",
            "options": [
                "La ausencia de una contraloría propia dentro de la entidad.",
                "La falta de una auditoría financiera anual contratada con una firma privada.",
                "El incumplimiento del deber de diseñar y aplicar un sistema de control interno con métodos y procedimientos propios.",
                "La inexistencia de un mecanismo de control político ejercido directamente por la entidad."
            ],
            "correct": 2,
            "feedbackCorrect": "Fundamento normativo y técnico: El Módulo 4 remite a los artículos 209 y 269 de la Constitución y a la Ley 87 de 1993 para señalar que las entidades públicas deben contar con métodos y procedimientos de control interno.\n\nPor qué es correcta: Las auditorías externas no sustituyen el autocontrol institucional. La entidad debe establecer sus propios mecanismos de control, seguimiento e información para apoyar la legalidad, la gestión y los resultados.",
            "feedbackIncorrect": "Por qué no las demás: A no es un requisito general para cada entidad; B puede ser una herramienta de aseguramiento, pero no reemplaza el sistema interno; D se refiere a una función externa de naturaleza política."
        },
        {
            "id": "m4-q6",
            "question": "La oficina de planeación de una entidad diseña indicadores para comparar metas programadas con resultados obtenidos, medir desempeño y suministrar información oportuna a la dirección sobre el cumplimiento de programas y proyectos. ¿Qué componente de control y seguimiento se fortalece principalmente?",
            "options": [
                "La revisión de cuentas como examen exclusivo de soportes contables.",
                "La evaluación de gestión y resultados de la administración pública.",
                "La responsabilidad fiscal, porque todo indicador determina automáticamente un daño patrimonial.",
                "La moción de censura, porque los indicadores sustituyen los mecanismos de control político."
            ],
            "correct": 1,
            "feedbackCorrect": "Fundamento normativo y técnico: El artículo 343 de la Constitución, según el material, atribuye al organismo nacional de planeación y a sus equivalentes el diseño y organización de sistemas de evaluación de gestión y resultados de la administración pública.\n\nPor qué es correcta: Los indicadores descritos comparan metas, desempeño y resultados de programas y proyectos para apoyar la toma de decisiones, que es precisamente la finalidad señalada en el módulo.",
            "feedbackIncorrect": "Por qué no las demás: A se limita a soportes y cuentas; C confunde medición de desempeño con determinación de daño fiscal; D corresponde a un mecanismo político que no es sustituido por indicadores."
        },
        {
            "id": "m4-q7",
            "question": "En una alcaldía, la Secretaría de Hacienda realiza seguimiento a la ejecución financiera del presupuesto, mientras la Secretaría de Planeación verifica el avance de planes, programas y proyectos de inversión. Ambas dependencias intercambian información para analizar resultados. ¿Cuál interpretación describe mejor esta actuación?",
            "options": [
                "Corresponde al seguimiento financiero del presupuesto y al seguimiento de la inversión, funciones que deben articularse de acuerdo con sus competencias.",
                "Constituye exclusivamente control fiscal externo y debe ser asumido por la contraloría.",
                "Es una actuación disciplinaria porque evalúa el desempeño de los responsables del gasto.",
                "Equivale al control político del concejo, aunque lo ejecuten dependencias de la administración."
            ],
            "correct": 0,
            "feedbackCorrect": "Fundamento normativo y técnico: El Módulo 4, con referencia a los artículos 92, 93 y 94 del Decreto 111 de 1996, explica el seguimiento financiero del presupuesto y distingue las competencias de Hacienda y Planeación, incluyendo el seguimiento de proyectos de inversión.\n\nPor qué es correcta: La situación reproduce esa distribución funcional: Hacienda analiza la ejecución financiera y Planeación verifica programas y proyectos, con necesidad de trabajo coordinado.",
            "feedbackIncorrect": "Por qué no las demás: B atribuye la tarea exclusivamente al control fiscal externo; C la confunde con disciplina; D la equipara al control político pese a que es ejecutada por dependencias administrativas."
        },
        {
            "id": "m4-q8",
            "question": "Un ordenador del gasto solicita suscribir un compromiso contractual pese a que el rubro no cuenta con apropiación disponible ni se ha expedido el Certificado de Disponibilidad Presupuestal. El área financiera advierte el riesgo de asumir una obligación no autorizada presupuestalmente. ¿Cuál actuación es la más adecuada frente a la solicitud?",
            "options": [
                "Continuar con el compromiso y obtener el CDP después de recibir el bien o servicio.",
                "Registrar la obligación contra cualquier rubro con saldo, aunque su objeto sea diferente.",
                "Autorizar el compromiso si existe liquidez en tesorería, porque la disponibilidad de caja reemplaza la apropiación.",
                "Abstenerse de asumir la obligación y advertir que comprometer recursos sin autorización presupuestal puede generar responsabilidades para los sujetos que intervienen."
            ],
            "correct": 3,
            "feedbackCorrect": "Fundamento normativo y técnico: El apartado de responsabilidades fiscales del Módulo 4 remite al artículo 112 del Decreto 111 de 1996 y señala responsabilidad de los sujetos presupuestales que contraigan obligaciones no autorizadas o efectúen pagos contrarios al Estatuto Orgánico del Presupuesto.\n\nPor qué es correcta: Sin apropiación disponible ni CDP, el supuesto presenta una ausencia de respaldo presupuestal previo. La actuación prudente y ajustada al material es impedir que se asuma la obligación y advertir las consecuencias para los responsables.",
            "feedbackIncorrect": "Por qué no las demás: A pretende legalizar posteriormente un requisito previo; B afecta un rubro con objeto distinto; C confunde liquidez de caja con autorización presupuestal."
        },
        {
            "id": "m4-q9",
            "question": "El jefe de presupuesto decide no remitir los informes mensuales de ejecución de ingresos y gastos porque considera que los libros internos contienen información suficiente y que el envío externo es solo una buena práctica administrativa. ¿Qué orientación debe recibir?",
            "options": [
                "Mantener la decisión, porque los informes son opcionales cuando existen libros presupuestales actualizados.",
                "Remitir oportunamente los informes de ejecución exigidos, pues hacen parte del sistema de información y seguimiento presupuestal previsto en el material.",
                "Enviar únicamente el informe de gastos y omitir el de ingresos para evitar duplicidad de información.",
                "Sustituir los informes por estados financieros anuales, porque ambos documentos tienen el mismo objeto presupuestal."
            ],
            "correct": 1,
            "feedbackCorrect": "Fundamento normativo y técnico: El Módulo 4 indica que la Resolución 036 de 1998 y el artículo 93 del Decreto 111 de 1996 regulan registros e informes presupuestales y señala el Informe Mensual de Ejecución del Presupuesto de Ingresos y el Informe Mensual de Ejecución del Presupuesto de Gastos.\n\nPor qué es correcta: Los libros son fuente de información, pero el material también exige la remisión de informes para programación, ejecución y seguimiento; por ello no son opcionales por el solo hecho de llevar registros internos.",
            "feedbackIncorrect": "Por qué no las demás: A desconoce la obligación informativa; C elimina uno de los informes previstos; D confunde estados financieros con reportes específicos de ejecución presupuestal."
        },
        {
            "id": "m4-q10",
            "question": "Un grupo de ciudadanos identifica posibles retrasos e inconsistencias en la ejecución de un contrato financiado con recursos públicos. Desea organizarse para vigilar el desarrollo del contrato, solicitar información y hacer seguimiento a la gestión de la entidad sin asumir funciones de los órganos de control. ¿Qué mecanismo de participación se ajusta mejor a ese propósito?",
            "options": [
                "Crear una oficina de control interno ciudadana con capacidad para impartir órdenes a la administración.",
                "Constituir una contraloría especial del contrato mediante decisión de los ciudadanos interesados.",
                "Organizar una veeduría ciudadana para ejercer vigilancia sobre la gestión pública relacionada con los recursos y el contrato.",
                "Solicitar al concejo que delegue en los ciudadanos su función de control político sobre el gasto."
            ],
            "correct": 2,
            "feedbackCorrect": "Fundamento normativo y técnico: El Módulo 4 reproduce la definición de veeduría ciudadana de la Ley 850 de 2003 y la relaciona con el artículo 270 de la Constitución: es un mecanismo democrático para ejercer vigilancia sobre la gestión pública en ámbitos donde se empleen recursos públicos.\n\nPor qué es correcta: El grupo desea vigilar un contrato y hacer seguimiento sin asumir competencias administrativas ni fiscales. La veeduría es el mecanismo de participación descrito para ese propósito.",
            "feedbackIncorrect": "Por qué no las demás: A crea una figura inexistente y confunde participación con control interno; B atribuye a los ciudadanos una potestad institucional que no tienen; D supone una delegación del control político que no corresponde al mecanismo planteado."
        }
    ]
};

export function getQuestionsForClient(courseId: string, moduleId: string) {
    const questionsList = courseId === "9" && COURSE_9_QUESTIONS[moduleId] 
        ? COURSE_9_QUESTIONS[moduleId] 
        : FALLBACK_QUESTIONS;

    // Retornamos sin correct, feedbackCorrect, feedbackIncorrect
    return questionsList.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options
    }));
}

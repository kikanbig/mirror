import type { MoonPhaseInfo } from '../../data/moon-phases';

export const moonEs: Record<string, Partial<MoonPhaseInfo>> = {
  new_moon: {
    phase: 'new_moon',
    phaseRu: 'Luna Nueva',
    emoji: '🌑',
    description:
      'La Luna se oculta en la oscuridad — tiempo de nuevos comienzos. Es un momento de silencio, cuando lo viejo se ha ido y lo nuevo aún no se ha manifestado. El período ideal para sembrar intenciones.',
    energy: 'Energía de renovación y silencio interior. El mundo se detiene ante un nuevo ciclo.',
    recommendations: [
      'Escribe tus intenciones y deseos para el nuevo ciclo lunar',
      'Pasa tiempo en soledad y meditación',
      'Inicia un nuevo proyecto o iniciativa',
      'Suelta los hábitos antiguos que te pesan',
      'Crea un plan de acción para el próximo mes',
    ],
    rituals: [
      'Ritual de intenciones: escribe 3 deseos principales en papel a la luz de velas',
      'Meditación sobre el vacío y el potencial de lo nuevo',
      'Limpieza del espacio — abre ventanas, enciende incienso',
    ],
    tarotConnection:
      'La Luna Nueva está ligada a El Loco (0) — potencial puro, comienzo del camino. Los tirados en luna nueva ayudan a revelar oportunidades ocultas y nuevas direcciones.',
  },
  waxing_crescent: {
    phase: 'waxing_crescent',
    phaseRu: 'Creciente Cóncava',
    emoji: '🌒',
    description:
      'Una fina media luna aparece en el cielo — tus intenciones comienzan a tomar forma. Tiempo de primeros pasos y nacimiento de la esperanza. Las semillas están sembradas y los primeros brotes asoman.',
    energy: 'Energía de crecimiento, esperanza y primeras acciones. La fe en tus planes cobra fuerza.',
    recommendations: [
      'Da el primer paso concreto hacia tu meta',
      'Visualiza el resultado deseado antes de dormir',
      'Supera dudas y miedos con la acción',
      'Busca señales y confirmaciones del camino correcto',
      'Fortalece tu fe en ti mismo y en tus comienzos',
    ],
    rituals: [
      'Ritual de atracción: enciende una vela blanca y pronuncia una afirmación',
      'Crea un tablero de visión o collage de deseos',
      'Planta una planta real como símbolo de tus intenciones',
    ],
    tarotConnection:
      'Esta fase está ligada a El Mago (I) — fuerza de voluntad y primeras acciones. Los tirados en esta fase ayudan a entender qué recursos están disponibles para lograr tus metas.',
  },
  first_quarter: {
    phase: 'first_quarter',
    phaseRu: 'Cuarto Creciente',
    emoji: '🌓',
    description:
      'La Luna está medio iluminada — tiempo de decisiones y superación de obstáculos. Las primeras dificultades prueban la solidez de tus intenciones. Es el momento de elegir: continuar o retroceder.',
    energy: 'Energía de acción, determinación y lucha. El conflicto interior conduce al crecimiento.',
    recommendations: [
      'Toma una decisión y actúa sin demora',
      'Revisa tu plan si encuentras obstáculos',
      'Muestra perseverancia y no te rindas',
      'Enfrenta los conflictos con honestidad y apertura',
      'Concéntrate en las tareas prioritarias',
    ],
    rituals: [
      'Ritual de superación: escribe tus miedos y quémalos simbólicamente',
      'Meditación sobre la fuerza interior y la determinación',
      'Actividad física para liberar energía bloqueada',
    ],
    tarotConnection:
      'Esta fase está ligada a El Carro (VII) — superación y voluntad de victoria. Los tirados en cuarto creciente revelan qué obstáculos hay en tu camino y cómo superarlos.',
  },
  waxing_gibbous: {
    phase: 'waxing_gibbous',
    phaseRu: 'Creciente Convexa',
    emoji: '🌔',
    description:
      'La Luna está casi llena — ajustes finales antes de la culminación. Tiempo de refinamiento, perfección y paciencia. Los resultados están cerca pero requieren un último esfuerzo.',
    energy: 'Energía de refinamiento, paciencia y persistencia. La recta final antes de la luna llena.',
    recommendations: [
      'Perfecciona lo que has comenzado; presta atención a los detalles',
      'Muestra paciencia — el resultado ya está en camino',
      'Ajusta tu rumbo si es necesario',
      'Practica la gratitud por lo que ya has logrado',
      'Fortalece las conexiones y relaciones beneficiosas',
    ],
    rituals: [
      'Ritual de gratitud: enumera todo por lo que estás agradecido',
      'Meditación sobre la aceptación y la confianza en el proceso',
      'Completa tareas pendientes y ordena',
    ],
    tarotConnection:
      'Esta fase está ligada a El Ermitaño (IX) — sabiduría interior y paciencia. Los tirados mostrarán qué hay que refinar y qué lecciones quedan por aprender.',
  },
  full_moon: {
    phase: 'full_moon',
    phaseRu: 'Luna Llena',
    emoji: '🌕',
    description:
      'La Luna en pleno resplandor — culminación del ciclo. Emociones e intuición en su punto álgido. Lo oculto se hace visible, la verdad emerge. Tiempo de cosecha y toma de conciencia.',
    energy: 'Energía máxima, intensidad emocional, intuición al máximo. Todo se amplifica.',
    recommendations: [
      'Confía en tu intuición — ahora es especialmente fuerte',
      'Suelta lo que ya no sirve a tu mayor bien',
      'Completa tareas y proyectos importantes',
      'Presta atención a los sueños — llevan mensajes',
      'Evita decisiones impulsivas guiadas por las emociones',
    ],
    rituals: [
      'Ritual de luna llena: carga cristales y tu baraja de Tarot a la luz lunar',
      'Meditación a la luz de la luna para limpieza y recarga',
      'Ritual de liberación: escribe en papel lo que quieres soltar y quémalo',
    ],
    tarotConnection:
      'La Luna Llena está ligada a La Luna (XVIII) — intuición, subconsciente, revelación de secretos. Los tirados en luna llena dan las respuestas más precisas y profundas.',
  },
  waning_gibbous: {
    phase: 'waning_gibbous',
    phaseRu: 'Menguante Convexa',
    emoji: '🌖',
    description:
      'La Luna comienza a menguar — tiempo de gratitud y reflexión. La energía se dirige hacia dentro. Momento de compartir sabiduría y procesar la experiencia vivida.',
    energy: 'Energía de gratitud, difusión del conocimiento y reflexión sobre lo vivido.',
    recommendations: [
      'Comparte tu experiencia y conocimiento con otros',
      'Analiza los resultados de tus acciones',
      'Expresa gratitud a quienes te han ayudado',
      'Escribe las lecciones e insights que has recibido',
      'Empieza a ir más despacio y descansar más',
    ],
    rituals: [
      'Ritual de gratitud: escribe cartas de agradecimiento (incluso a ti mismo)',
      'Práctica de atención plena — pasa tiempo en silencio y observación',
      'Comparte algo valioso sin esperar nada a cambio',
    ],
    tarotConnection:
      'Esta fase está ligada a La Estrella (XVII) — esperanza, generosidad e inspiración. Los tirados ayudan a reflexionar sobre la experiencia vivida y encontrar sabiduría en ella.',
  },
  last_quarter: {
    phase: 'last_quarter',
    phaseRu: 'Cuarto Menguante',
    emoji: '🌗',
    description:
      'La Luna está medio oculta — tiempo de soltar y perdonar. Lo viejo debe irse para dar paso a lo nuevo. Período de trabajo interior y liberación.',
    energy: 'Energía de liberación, perdón y transformación interior.',
    recommendations: [
      'Suelta rencores y perdona a ti mismo y a los demás',
      'Termina relaciones o proyectos que han cumplido su ciclo',
      'Haz una limpieza profunda de tu hogar y espacio de trabajo',
      'Despréndete de cosas innecesarias y apegos antiguos',
      'Dedica tiempo al autoanálisis y la reflexión',
    ],
    rituals: [
      'Ritual de perdón: libera mentalmente todos los rencores con cada exhalación',
      'Baño purificador con sal y aceites esenciales',
      'Desprenderse de objetos antiguos — cada cosa liberada libera energía',
    ],
    tarotConnection:
      'Esta fase está ligada a El Juicio (XX) — soltar el pasado y transformación. Los tirados ayudan a entender qué soltar y qué te está reteniendo.',
  },
  waning_crescent: {
    phase: 'waning_crescent',
    phaseRu: 'Menguante Cóncava',
    emoji: '🌘',
    description:
      'La última fina media luna antes de la luna nueva — tiempo de descanso profundo y restauración. El ciclo se completa y el alma se prepara para un nuevo comienzo. Período de silencio e introspección.',
    energy: 'Energía de descanso, restauración y preparación para un nuevo ciclo.',
    recommendations: [
      'Descansa más y duerme lo suficiente',
      'Practica meditación y respiración consciente',
      'Lleva un diario de sueños — ahora son especialmente significativos',
      'No empieces nada nuevo; termina lo antiguo',
      'Pasa tiempo a solas contigo mismo; restaura tus fuerzas',
    ],
    rituals: [
      'Meditación sobre el vacío y la aceptación de lo desconocido',
      'Diario de sueños e interpretación de los mismos',
      'Ritual de cierre: resume el ciclo lunar a la luz de una vela',
    ],
    tarotConnection:
      'Esta fase está ligada a El Mundo (XXI) — cierre del ciclo y plenitud. Los tirados mostrarán los resultados del camino recorrido y te prepararán para una nueva vuelta de la espiral.',
  },
};

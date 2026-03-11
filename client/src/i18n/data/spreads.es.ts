export const spreadsEs: Record<
  string,
  { name: string; description: string; positions: { name: string; description: string }[] }
> = {
  single: {
    name: 'Una carta',
    description:
      'Una tirada simple y rápida de una sola carta. Ideal para recibir un consejo del día o una respuesta a una pregunta concreta. La carta refleja la esencia de tu situación actual.',
    positions: [
      {
        name: 'Carta del día',
        description: 'El mensaje clave y la energía que te acompaña hoy',
      },
    ],
  },
  three_card: {
    name: 'Tres cartas',
    description:
      'Una tirada clásica de tres cartas que revela el fluir del tiempo. El pasado muestra las raíces de la situación, el presente — las energías actuales, el futuro — el desenlace probable.',
    positions: [
      {
        name: 'Pasado',
        description: 'Eventos y energías que llevaron a la situación actual',
      },
      {
        name: 'Presente',
        description: 'Estado actual de las cosas, energías que te rodean ahora mismo',
      },
      {
        name: 'Futuro',
        description: 'El curso más probable de los eventos si mantienes tu rumbo actual',
      },
    ],
  },
  yes_no: {
    name: 'Sí / No',
    description:
      'Una tirada para obtener una respuesta directa a una pregunta cerrada. Carta derecha — "Sí", invertida — "No". Confía en tu intuición.',
    positions: [
      {
        name: 'Respuesta',
        description:
          'Derecha — Sí, invertida — No. Presta atención a los matices de la carta',
      },
    ],
  },
  celtic_cross: {
    name: 'Cruz Celta',
    description:
      'Una tirada profunda y multifacética de diez cartas. Revela todos los aspectos de una situación — desde influencias ocultas y miedos internos hasta el resultado final. La tirada clásica más completa.',
    positions: [
      {
        name: 'Situación',
        description: 'La esencia de la pregunta, el tema central que te preocupa',
      },
      {
        name: 'Obstáculo',
        description: 'Lo que te dificulta o desafía en esta situación',
      },
      {
        name: 'Base',
        description: 'La causa profunda, el fundamento de la situación, las raíces ocultas',
      },
      {
        name: 'Pasado',
        description: 'Eventos recientes que influyeron en tu posición actual',
      },
      {
        name: 'Futuro posible',
        description: 'El mejor desenlace posible al que puedes llegar',
      },
      {
        name: 'Futuro cercano',
        description: 'Eventos que ocurrirán en el futuro más inmediato',
      },
      {
        name: 'Tú mismo',
        description: 'Tu estado interior, tu actitud ante la situación',
      },
      {
        name: 'Entorno',
        description: 'Influencia de las personas cercanas y las circunstancias externas',
      },
      {
        name: 'Esperanzas y miedos',
        description: 'Tus esperanzas más profundas y tus temores secretos',
      },
      {
        name: 'Resultado',
        description: 'El resultado final hacia el que conduce tu camino actual',
      },
    ],
  },
  love: {
    name: 'Tirada de amor',
    description:
      'Una tirada de cinco cartas dedicada a los asuntos del corazón. Revela la dinámica de la relación, los sentimientos de ambos socios y las perspectivas de la unión.',
    positions: [
      {
        name: 'Tú en la relación',
        description: 'Tus sentimientos, energía y papel en la relación',
      },
      {
        name: 'Pareja',
        description: 'Sentimientos, intenciones y energía de tu pareja',
      },
      {
        name: 'Base de la relación',
        description: 'El fundamento de vuestra conexión, lo que os une',
      },
      {
        name: 'Problema',
        description: 'Dificultad o prueba actual en la relación',
      },
      {
        name: 'Futuro de la relación',
        description: 'Hacia dónde se dirige vuestra relación, el desenlace probable',
      },
    ],
  },
  career: {
    name: 'Tirada de carrera',
    description:
      'Una tirada de cinco cartas para preguntas sobre trabajo, finanzas y desarrollo profesional. Revelará oportunidades ocultas y dará consejos prácticos.',
    positions: [
      {
        name: 'Situación actual',
        description: 'Tu posición actual en el ámbito profesional',
      },
      {
        name: 'Obstáculo',
        description: 'Lo que dificulta tu crecimiento profesional o el éxito',
      },
      {
        name: 'Oportunidades ocultas',
        description: 'Recursos y oportunidades no obvios que puedes aprovechar',
      },
      {
        name: 'Consejo',
        description: 'Recomendación de las cartas: qué acciones emprender',
      },
      {
        name: 'Resultado',
        description: 'El desenlace más probable al seguir el consejo de las cartas',
      },
    ],
  },
  week: {
    name: 'Tirada semanal',
    description:
      'Siete cartas — una para cada día de la semana. Descubre qué energía te acompañará cada día y cómo aprovechar mejor tu tiempo.',
    positions: [
      {
        name: 'Lunes',
        description: 'Energía y tema principal del lunes',
      },
      {
        name: 'Martes',
        description: 'Energía y tema principal del martes',
      },
      {
        name: 'Miércoles',
        description: 'Energía y tema principal del miércoles',
      },
      {
        name: 'Jueves',
        description: 'Energía y tema principal del jueves',
      },
      {
        name: 'Viernes',
        description: 'Energía y tema principal del viernes',
      },
      {
        name: 'Sábado',
        description: 'Energía y tema principal del sábado',
      },
      {
        name: 'Domingo',
        description: 'Energía y tema principal del domingo',
      },
    ],
  },
};

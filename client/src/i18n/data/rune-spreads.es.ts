export const runeSpreadsEs: Record<
  string,
  { name: string; description: string; positions: { name: string; description: string }[] }
> = {
  single: {
    name: 'Runa del Día',
    description:
      'Una runa — un mensaje breve y consejo para hoy. Una respuesta rápida y precisa a cualquier pregunta.',
    positions: [
      {
        name: 'Mensaje',
        description: 'El mensaje principal de las runas para ti ahora mismo',
      },
    ],
  },
  norns: {
    name: 'Tres Nornas',
    description:
      'Tres runas revelan el hilo del destino: pasado, presente y futuro. Una tirada clásica de los videntes escandinavos.',
    positions: [
      {
        name: 'Urd (Pasado)',
        description: 'Lo que ya ha ocurrido y te influye',
      },
      {
        name: 'Verdandi (Presente)',
        description: 'La situación actual y la energía del momento',
      },
      {
        name: 'Skuld (Futuro)',
        description: 'Hacia dónde conduce tu camino, el desenlace probable',
      },
    ],
  },
  odin: {
    name: 'Cruz de Odín',
    description:
      'Cinco runas para un análisis profundo de una situación. Revela la esencia del problema, obstáculos, influencias ocultas y el resultado.',
    positions: [
      {
        name: 'Esencia',
        description: 'El tema central, el núcleo de la situación',
      },
      {
        name: 'Obstáculo',
        description: 'Lo que se interpone en el camino, lo que te desafía',
      },
      {
        name: 'Pasado',
        description: 'Las raíces de la situación, lo que te trajo aquí',
      },
      {
        name: 'Futuro',
        description: 'Hacia dónde se dirige la situación',
      },
      {
        name: 'Resultado',
        description: 'El resultado final, consejo de las runas',
      },
    ],
  },
};

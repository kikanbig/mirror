export const runeSpreadsEn: Record<
  string,
  { name: string; description: string; positions: { name: string; description: string }[] }
> = {
  single: {
    name: 'Rune of the Day',
    description:
      'One rune — a brief message and advice for today. A quick and precise answer to any question.',
    positions: [
      {
        name: 'Message',
        description: 'The main message of the runes for you right now',
      },
    ],
  },
  norns: {
    name: 'Three Norns',
    description:
      'Three runes reveal the thread of fate: past, present, and future. A classic spread of Scandinavian seers.',
    positions: [
      {
        name: 'Urd (Past)',
        description: 'What has already happened and influences you',
      },
      {
        name: 'Verdandi (Present)',
        description: 'The current situation and energy of the moment',
      },
      {
        name: 'Skuld (Future)',
        description: 'Where your path leads, the likely outcome',
      },
    ],
  },
  odin: {
    name: 'Odin\'s Cross',
    description:
      'Five runes for a deep analysis of a situation. Reveals the essence of the problem, obstacles, hidden influences, and the outcome.',
    positions: [
      {
        name: 'Essence',
        description: 'The central theme, the core of the situation',
      },
      {
        name: 'Obstacle',
        description: 'What stands in the way, what challenges you',
      },
      {
        name: 'Past',
        description: 'The roots of the situation, what led here',
      },
      {
        name: 'Future',
        description: 'Where the situation is heading',
      },
      {
        name: 'Outcome',
        description: 'The final result, advice of the runes',
      },
    ],
  },
};

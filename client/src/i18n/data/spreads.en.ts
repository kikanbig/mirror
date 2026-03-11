export const spreadsEn: Record<
  string,
  { name: string; description: string; positions: { name: string; description: string }[] }
> = {
  single: {
    name: 'Single Card',
    description:
      'A simple and quick one-card spread. Ideal for getting daily advice or an answer to a specific question. The card reflects the essence of your current situation.',
    positions: [
      {
        name: 'Card of the Day',
        description: 'The key message and energy that accompanies you today',
      },
    ],
  },
  three_card: {
    name: 'Three Card Spread',
    description:
      'A classic three-card spread that reveals the flow of time. The past shows the roots of the situation, the present — current energies, the future — the likely outcome.',
    positions: [
      {
        name: 'Past',
        description: 'Events and energies that led to the current situation',
      },
      {
        name: 'Present',
        description: 'Current state of affairs, energies surrounding you right now',
      },
      {
        name: 'Future',
        description: 'Most likely course of events if you stay on your current path',
      },
    ],
  },
  yes_no: {
    name: 'Yes / No',
    description:
      'A spread for getting a direct answer to a closed question. Upright card — "Yes", reversed — "No". Trust your intuition.',
    positions: [
      {
        name: 'Answer',
        description:
          'Upright — Yes, reversed — No. Pay attention to the nuances of the card',
      },
    ],
  },
  celtic_cross: {
    name: 'Celtic Cross',
    description:
      'A deep and multifaceted ten-card spread. Reveals all aspects of a situation — from hidden influences and inner fears to the final outcome. The most complete classic spread.',
    positions: [
      {
        name: 'Situation',
        description: 'The essence of the question, the central theme that concerns you',
      },
      {
        name: 'Obstacle',
        description: 'What hinders or challenges you in this situation',
      },
      {
        name: 'Foundation',
        description: 'The deep cause, foundation of the situation, hidden roots',
      },
      {
        name: 'Past',
        description: 'Recent events that influenced your current position',
      },
      {
        name: 'Possible Future',
        description: 'The best possible outcome you can achieve',
      },
      {
        name: 'Near Future',
        description: 'Events that will occur in the very near future',
      },
      {
        name: 'Yourself',
        description: 'Your inner state, attitude toward the situation',
      },
      {
        name: 'Environment',
        description: 'Influence of surrounding people and external circumstances',
      },
      {
        name: 'Hopes and Fears',
        description: 'Your deepest hopes and secret fears',
      },
      {
        name: 'Outcome',
        description: 'The final result toward which your current path leads',
      },
    ],
  },
  love: {
    name: 'Love Spread',
    description:
      'A five-card spread dedicated to matters of the heart. Reveals the dynamics of a relationship, feelings of both partners, and prospects for the union.',
    positions: [
      {
        name: 'You in the Relationship',
        description: 'Your feelings, energy, and role in the relationship',
      },
      {
        name: 'Partner',
        description: 'Your partner\'s feelings, intentions, and energy',
      },
      {
        name: 'Foundation of the Relationship',
        description: 'The foundation of your connection, what unites you',
      },
      {
        name: 'Problem',
        description: 'Current difficulty or challenge in the relationship',
      },
      {
        name: 'Future of the Relationship',
        description: 'Where your relationship is heading, the likely outcome',
      },
    ],
  },
  career: {
    name: 'Career Spread',
    description:
      'A five-card spread for questions about work, finances, and professional development. Will reveal hidden opportunities and give practical advice.',
    positions: [
      {
        name: 'Current Situation',
        description: 'Your current position in the professional sphere',
      },
      {
        name: 'Obstacle',
        description: 'What hinders your career growth or success',
      },
      {
        name: 'Hidden Opportunities',
        description: 'Non-obvious resources and chances you can use',
      },
      {
        name: 'Advice',
        description: 'The cards\' recommendation: what actions to take',
      },
      {
        name: 'Result',
        description: 'Most likely outcome when following the cards\' advice',
      },
    ],
  },
  week: {
    name: 'Weekly Spread',
    description:
      'Seven cards — one for each day of the week. Find out what energy will accompany you each day and how best to use your time.',
    positions: [
      {
        name: 'Monday',
        description: 'Energy and main theme of Monday',
      },
      {
        name: 'Tuesday',
        description: 'Energy and main theme of Tuesday',
      },
      {
        name: 'Wednesday',
        description: 'Energy and main theme of Wednesday',
      },
      {
        name: 'Thursday',
        description: 'Energy and main theme of Thursday',
      },
      {
        name: 'Friday',
        description: 'Energy and main theme of Friday',
      },
      {
        name: 'Saturday',
        description: 'Energy and main theme of Saturday',
      },
      {
        name: 'Sunday',
        description: 'Energy and main theme of Sunday',
      },
    ],
  },
};

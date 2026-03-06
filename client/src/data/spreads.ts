export interface SpreadPosition {
  index: number;
  name: string;
  description: string;
}

export interface Spread {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  cardCount: number;
  positions: SpreadPosition[];
  isPremium: boolean;
  icon: string;
  category: 'general' | 'love' | 'career' | 'spiritual';
}

export const spreads: Spread[] = [
  {
    id: 'single',
    name: 'Одна карта',
    nameEn: 'Single Card',
    description: 'Простой и быстрый расклад на одну карту. Идеален для получения совета на день или ответа на конкретный вопрос. Карта отражает суть текущей ситуации.',
    cardCount: 1,
    positions: [
      {
        index: 0,
        name: 'Карта дня',
        description: 'Ключевое послание и энергия, которая сопровождает вас сегодня',
      },
    ],
    isPremium: false,
    icon: '🃏',
    category: 'general',
  },
  {
    id: 'three_card',
    name: 'Три карты',
    nameEn: 'Three Card Spread',
    description: 'Классический расклад на три карты, раскрывающий течение времени. Прошлое показывает корни ситуации, настоящее — текущие энергии, будущее — вероятный исход.',
    cardCount: 3,
    positions: [
      {
        index: 0,
        name: 'Прошлое',
        description: 'События и энергии, которые привели к текущей ситуации',
      },
      {
        index: 1,
        name: 'Настоящее',
        description: 'Текущее состояние дел, энергии, окружающие вас прямо сейчас',
      },
      {
        index: 2,
        name: 'Будущее',
        description: 'Наиболее вероятное развитие событий при текущем курсе',
      },
    ],
    isPremium: false,
    icon: '🔮',
    category: 'general',
  },
  {
    id: 'yes_no',
    name: 'Да / Нет',
    nameEn: 'Yes or No',
    description: 'Расклад для получения прямого ответа на закрытый вопрос. Карта в прямом положении — «Да», в перевёрнутом — «Нет». Доверьтесь интуиции.',
    cardCount: 1,
    positions: [
      {
        index: 0,
        name: 'Ответ',
        description: 'Прямое положение — Да, перевёрнутое — Нет. Обратите внимание на нюансы карты',
      },
    ],
    isPremium: false,
    icon: '⚖️',
    category: 'general',
  },
  {
    id: 'celtic_cross',
    name: 'Кельтский крест',
    nameEn: 'Celtic Cross',
    description: 'Глубокий и многогранный расклад на десять карт. Раскрывает все аспекты ситуации — от скрытых влияний и внутренних страхов до итогового результата. Самый полный классический расклад.',
    cardCount: 10,
    positions: [
      {
        index: 0,
        name: 'Ситуация',
        description: 'Суть вопроса, центральная тема, которая вас волнует',
      },
      {
        index: 1,
        name: 'Препятствие',
        description: 'То, что мешает или бросает вызов в данной ситуации',
      },
      {
        index: 2,
        name: 'Основа',
        description: 'Глубинная причина, фундамент ситуации, скрытые корни',
      },
      {
        index: 3,
        name: 'Прошлое',
        description: 'Недавние события, которые повлияли на текущее положение дел',
      },
      {
        index: 4,
        name: 'Возможное будущее',
        description: 'Лучший возможный исход, к которому вы можете прийти',
      },
      {
        index: 5,
        name: 'Ближайшее будущее',
        description: 'События, которые произойдут в самое ближайшее время',
      },
      {
        index: 6,
        name: 'Вы сами',
        description: 'Ваше внутреннее состояние, отношение к ситуации',
      },
      {
        index: 7,
        name: 'Окружение',
        description: 'Влияние окружающих людей и внешних обстоятельств',
      },
      {
        index: 8,
        name: 'Надежды и страхи',
        description: 'Ваши глубинные надежды и тайные опасения',
      },
      {
        index: 9,
        name: 'Итог',
        description: 'Финальный результат, к которому ведёт текущий путь',
      },
    ],
    isPremium: true,
    icon: '✝️',
    category: 'general',
  },
  {
    id: 'love',
    name: 'Расклад на любовь',
    nameEn: 'Love Spread',
    description: 'Расклад на пять карт, посвящённый делам сердечным. Раскрывает динамику отношений, чувства обоих партнёров и перспективы союза.',
    cardCount: 5,
    positions: [
      {
        index: 0,
        name: 'Вы в отношениях',
        description: 'Ваши чувства, энергия и роль в отношениях',
      },
      {
        index: 1,
        name: 'Партнёр',
        description: 'Чувства, намерения и энергия вашего партнёра',
      },
      {
        index: 2,
        name: 'Основа отношений',
        description: 'Фундамент вашей связи, то, что объединяет вас',
      },
      {
        index: 3,
        name: 'Проблема',
        description: 'Текущая трудность или испытание в отношениях',
      },
      {
        index: 4,
        name: 'Будущее отношений',
        description: 'Куда движутся ваши отношения, вероятный исход',
      },
    ],
    isPremium: true,
    icon: '💕',
    category: 'love',
  },
  {
    id: 'career',
    name: 'Расклад на карьеру',
    nameEn: 'Career Spread',
    description: 'Расклад на пять карт для вопросов о работе, финансах и профессиональном развитии. Покажет скрытые возможности и даст практический совет.',
    cardCount: 5,
    positions: [
      {
        index: 0,
        name: 'Текущая ситуация',
        description: 'Ваше нынешнее положение в профессиональной сфере',
      },
      {
        index: 1,
        name: 'Препятствие',
        description: 'Что мешает вашему карьерному росту или успеху',
      },
      {
        index: 2,
        name: 'Скрытые возможности',
        description: 'Неочевидные ресурсы и шансы, которые вы можете использовать',
      },
      {
        index: 3,
        name: 'Совет',
        description: 'Рекомендация карт: какие действия предпринять',
      },
      {
        index: 4,
        name: 'Результат',
        description: 'Наиболее вероятный итог при следовании совету карт',
      },
    ],
    isPremium: true,
    icon: '💼',
    category: 'career',
  },
  {
    id: 'week',
    name: 'Расклад на неделю',
    nameEn: 'Weekly Spread',
    description: 'Семь карт — по одной на каждый день недели. Узнайте, какая энергия будет сопровождать вас в каждый из дней и как лучше распорядиться временем.',
    cardCount: 7,
    positions: [
      {
        index: 0,
        name: 'Понедельник',
        description: 'Энергия и основная тема понедельника',
      },
      {
        index: 1,
        name: 'Вторник',
        description: 'Энергия и основная тема вторника',
      },
      {
        index: 2,
        name: 'Среда',
        description: 'Энергия и основная тема среды',
      },
      {
        index: 3,
        name: 'Четверг',
        description: 'Энергия и основная тема четверга',
      },
      {
        index: 4,
        name: 'Пятница',
        description: 'Энергия и основная тема пятницы',
      },
      {
        index: 5,
        name: 'Суббота',
        description: 'Энергия и основная тема субботы',
      },
      {
        index: 6,
        name: 'Воскресенье',
        description: 'Энергия и основная тема воскресенья',
      },
    ],
    isPremium: true,
    icon: '📅',
    category: 'general',
  },
];

export interface RuneSpread {
  id: string;
  name: string;
  description: string;
  runeCount: number;
  positions: { index: number; name: string; description: string }[];
}

export const runeSpreads: RuneSpread[] = [
  {
    id: 'single',
    name: 'Руна Дня',
    description: 'Одна руна — краткое послание и совет на сегодня. Быстрый и точный ответ на любой вопрос.',
    runeCount: 1,
    positions: [
      { index: 0, name: 'Послание', description: 'Главное послание рун для вас сейчас' },
    ],
  },
  {
    id: 'norns',
    name: 'Три Норны',
    description: 'Три руны раскрывают нить судьбы: прошлое, настоящее и будущее. Классический расклад скандинавских провидцев.',
    runeCount: 3,
    positions: [
      { index: 0, name: 'Урд (Прошлое)', description: 'То, что уже произошло и влияет на вас' },
      { index: 1, name: 'Верданди (Настоящее)', description: 'Текущая ситуация и энергия момента' },
      { index: 2, name: 'Скульд (Будущее)', description: 'Куда ведёт ваш путь, вероятный исход' },
    ],
  },
  {
    id: 'odin',
    name: 'Крест Одина',
    description: 'Пять рун для глубокого анализа ситуации. Раскрывает суть проблемы, препятствия, скрытые влияния и итог.',
    runeCount: 5,
    positions: [
      { index: 0, name: 'Суть', description: 'Центральная тема, ядро ситуации' },
      { index: 1, name: 'Препятствие', description: 'Что стоит на пути, бросает вызов' },
      { index: 2, name: 'Прошлое', description: 'Корни ситуации, что привело сюда' },
      { index: 3, name: 'Будущее', description: 'Куда движется ситуация' },
      { index: 4, name: 'Итог', description: 'Финальный результат, совет рун' },
    ],
  },
];

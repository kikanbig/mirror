export interface Affirmation {
  id: number;
  text: string;
  category: 'general' | 'love' | 'career' | 'health' | 'spiritual' | 'confidence';
}

export const affirmations: Affirmation[] = [
  // === general ===
  { id: 1, text: 'Я открыт(а) новым возможностям, и Вселенная поддерживает каждый мой шаг', category: 'general' },
  { id: 2, text: 'Каждый день я становлюсь лучшей версией себя', category: 'general' },
  { id: 3, text: 'Я доверяю процессу жизни — всё происходит в нужное время', category: 'general' },
  { id: 4, text: 'Я привлекаю в свою жизнь только лучшее', category: 'general' },
  { id: 5, text: 'Мои мысли создают мою реальность, и я выбираю светлые мысли', category: 'general' },
  { id: 6, text: 'Я благодарю Вселенную за всё, что у меня есть, и за то, что ещё придёт', category: 'general' },
  { id: 7, text: 'Я нахожусь в гармонии с ритмами природы и космоса', category: 'general' },
  { id: 8, text: 'Всё, что мне нужно, уже находится на пути ко мне', category: 'general' },
  { id: 9, text: 'Я отпускаю всё, что мне не принадлежит, с лёгкостью и благодарностью', category: 'general' },
  { id: 10, text: 'Сегодня — прекрасный день, полный чудес и открытий', category: 'general' },

  // === love ===
  { id: 11, text: 'Я достоин(на) глубокой, искренней и взаимной любви', category: 'love' },
  { id: 12, text: 'Моё сердце открыто для любви, и я принимаю её с благодарностью', category: 'love' },
  { id: 13, text: 'Я привлекаю отношения, наполненные уважением и нежностью', category: 'love' },
  { id: 14, text: 'Любовь окружает меня повсюду — я замечаю её в каждом мгновении', category: 'love' },
  { id: 15, text: 'Я отпускаю прошлые раны и открываюсь новой любви', category: 'love' },
  { id: 16, text: 'Мои отношения наполнены гармонией, доверием и взаимопониманием', category: 'love' },
  { id: 17, text: 'Я излучаю любовь, и она возвращается ко мне многократно', category: 'love' },
  { id: 18, text: 'Я люблю себя безусловно — это основа всех моих отношений', category: 'love' },
  { id: 19, text: 'Идеальный партнёр уже существует, и наши пути пересекутся в нужный момент', category: 'love' },
  { id: 20, text: 'Я выбираю любовь вместо страха в каждой ситуации', category: 'love' },

  // === career ===
  { id: 21, text: 'Я создаю изобилие через то, что люблю делать', category: 'career' },
  { id: 22, text: 'Мои таланты и навыки ценны, и мир готов за них платить', category: 'career' },
  { id: 23, text: 'Я открыт(а) для финансового потока и принимаю богатство с благодарностью', category: 'career' },
  { id: 24, text: 'Каждое препятствие в работе — это ступенька к большему успеху', category: 'career' },
  { id: 25, text: 'Я уверенно двигаюсь к своим профессиональным целям', category: 'career' },
  { id: 26, text: 'Моя работа приносит пользу людям, и это наполняет меня энергией', category: 'career' },
  { id: 27, text: 'Деньги приходят ко мне легко и из множества источников', category: 'career' },
  { id: 28, text: 'Я заслуживаю успеха и позволяю себе его принять', category: 'career' },
  { id: 29, text: 'Новые возможности для роста появляются в моей жизни каждый день', category: 'career' },
  { id: 30, text: 'Я благодарю свою работу за уроки и возможности, которые она даёт', category: 'career' },

  // === health ===
  { id: 31, text: 'Моё тело — мой храм, и я забочусь о нём с любовью', category: 'health' },
  { id: 32, text: 'Каждая клетка моего тела наполнена здоровьем и жизненной силой', category: 'health' },
  { id: 33, text: 'Я выбираю привычки, которые укрепляют моё здоровье и дух', category: 'health' },
  { id: 34, text: 'Моё тело обладает удивительной способностью к исцелению', category: 'health' },
  { id: 35, text: 'Я дышу глубоко и наполняюсь энергией с каждым вдохом', category: 'health' },
  { id: 36, text: 'Я прислушиваюсь к своему телу и даю ему то, что ему нужно', category: 'health' },
  { id: 37, text: 'Спокойствие и равновесие — моё естественное состояние', category: 'health' },
  { id: 38, text: 'С каждым днём я чувствую себя всё лучше и энергичнее', category: 'health' },
  { id: 39, text: 'Я отпускаю напряжение и позволяю телу расслабиться полностью', category: 'health' },
  { id: 40, text: 'Мой сон глубок и целителен, я просыпаюсь полным(ой) сил', category: 'health' },

  // === spiritual ===
  { id: 41, text: 'Я связан(а) с мудростью Вселенной и доверяю её знакам', category: 'spiritual' },
  { id: 42, text: 'Моя интуиция — мой верный проводник, и я прислушиваюсь к ней', category: 'spiritual' },
  { id: 43, text: 'Я — часть бесконечного космоса, и во мне заключена его сила', category: 'spiritual' },
  { id: 44, text: 'Каждый опыт в моей жизни — это урок, ведущий к пробуждению', category: 'spiritual' },
  { id: 45, text: 'Я открыт(а) для посланий из тонкого мира и умею их распознавать', category: 'spiritual' },
  { id: 46, text: 'Мой внутренний свет становится ярче с каждым днём', category: 'spiritual' },
  { id: 47, text: 'Я нахожусь на верном пути духовного развития', category: 'spiritual' },
  { id: 48, text: 'Медитация и тишина открывают мне двери к глубинной мудрости', category: 'spiritual' },
  { id: 49, text: 'Я принимаю тайны мироздания с открытым сердцем и разумом', category: 'spiritual' },
  { id: 50, text: 'Мои карты Таро — зеркало моей души, и я готов(а) видеть правду', category: 'spiritual' },

  // === confidence ===
  { id: 51, text: 'Я верю в себя и свои безграничные возможности', category: 'confidence' },
  { id: 52, text: 'Я смело иду навстречу неизвестному, ведь там ждут мои победы', category: 'confidence' },
  { id: 53, text: 'Моё мнение важно, и я имею право его выражать', category: 'confidence' },
  { id: 54, text: 'Я отпускаю сомнения и принимаю свою уникальность', category: 'confidence' },
  { id: 55, text: 'Я сильнее любых трудностей, которые встречаются на моём пути', category: 'confidence' },
  { id: 56, text: 'Мои ошибки — это ценный опыт, делающий меня мудрее', category: 'confidence' },
  { id: 57, text: 'Я заслуживаю всего лучшего, и я позволяю себе это получить', category: 'confidence' },
  { id: 58, text: 'Я доверяю себе принимать правильные решения', category: 'confidence' },
  { id: 59, text: 'Я горжусь тем, кем являюсь и кем становлюсь', category: 'confidence' },
  { id: 60, text: 'Моя внутренняя сила безгранична — я могу всё, что задумаю', category: 'confidence' },
];

export function getRandomAffirmation(category?: string): Affirmation {
  const pool = category
    ? affirmations.filter((a) => a.category === category)
    : affirmations;

  return pool[Math.floor(Math.random() * pool.length)];
}

export function getDailyAffirmation(userId: string, date?: Date): Affirmation {
  const now = date ?? new Date();
  const daysSinceEpoch = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));

  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) | 0;
  }

  const index = Math.abs((hash + daysSinceEpoch) % affirmations.length);
  return affirmations[index];
}

export function getDailyAffirmationIndex(userId: string, date?: Date): number {
  const now = date ?? new Date();
  const daysSinceEpoch = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));

  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) | 0;
  }

  return Math.abs((hash + daysSinceEpoch) % affirmations.length);
}

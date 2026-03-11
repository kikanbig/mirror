export const runesEs: Record<
  string,
  {
    nameRu: string;
    meaning: { upright: string; reversed: string };
    keywords: string[];
    deity: string;
    advice: string;
    divinatory: { upright: string; reversed: string };
  }
> = {
  fehu: {
    nameRu: 'Fehu',
    meaning: {
      upright:
        'Fehu es la runa de la riqueza, la abundancia y la prosperidad material. Señala el flujo de energía creativa que se manifiesta como ganancia tangible: recompensas merecidas, nuevos proyectos que dan fruto y el poder fértil de las posesiones utilizadas con sabiduría.',
      reversed:
        'Fehu invertida advierte sobre pérdidas, codicia o recursos desperdiciados. La riqueza se escapa entre dedos descuidados; las inversiones fracasan y lo que antes era abundante se convierte en escasez. Cuídate de la obsesión por lo material a costa del espíritu.',
    },
    keywords: ['riqueza', 'abundancia', 'prosperidad', 'nutrición', 'plenitud'],
    deity: 'Freya',
    advice:
      'Comparte tu abundancia con generosidad, pues la riqueza que circula crece. Lo que acaparas se estanca y se deteriora.',
    divinatory: {
      upright: 'Una ganancia financiera se acerca. Un período de prosperidad y comodidad material se abre ante ti.',
      reversed:
        'Cuidado con pérdidas económicas o gastos imprudentes. Algo valioso puede escapársete si no estás atento.',
    },
  },
  uruz: {
    nameRu: 'Uruz',
    meaning: {
      upright:
        'Uruz encarna la fuerza cruda y primordial — el poder indómito del uro. Anuncia un tiempo de vitalidad, salud y resistencia. Nuevas formas se moldean a partir de la energía salvaje del devenir.',
      reversed:
        'Uruz invertida indica debilidad, enfermedad o fuerza mal dirigida. Tu fortaleza puede volverse en tu contra, o quizás carezcas de la energía necesaria para enfrentar tus desafíos. Un período de baja energía y dudas.',
    },
    keywords: ['fuerza', 'vitalidad', 'salud', 'resistencia', 'poder primordial'],
    deity: 'Thor',
    advice:
      'Abraza tu naturaleza salvaje interior. La verdadera fuerza no se trata de control, sino de canalizar el poder bruto con intención consciente.',
    divinatory: {
      upright: 'Una oleada de energía física y determinación llega. Tienes el poder de dar forma a tu realidad.',
      reversed:
        'Tu vitalidad está agotada. Descansa y recupérate antes de emprender grandes hazañas.',
    },
  },
  thurisaz: {
    nameRu: 'Thurisaz',
    meaning: {
      upright:
        'Thurisaz es la espina que protege y el martillo que golpea. Representa la fuerza reactiva, la defensa de límites y la destrucción catalizadora que precede a la renovación. Un portal se alza ante ti, pero espinas custodian el umbral.',
      reversed:
        'Thurisaz invertida advierte sobre vulnerabilidad, indefensión y acciones precipitadas. Puedes quedar expuesto al peligro por complacencia, o tu agresividad puede causar daños involuntarios. Procede con extrema cautela.',
    },
    keywords: ['protección', 'defensa', 'catalizador', 'portal', 'conflicto'],
    deity: 'Thor',
    advice:
      'No actúes con precipitación. Medita antes de golpear, pues la espina corta en ambas direcciones.',
    divinatory: {
      upright: 'Un desafío se aproxima que pondrá a prueba tus defensas. Mantente firme — tienes el poder de superarlo.',
      reversed:
        'Estás expuesto y desprotegido. Evita la confrontación y busca refugio en la sabiduría en lugar de la fuerza.',
    },
  },
  ansuz: {
    nameRu: 'Ansuz',
    meaning: {
      upright:
        'Ansuz es el aliento de Odín — inspiración divina, elocuencia y el don de la comunicación. Llegan mensajes, se revela la sabiduría y la palabra hablada porta un poder transformador. Escucha con atención las señales y los signos.',
      reversed:
        'Ansuz invertida habla de mala comunicación, engaño y sabiduría bloqueada. Las palabras se tuercen o se malinterpretan; mensajes importantes no te llegan. Cuidado con la manipulación y el veneno de los falsos consejeros.',
    },
    keywords: ['comunicación', 'sabiduría', 'inspiración', 'señales', 'mensaje divino'],
    deity: 'Odín',
    advice:
      'Abre tus oídos y aquieta tu mente. Los dioses hablan en susurros — debes estar lo suficientemente quieto para escuchar.',
    divinatory: {
      upright: 'Un mensaje importante o un mentor aparece. Presta mucha atención a las palabras, sueños y señales a tu alrededor.',
      reversed:
        'Los malentendidos nublan tu camino. Verifica la información con cuidado y no confíes en palabras halagadoras.',
    },
  },
  raidho: {
    nameRu: 'Raidho',
    meaning: {
      upright:
        'Raidho es la runa del viaje — tanto el viaje físico como el camino interior de la evolución personal. Habla de ritmo, orden correcto y la ley cósmica que gobierna todo movimiento. El camino te llama hacia adelante.',
      reversed:
        'Raidho invertida señala disrupción, retrasos y pérdida de dirección. Los planes se tuercen, los viajes traen complicaciones y puedes sentirte atrapado en un ciclo que no lleva a ningún lado. La brújula interior ha perdido su rumbo.',
    },
    keywords: ['viaje', 'movimiento', 'ritmo', 'dirección', 'peregrinación'],
    deity: 'Thor',
    advice:
      'Confía en el viaje, incluso cuando el camino se dobla inesperadamente. Cada desvío enseña lo que el camino recto no puede.',
    divinatory: {
      upright: 'Un viaje o una transición vital significativa es inminente. Los eventos se alinean con propósito.',
      reversed:
        'Los planes se retrasan o descarrilan. Reevalúa tu dirección antes de seguir avanzando a ciegas.',
    },
  },
  kenaz: {
    nameRu: 'Kenaz',
    meaning: {
      upright:
        'Kenaz es la antorcha del conocimiento, la creatividad y la iluminación interior. Revela lo que estaba oculto, enciende la pasión y trae claridad a la oscuridad. La habilidad técnica, el arte y el fuego de la inspiración arden con intensidad.',
      reversed:
        'Kenaz invertida indica oscuridad, bloqueo creativo y pasión que se extingue. La llama interior titila y muere; la ignorancia y la confusión prevalecen. Las relaciones pueden perder su chispa y las ilusiones se rompen dolorosamente.',
    },
    keywords: ['conocimiento', 'creatividad', 'iluminación', 'pasión', 'arte'],
    deity: 'Heimdall',
    advice:
      'Alimenta la llama de tu curiosidad. El conocimiento transforma a quien lo busca — deja que el aprendizaje te renueve.',
    divinatory: {
      upright: 'Un estallido de inspiración creativa o claridad llega. Una verdad oculta sale a la luz.',
      reversed:
        'Estás a oscuras sobre algo importante. Busca conocimiento antes de actuar.',
    },
  },
  gebo: {
    nameRu: 'Gebo',
    meaning: {
      upright:
        'Gebo es la runa del regalo sagrado — generosidad, asociación y el intercambio que une. Todo regalo verdadero crea un vínculo entre quien da y quien recibe. Contratos, alianzas y actos de amor llevan la marca de esta runa.',
      reversed:
        'Gebo no tiene posición invertida en la lectura tradicional, pero su sombra habla de obligación, condiciones ocultas tras los regalos y asociaciones construidas sobre desigualdad. Cuidado con las deudas que te atan de maneras no deseadas.',
    },
    keywords: ['regalo', 'asociación', 'generosidad', 'equilibrio', 'intercambio'],
    deity: 'Odín',
    advice:
      'Da libremente sin esperar nada a cambio. Los regalos más verdaderos son aquellos que enriquecen tanto a quien da como a quien recibe.',
    divinatory: {
      upright: 'Una asociación significativa o una oferta generosa aparece. Acepta con gratitud y corresponde con gracia.',
      reversed:
        'Un regalo puede traer obligaciones ocultas. Examina los términos de cualquier acuerdo con cuidado.',
    },
  },
  wunjo: {
    nameRu: 'Wunjo',
    meaning: {
      upright:
        'Wunjo es la runa de la alegría, la armonía y la satisfacción profunda. Señala un tiempo en que los deseos se cumplen, los lazos de parentesco se fortalecen y el alma encuentra su lugar de pertenencia. La celebración y el éxito coronan tus esfuerzos.',
      reversed:
        'Wunjo invertida trae tristeza, alienación y desilusión. La alegría se convierte en pena; lo que parecía perfecto revela sus defectos. El distanciamiento de seres queridos o una crisis de sentido pueden ensombrecer tus días.',
    },
    keywords: ['alegría', 'armonía', 'plenitud', 'pertenencia', 'celebración'],
    deity: 'Freyr',
    advice:
      'Saborea plenamente este momento de felicidad. La alegría no es un destino sino una compañera de camino — deja que camine a tu lado.',
    divinatory: {
      upright: 'Un período de felicidad genuina y éxito se acerca. Las relaciones florecen y los objetivos se alcanzan.',
      reversed:
        'La decepción o la distancia emocional te pesan. Busca la causa raíz en lugar de enmascarar el dolor.',
    },
  },
  hagalaz: {
    nameRu: 'Hagalaz',
    meaning: {
      upright:
        'Hagalaz es el granizo — disrupción repentina, fuerzas elementales más allá de tu control y la transformación radical que sigue a la destrucción. Es la semilla cósmica de potencial oculta en la catástrofe, la fractura necesaria antes del renacimiento.',
      reversed:
        'Incluso invertida, Hagalaz conserva su naturaleza disruptiva, aunque puede indicar un período prolongado de estancamiento tras la crisis, o una negativa a aceptar la lección transformadora dentro de la destrucción. La resistencia solo profundiza el sufrimiento.',
    },
    keywords: ['disrupción', 'transformación', 'crisis', 'fuerza elemental', 'liberación'],
    deity: 'Hel',
    advice:
      'No te resistas a la tormenta. Lo que cae no era verdaderamente tuyo. Entre los escombros, las semillas de un nuevo comienzo esperan.',
    divinatory: {
      upright: 'Un trastorno inesperado sacude tus cimientos. Esta destrucción despeja espacio para algo nuevo.',
      reversed:
        'Te aferras a lo que la tormenta ya se ha llevado. Suéltalo y permite que la sanación comience.',
    },
  },
  nauthiz: {
    nameRu: 'Nauthiz',
    meaning: {
      upright:
        'Nauthiz es la runa de la necesidad, la restricción y la fricción que enciende el fuego interior. La adversidad se convierte en la fragua donde se templa el carácter. La necesidad enseña paciencia, resiliencia y el arte de arreglarse con lo que se tiene.',
      reversed:
        'Nauthiz invertida amplifica la privación y la desesperación. Las necesidades no se satisfacen, la frustración se acumula y puedes sentirte atrapado por circunstancias que escapan a tu poder. La autocompasión y la amargura envenenan el pozo de la resistencia.',
    },
    keywords: ['necesidad', 'restricción', 'resistencia', 'constancia', 'autosuficiencia'],
    deity: 'Skuld',
    advice:
      'Abraza la restricción como maestra. El arco debe tensarse hacia atrás antes de que la flecha pueda volar hacia adelante.',
    divinatory: {
      upright: 'La adversidad revela tu verdadera fuerza. Enfrenta tus necesidades con honestidad y trabaja con paciencia a través de la limitación.',
      reversed:
        'El sufrimiento sin propósito te drena. Identifica lo que verdaderamente necesitas y libera los deseos falsos.',
    },
  },
  isa: {
    nameRu: 'Isa',
    meaning: {
      upright:
        'Isa es la runa del hielo — quietud, estasis y el poder concentrado de la inacción. El tiempo se congela; el progreso se detiene. Sin embargo, dentro de esta quietud yace la claridad, la autopreservación y el descanso profundo antes del deshielo.',
      reversed:
        'Isa invertida sugiere un deshielo lento y doloroso, o una negativa a moverse cuando el hielo ya se ha resquebrajado bajo tus pies. La frialdad emocional, el aislamiento y la rigidez psicológica bloquean el crecimiento y la conexión.',
    },
    keywords: ['quietud', 'hielo', 'estasis', 'concentración', 'paciencia'],
    deity: 'Verdandi',
    advice:
      'Quédate quieto. No todo momento exige acción. A veces el camino más sabio es esperar y observar.',
    divinatory: {
      upright: 'Un período de pausa es necesario. Usa esta quietud para la reflexión interior y la consolidación.',
      reversed:
        'El estancamiento se ha convertido en parálisis. El hielo debe romperse — encuentra el valor para moverte de nuevo.',
    },
  },
  jera: {
    nameRu: 'Jera',
    meaning: {
      upright:
        'Jera es la runa de la cosecha — el paciente girar del año que trae la recompensa por el trabajo honesto. Lo que has sembrado ahora madura. Los ciclos se completan, la justicia se cumple y la abundancia merecida llega en su propia estación.',
      reversed:
        'Jera invertida advierte sobre mal momento, ciclos perdidos y la cosecha amarga de semillas mal plantadas. La paciencia se agotó demasiado pronto, o los frutos de tu labor resultan escasos. La ley natural no puede apresurarse.',
    },
    keywords: ['cosecha', 'ciclos', 'paciencia', 'recompensa', 'ley natural'],
    deity: 'Freyr',
    advice:
      'Confía en el ritmo de las estaciones. Lo que se plantó con cuidado dará fruto — pero solo en su propio tiempo.',
    divinatory: {
      upright: 'Tus esfuerzos dan fruto al fin. Un ciclo se completa y la recompensa merecida llega a ti.',
      reversed:
        'El momento aún no es el adecuado. Se requiere paciencia — no intentes forzar la cosecha.',
    },
  },
  eihwaz: {
    nameRu: 'Eihwaz',
    meaning: {
      upright:
        'Eihwaz es el tejo — el eje entre la vida y la muerte, la resistencia a través de las eras y la flexibilidad resiliente del arco. Conecta los mundos de los vivos y los muertos, otorgando acceso a la profunda sabiduría ancestral y protección contra el daño.',
      reversed:
        'Eihwaz invertida señala confusión entre reinos, miedo a la muerte o la transformación, y una pérdida del arraigo profundo que te sustenta. Puedes estar desequilibrado, desconectado de tu centro espiritual.',
    },
    keywords: ['resistencia', 'protección', 'transformación', 'conexión', 'resiliencia'],
    deity: 'Odín',
    advice:
      'Dóblate pero no te quiebres. Como el tejo, tu fuerza reside en la flexibilidad — arraiga profundo y mécete con la tormenta.',
    divinatory: {
      upright: 'Estás protegido a través de un pasaje difícil. Confía en tu resiliencia interior — resistirás.',
      reversed:
        'El miedo al cambio te paraliza. Recuerda que la transformación no es muerte — es renacimiento.',
    },
  },
  perthro: {
    nameRu: 'Perthro',
    meaning: {
      upright:
        'Perthro es la runa del destino, el misterio y los mecanismos ocultos del wyrd. Como el lanzamiento de las suertes, revela la interacción entre el destino y el libre albedrío. Los secretos emergen, los talentos ocultos se manifiestan y el velo entre lo conocido y lo desconocido se adelgaza.',
      reversed:
        'Perthro invertida advierte sobre sorpresas desagradables, secretos que deberían permanecer ocultos y la frustración del estancamiento. El destino parece obrar en tu contra; los misterios se profundizan en lugar de resolverse. Evita apostar en todas sus formas.',
    },
    keywords: ['destino', 'misterio', 'secretos', 'azar', 'lo desconocido'],
    deity: 'Frigg',
    advice:
      'No todos los misterios deben resolverse de inmediato. Confía en que lo oculto se revelará cuando el momento sea el adecuado.',
    divinatory: {
      upright: 'Un secreto sale a la luz, o un golpe de suerte gira los eventos a tu favor. El destino te sonríe.',
      reversed:
        'Asuntos ocultos complican tu situación. No apuestes ni tomes riesgos innecesarios en este momento.',
    },
  },
  algiz: {
    nameRu: 'Algiz',
    meaning: {
      upright:
        'Algiz es la runa escudo — protección divina, el instinto de autopreservación y la conexión con la tutela espiritual superior. Como la juncia que corta a quien la agarra sin cuidado, advierte a los enemigos y ampara a los dignos.',
      reversed:
        'Algiz invertida señala vulnerabilidad, defensas bajas y una conexión cortada con las fuerzas protectoras. Puedes estar expuesto al peligro o la manipulación. Tu guardia espiritual está baja — amenazas ocultas rondan sin ser vistas.',
    },
    keywords: ['protección', 'guardián', 'santuario', 'instinto', 'yo superior'],
    deity: 'Heimdall',
    advice:
      'Mantente alerta y confía en tus instintos. Los dioses protegen a quienes permanecen vigilantes — elévate y su escudo te cubrirá.',
    divinatory: {
      upright: 'Estás divinamente protegido. Surgen oportunidades que puedes perseguir con confianza.',
      reversed:
        'Tus defensas están comprometidas. Ten cautela con en quién confías y por dónde caminas.',
    },
  },
  sowilo: {
    nameRu: 'Sowilo',
    meaning: {
      upright:
        'Sowilo es la runa del sol — luz triunfante, victoria, plenitud y la fuerza vital que disipa toda sombra. Trae éxito, vitalidad y la claridad de propósito que guía al héroe hacia la gloria. El alma brilla en su máximo esplendor.',
      reversed:
        'Sowilo invertida proyecta la sombra del falso orgullo, el agotamiento y la ambición equivocada. La luz que debería guiar se convierte en resplandor cegador. El ego se infla, el juicio falla y puedes perseguir la gloria a un costo destructivo.',
    },
    keywords: ['victoria', 'luz', 'éxito', 'vitalidad', 'plenitud'],
    deity: 'Baldur',
    advice:
      'Deja que tu luz interior guíe tu camino. La victoria pertenece a quienes actúan con claridad, honor y propósito auténtico.',
    divinatory: {
      upright: 'El éxito y el reconocimiento coronan tus esfuerzos. Un tiempo de confianza radiante y logros.',
      reversed:
        'Cuidado con la arrogancia o el agotamiento. Tu ambición puede estar alejándote de tu verdadero camino.',
    },
  },
  tiwaz: {
    nameRu: 'Tiwaz',
    meaning: {
      upright:
        'Tiwaz es la runa del dios del cielo Tyr — honor, justicia, sacrificio personal y coraje guerrero. Exige que actúes con integridad incluso a costo personal. Los asuntos legales se resuelven favorablemente y las causas justas prevalecen.',
      reversed:
        'Tiwaz invertida advierte sobre injusticia, cobardía y juramentos rotos. El honor está comprometido, ya sea por tus propias acciones o las de otros. Las disputas legales se tornan desfavorables y el coraje para hacer lo correcto puede flaquear.',
    },
    keywords: ['honor', 'justicia', 'coraje', 'sacrificio', 'liderazgo'],
    deity: 'Tyr',
    advice:
      'Defiende lo que es justo, incluso cuando el costo sea alto. El verdadero honor se forja en los momentos en que transigir sería más fácil.',
    divinatory: {
      upright: 'La justicia prevalece. Actúa con honor e integridad — la victoria favorece a los justos.',
      reversed:
        'Una injusticia se avecina. Protege tu integridad y no comprometas tus principios por conveniencia.',
    },
  },
  berkano: {
    nameRu: 'Berkano',
    meaning: {
      upright:
        'Berkano es la diosa del abedul — nacimiento, crianza, crecimiento y el poder suave de los nuevos comienzos. Señala fertilidad, armonía doméstica y el despliegue tranquilo y constante del potencial. Algo tierno y nuevo entra en tu vida.',
      reversed:
        'Berkano invertida habla de crecimiento sofocado, discordia familiar y esterilidad creativa. Los instintos de crianza se convierten en control asfixiante; los nuevos comienzos nacen muertos. La ansiedad por el futuro bloquea el proceso natural de devenir.',
    },
    keywords: ['nacimiento', 'crecimiento', 'crianza', 'renovación', 'fertilidad'],
    deity: 'Frigg',
    advice:
      'Cuida con paciencia y esmero lo que acaba de nacer en tu vida. El crecimiento no puede forzarse — debe nutrirse con suavidad.',
    divinatory: {
      upright: 'Nuevos comienzos florecen. Un nacimiento, un nuevo inicio o un crecimiento personal se despliega naturalmente.',
      reversed:
        'El crecimiento está bloqueado o un nuevo proyecto lucha por avanzar. Examina qué está sofocando tu desarrollo natural.',
    },
  },
  ehwaz: {
    nameRu: 'Ehwaz',
    meaning: {
      upright:
        'Ehwaz es la runa del caballo — asociación leal, progreso veloz y el vínculo armonioso entre jinete y corcel. Representa la confianza, el trabajo en equipo y el movimiento que surge cuando dos fuerzas trabajan en perfecto acuerdo.',
      reversed:
        'Ehwaz invertida indica desconfianza, progreso detenido y asociaciones fuera de sincronía. El movimiento se detiene; las colaboraciones fracasan y el viaje se siente como una lucha contra la corriente en lugar de fluir con ella.',
    },
    keywords: ['asociación', 'confianza', 'progreso', 'lealtad', 'trabajo en equipo'],
    deity: 'Freyr',
    advice:
      'El verdadero progreso llega a través de la asociación. Encuentra a quienes cuya fuerza complementa la tuya y cabalguen juntos hacia adelante.',
    divinatory: {
      upright: 'Progreso rápido y armonioso a través del trabajo en equipo. Un aliado de confianza fortalece tu camino.',
      reversed:
        'Una asociación tambalea o el progreso se detiene. Reconstruye la confianza antes de intentar avanzar.',
    },
  },
  mannaz: {
    nameRu: 'Mannaz',
    meaning: {
      upright:
        'Mannaz es la runa de la humanidad — autoconciencia, vínculos sociales y la chispa divina dentro de cada persona. Te llama a examinarte honestamente, cultivar tus dones y ocupar tu lugar legítimo dentro de la comunidad humana.',
      reversed:
        'Mannaz invertida advierte sobre autoengaño, aislamiento y la negativa a ver tu propia sombra. Puedes proyectar tus defectos en otros o retirarte de la comunidad. Sin una autorreflexión honesta, el crecimiento se estanca.',
    },
    keywords: ['humanidad', 'autoconocimiento', 'comunidad', 'inteligencia', 'interdependencia'],
    deity: 'Heimdall',
    advice:
      'Conócete a ti mismo honestamente — tanto la luz como la sombra. Solo a través de la verdadera autoconciencia puedes servir a otros y cumplir tu propósito.',
    divinatory: {
      upright: 'La autorreflexión trae una percepción profunda. La cooperación con otros conduce al crecimiento mutuo.',
      reversed:
        'Puede que te estés engañando a ti mismo. Retrocede, busca consejo honesto y mira dentro con ojos implacables.',
    },
  },
  laguz: {
    nameRu: 'Laguz',
    meaning: {
      upright:
        'Laguz es la runa del agua — intuición, lo inconsciente, los sueños y la fuerza fluyente de la vida misma. Te invita a confiar en tu conocimiento profundo, a ir con la corriente y a dejar que la emoción guíe donde la lógica no puede llegar.',
      reversed:
        'Laguz invertida advierte sobre desbordamiento emocional, confusión y la resaca del inconsciente. Puedes estar ahogándote en sentimientos, perdido en ilusiones, o ignorando las corrientes sutiles que moldean tu vida. El miedo a las profundidades te paraliza.',
    },
    keywords: ['intuición', 'flujo', 'sueños', 'emoción', 'lo inconsciente'],
    deity: 'Njord',
    advice:
      'Confía en la corriente bajo la superficie. Tu intuición conoce el camino — aquieta tu mente y deja que las aguas profundas te guíen.',
    divinatory: {
      upright: 'Sigue tu intuición ahora. Los sueños y el conocimiento interior portan mensajes de gran importancia.',
      reversed:
        'La confusión emocional nubla tu juicio. Ancla tus pies antes de tomar decisiones importantes.',
    },
  },
  ingwaz: {
    nameRu: 'Ingwaz',
    meaning: {
      upright:
        'Ingwaz es la runa de la semilla — potencial, gestación y el espacio sagrado del desarrollo interior. Como una semilla en la tierra oscura, algo poderoso crece en tu interior sin ser visto. La culminación de una fase crea las condiciones para un nuevo comienzo magnífico.',
      reversed:
        'Ingwaz invertida sugiere impotencia, energía dispersa y ciclos inconclusos. La semilla no germina; el potencial queda sin realizar. Puedes estar disipando tu fuerza vital en demasiadas direcciones sin permitir que nada arraigue plenamente.',
    },
    keywords: ['potencial', 'gestación', 'fertilidad', 'culminación', 'crecimiento interior'],
    deity: 'Freyr',
    advice:
      'Retírate a tu santuario interior y deja que la semilla de tu devenir crezca en silencio. Lo que gesta en la oscuridad emergerá con gloria.',
    divinatory: {
      upright: 'Un período de incubación fructífera. Confía en el proceso — lo que crece en tu interior se manifestará con poder.',
      reversed:
        'La energía está dispersa y sin enfoque. Consolida tus esfuerzos y comprométete plenamente con un solo camino.',
    },
  },
  dagaz: {
    nameRu: 'Dagaz',
    meaning: {
      upright:
        'Dagaz es la runa del amanecer — despertar radical, avance decisivo y el punto de inflexión donde la oscuridad cede ante la luz ardiente. Marca el momento preciso de transformación en que todo cambia. La esperanza, la claridad y un nuevo alba llegan.',
      reversed:
        'Dagaz invertida puede señalar un falso amanecer o resistencia al avance que intenta producirse. Estás en el umbral de la transformación pero vacilas, aferrándote a la oscuridad familiar en lugar de dar el paso hacia la luz.',
    },
    keywords: ['avance', 'despertar', 'amanecer', 'transformación', 'esperanza'],
    deity: 'Baldur',
    advice:
      'La hora más oscura llega justo antes del alba. Da un paso audaz hacia el nuevo día — la transformación aguarda a quienes abrazan la luz.',
    divinatory: {
      upright: 'Un avance poderoso ilumina tu camino. Abraza este punto de inflexión con los brazos abiertos.',
      reversed:
        'Resistes la transformación que te llama. Suelta tu agarre de lo viejo — el nuevo día no esperará para siempre.',
    },
  },
  othala: {
    nameRu: 'Othala',
    meaning: {
      upright:
        'Othala es la runa de la herencia ancestral — patria, legado y la tierra sagrada de la pertenencia. Te conecta con la sabiduría de tu linaje, la seguridad del hogar y la riqueza espiritual transmitida de generación en generación.',
      reversed:
        'Othala invertida advierte sobre desarraigo, conflictos familiares y la pérdida de lo que alguna vez fue seguro. Disputas de herencia, desamparo del cuerpo o del espíritu, y la dolorosa ruptura de vínculos ancestrales pueden perturbarte.',
    },
    keywords: ['herencia', 'patria', 'ancestros', 'pertenencia', 'legado'],
    deity: 'Odín',
    advice:
      'Honra tus raíces y la sabiduría de quienes te precedieron. La verdadera riqueza es el legado de amor y conocimiento transmitido entre generaciones.',
    divinatory: {
      upright: 'Asuntos del hogar, la familia y la herencia traen estabilidad. Tus raíces se fortalecen y te sostienen.',
      reversed:
        'Tensiones familiares o disputas de propiedad crean inquietud. Busca sanar las heridas ancestrales en lugar de perpetuarlas.',
    },
  },
};

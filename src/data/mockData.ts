export type MusicCategory = 'Violão' | 'Bateria' | 'Contrabaixo' | 'Reaper' | 'Mixagem' | 'Podcast';

export type MusicLevel = 'Nível Zero' | 'Aprendiz' | 'Mediano' | 'Profissional' | 'Avançado';

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  description: string;
  category: MusicCategory;
  level: MusicLevel;
  videoUrl: string; // URL simulada ou embed do YouTube/Vimeo
  isFree?: boolean;
  thumbnail: string;
}

export interface EquipmentComment {
  user: string;
  text: string;
  rating: number;
}

export interface Equipment {
  id: string;
  name: string;
  type: 'Baterias' | 'Violões' | 'Guitarras' | 'Microfones' | 'Interfaces' | 'Monitores' | 'Plugins' | 'Fones';
  imageUrl: string;
  rating: number;
  description: string;
  reviewText: string;
  videoDemoUrl: string;
  comments: EquipmentComment[];
}

export interface LiveSession {
  id: string;
  title: string;
  presenter: string;
  date: string;
  time: string;
  status: 'scheduled' | 'replay';
  videoUrl?: string;
}

export interface MarketplaceItem {
  id: string;
  name: string;
  type: 'VSTs' | 'Presets' | 'Sample Packs' | 'Cursos' | 'Materiais Digitais';
  price: number;
  description: string;
  thumbnail: string;
}

export interface PostComment {
  id: string;
  userName: string;
  userInstrument: string;
  content: string;
  date: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorInstrument: string;
  authorLevel: string;
  authorAvatar: string;
  content: string;
  videoUrl?: string; // Simulação de vídeo de evolução
  likes: number;
  comments: PostComment[];
  date: string;
}

// 1. AULAS & CATEGORIAS (MOCK DATA DE EXEMPLO COMPLETO)
export const lessonsData: Lesson[] = [
  // --- VIOLÃO ---
  {
    id: 'vio-01',
    title: 'Apostura Correta e Primeiros Acordes',
    duration: '12 min',
    description: 'Aprenda como segurar o violão, posicionar os dedos e tocar seus primeiros acordes básicos (Lá Maior e Ré Maior) de forma confortável e sem dores.',
    category: 'Violão',
    level: 'Nível Zero',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'vio-02',
    title: 'Entendendo a Afinação e o Metrônomo',
    duration: '15 min',
    description: 'Como afinar seu violão usando afinadores de celular e como treinar no tempo correto usando o metrônomo para criar memória muscular sólida.',
    category: 'Violão',
    level: 'Nível Zero',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1525201548942-d8c8b09d55f0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'vio-03',
    title: 'A Batida de Pop e Rock Essencial',
    duration: '18 min',
    description: 'Domine a batida rítmica mais tocada no mundo. Dividida passo a passo para você tocar centenas de músicas populares rapidamente.',
    category: 'Violão',
    level: 'Aprendiz',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1447858268440-af3621e78119?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'vio-04',
    title: 'Pestanas Sem Segredos e Transição Rápida',
    duration: '22 min',
    description: 'A pestana é o terror dos iniciantes, mas com a técnica de pivô correta, você aprenderá a tirar o som limpo sem precisar de força excessiva.',
    category: 'Violão',
    level: 'Mediano',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1485686531765-ba63b07845a7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'vio-05',
    title: 'Arpejos de Jazz e Cordas Soltas',
    duration: '28 min',
    description: 'Introdução ao estudo de harmonias complexas. Usando acordes de jazz e técnicas modernas de dedilhado e condução de vozes.',
    category: 'Violão',
    level: 'Profissional',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1550244764-2b68b6212cb2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'vio-06',
    title: 'Fingerstyle Avançado e Técnicas de Percussão',
    duration: '35 min',
    description: 'Toque melodia, baixo e percussão ao mesmo tempo no violão. Análise profunda de arranjos de artistas renomados.',
    category: 'Violão',
    level: 'Avançado',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1605722243979-fe0be8158232?auto=format&fit=crop&w=800&q=80'
  },

  // --- BATERIA ---
  {
    id: 'bat-01',
    title: 'Pegada de Baquetas e Rebote Básico',
    duration: '10 min',
    description: 'Segure suas baquetas de forma eficiente utilizando a pegada americana e entenda como usar a física do rebote a seu favor.',
    category: 'Bateria',
    level: 'Nível Zero',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'bat-02',
    title: 'O Groove Clássico de Rock (Oitavo de Chimbal)',
    duration: '20 min',
    description: 'Coordenação motora básica separando o pé direito no bumbo, mão esquerda na caixa e mão direita marcando no chimbal.',
    category: 'Bateria',
    level: 'Aprendiz',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1543443374-b6fc11a57268?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'bat-03',
    title: 'Rudimentos Essenciais: Paradiddle e Double Stroke',
    duration: '25 min',
    description: 'Aumente o controle e a velocidade das mãos aplicando os rudimentos clássicos no treino diário do praticável de estudo.',
    category: 'Bateria',
    level: 'Mediano',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'bat-04',
    title: 'Técnicas de Bumbo Duplo e Pivô de Calcanhar',
    duration: '30 min',
    description: 'Domine a precisão e a resistência com pedal duplo. Explicação física das técnicas "Heel-Up", "Heel-Down" e o balanço do pivô.',
    category: 'Bateria',
    level: 'Profissional',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1571327073757-71d13c24de30?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'bat-05',
    title: 'Polirritmia Complexa e Grooves de Fusão',
    duration: '40 min',
    description: 'Independência extrema de membros. Criando sobreposições métricas como 3 contra 4 e aplicando em grooves modernos de Jazz Fusion.',
    category: 'Bateria',
    level: 'Avançado',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1524230507669-529629432258?auto=format&fit=crop&w=800&q=80'
  },

  // --- CONTRA BAIXO ---
  {
    id: 'cb-01',
    title: 'Postura, Timbre e Alternância de Dedos',
    duration: '14 min',
    description: 'Toque sem cansar. Posicionamento do polegar (pivot) no captador, alternando o indicador e o médio de forma fluida.',
    category: 'Contrabaixo',
    level: 'Nível Zero',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cb-02',
    title: 'Linhas de Baixo de Blues e a Escala Pentatônica',
    duration: '18 min',
    description: 'Aprenda o famoso Walking Bass. Como conectar os acordes de um blues de 12 compassos usando notas de passagem e a escala pentatônica.',
    category: 'Contrabaixo',
    level: 'Aprendiz',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1598115483659-b8868302e038?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cb-03',
    title: 'Slap Básico: Domine o Thumb e o Pluck',
    duration: '22 min',
    description: 'Adicione aquela pegada percussiva e estalada típica do Funk dos anos 70 e 80. Técnica exata para iniciantes no Slap.',
    category: 'Contrabaixo',
    level: 'Mediano',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cb-04',
    title: 'Harmonia Funcional no Baixo: Modos Gregos',
    duration: '32 min',
    description: 'Como pensar como um arranjador. Mapeamento completo do braço do instrumento usando os 7 modos gregos e suas aplicações expressivas.',
    category: 'Contrabaixo',
    level: 'Profissional',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1615679955291-b1efd5568f2f?auto=format&fit=crop&w=800&q=80'
  },

  // --- REAPER ---
  {
    id: 'rp-01',
    title: 'Configuração Inicial do Reaper e Placa de Áudio',
    duration: '16 min',
    description: 'Configure seus drivers ASIO de forma perfeita, ajuste o buffer size para latência zero e prepare seu primeiro canal de gravação.',
    category: 'Reaper',
    level: 'Nível Zero',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'rp-02',
    title: 'Gravação e Edição Rápida de Áudio e MIDI',
    duration: '24 min',
    description: 'Atalhos que salvam vidas no Reaper. Cortar, fazer crossfades, alinhar itens no grid e programar baterias midi de forma ágil.',
    category: 'Reaper',
    level: 'Aprendiz',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'rp-03',
    title: 'Roteamento Avançado e Auxiliares (Sends/Buses)',
    duration: '28 min',
    description: 'Crie barramentos de efeitos para economizar CPU. Envio de canais individuais para barramento de reverb e controle absoluto do sinal.',
    category: 'Reaper',
    level: 'Mediano',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80'
  },

  // --- MIXAGEM ---
  {
    id: 'mix-01',
    title: 'A Filosofia da Mixagem e Equilíbrio de Volumes',
    duration: '20 min',
    description: 'Antes dos plugins: a mixagem estática. Como posicionar volumes e pan para construir o palco 3D sonoro da sua música.',
    category: 'Mixagem',
    level: 'Nível Zero',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'mix-02',
    title: 'Equalização Cirúrgica e Corretiva',
    duration: '26 min',
    description: 'Como remover frequências indesejadas (ressonâncias) em violões e vozes para deixar espaço para os outros instrumentos respirarem.',
    category: 'Mixagem',
    level: 'Aprendiz',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'mix-03',
    title: 'Compressão Descomplicada: Threshold, Ratio, Attack',
    duration: '30 min',
    description: 'Controle a dinâmica da sua faixa. Entenda exatamente como ajustar os tempos de ataque e release para colar a bateria e o contrabaixo.',
    category: 'Mixagem',
    level: 'Mediano',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1601312378427-822b2b41da35?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'mix-04',
    title: 'Mixagem de Metal e Guitarras de Alto Ganho',
    duration: '35 min',
    description: 'O segredo dos graves pesados mas limpos. Escultura de frequências médias e compressão paralela no barramento de bateria no Rock/Metal.',
    category: 'Mixagem',
    level: 'Profissional',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80'
  },

  // --- PODCAST ---
  {
    id: 'pod-01',
    title: 'Escolha de Microfones e Acústica Básica de Quarto',
    duration: '15 min',
    description: 'Qual microfone comprar para podcast? Condensador ou Dinâmico? Soluções caseiras baratas para tratar o eco e a reverberação do quarto.',
    category: 'Podcast',
    level: 'Nível Zero',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pod-02',
    title: 'Gravação Multi-canal Físico e Remoto',
    duration: '20 min',
    description: 'Como gravar múltiplos participantes locais em canais separados no computador e como usar ferramentas de internet (Riverside/Zencastr) com qualidade profissional.',
    category: 'Podcast',
    level: 'Aprendiz',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pod-03',
    title: 'Edição de Voz, Truques Antigagueira e Noise Gates',
    duration: '22 min',
    description: 'Remova ruídos de ar-condicionado, respirações barulhentas e hesitações de fala usando ferramentas automatizadas de redução de ruído e portões de áudio.',
    category: 'Podcast',
    level: 'Mediano',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1610116306796-6ebd30d779c6?auto=format&fit=crop&w=800&q=80'
  }
];

// 2. EQUIPAMENTOS & REVIEWS
export const equipmentsData: Equipment[] = [
  {
    id: 'eq-01',
    name: 'Guitarra Yamaha Pacifica 112V',
    type: 'Guitarras',
    imageUrl: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    description: 'A melhor guitarra custo-benefício para iniciantes e intermediários. Configuração HSS (Humbucker e dois Single Coils) para máxima versatilidade.',
    reviewText: 'A Yamaha Pacifica 112V é amplamente considerada um cavalo de batalha. A construção do braço em maple é extremamente estável e o acabamento do corpo é excelente. Os captadores de Alnico V fornecem um brilho incrível nos limpos e um sustain poderoso no canal de distorção Humbucker. O ponto fraco é o sistema de trêmulo clássico, que desafina se for abusado de forma agressiva, mas no geral recebe nossa maior recomendação.',
    videoDemoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    comments: [
      { user: 'Rodrigo M.', text: 'Comprei por indicação da plataforma e não me arrependo! Super confortável de tocar.', rating: 5 },
      { user: 'Carol Guitar', text: 'Os captadores são ótimos, mas troquei a ponte depois de um tempo. Excelente custo-benefício.', rating: 4 }
    ]
  },
  {
    id: 'eq-02',
    name: 'Bateria Eletrônica Roland TD-07DMK',
    type: 'Baterias',
    imageUrl: 'https://images.unsplash.com/photo-1543443374-b6fc11a57268?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    description: 'Peles de Mesh duplo de baixo ruído e módulo TD-07 com Bluetooth integrado para praticar com suas músicas favoritas sem incomodar os vizinhos.',
    reviewText: 'A Roland TD-07DMK traz a confiabilidade do mesh duplo da Roland para uma faixa de preço acessível. O rebote é incrivelmente próximo de uma bateria acústica de verdade. O Bluetooth integrado facilita absurdamente o estudo: você conecta o celular e toca em cima do Spotify ou das aulas de forma natural. O único contra é o tamanho reduzido do rack para bateristas muito altos, que exige ajustes finos de posições.',
    videoDemoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    comments: [
      { user: 'Lucas Drums', text: 'Vizinhos nunca mais reclamaram. O som dos pratos Roland é excelente!', rating: 5 },
      { user: 'Fernando B.', text: 'Excelente resposta das peles de tela. Muito durável.', rating: 5 }
    ]
  },
  {
    id: 'eq-03',
    name: 'Microfone Shure SM7B',
    type: 'Microfones',
    imageUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    description: 'O microfone dinâmico de estúdio padrão da indústria para vozes de podcast, transmissões ao vivo e vocais de rock.',
    reviewText: 'O SM7B dispensa apresentações. Ele é um clássico que perdoa a acústica ruim do seu quarto e captura apenas a riqueza e a profundidade da voz humana de forma aveludada. No entanto, lembre-se: ele consome muito ganho (+60dB). Você vai precisar de uma boa placa ou de um ativador de sinal Inline como o Cloudlifter para tirar o melhor dele.',
    videoDemoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    comments: [
      { user: 'Danilo Cast', text: 'Som de rádio de elite instantâneo. Mas precisa de pré-amplificador bom!', rating: 4 },
      { user: 'Jéssica S.', text: 'Absurdo. Tratei meu quarto básico e as gravações parecem de estúdio profissional.', rating: 5 }
    ]
  },
  {
    id: 'eq-04',
    name: 'Interface de Áudio Focusrite Scarlett 2i2 Gen 4',
    type: 'Interfaces',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    description: 'A interface mais vendida do mundo, agora em sua quarta geração com novos prés de ruído ultra-baixo e conversão com 120dB de range dinâmico.',
    reviewText: 'A Focusrite Scarlett 2i2 Gen 4 renova o padrão de estúdios caseiros. O novo modo "Auto Gain" impede clipadas acidentais durante a gravação, e o recurso "Air" adiciona aquele brilho nos agudos que lembra os consoles analógicos da Focusrite de estúdios de grande porte. A estabilidade de drivers de áudio no Windows usando Reaper melhorou dramaticamente nesta versão.',
    videoDemoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    comments: [
      { user: 'Arthur Mix', text: 'Estabilidade perfeita no Reaper. Função Auto Gain economiza muito tempo.', rating: 5 },
      { user: 'Gabi Bass', text: 'Entrada de instrumento ativa agora aguenta baixos com captadores ativos pesados sem clipar.', rating: 5 }
    ]
  },
  {
    id: 'eq-05',
    name: 'Monitor de Áudio JBL 305P MkII (Par)',
    type: 'Monitores',
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    description: 'Monitores ativos de 5 polegadas bidirecionais com o lendário guia de ondas Image Control Waveguide da JBL para imagens estéreo amplas.',
    reviewText: 'Os monitores JBL 305P MkII são a melhor porta de entrada para quem quer começar a mixar a sério. A dispersão estéreo é tão ampla que você consegue identificar a posição exata dos instrumentos no espaço 3D, mesmo fora da posição de audição ideal. Os graves de 5 polegadas descem bastante, mas cuidado para não colar a saída de ar traseira na parede de casa, o que pode mascarar as baixas frequências.',
    videoDemoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    comments: [
      { user: 'Pedro Henrique', text: 'Muito espacial! O som parece flutuar ao seu redor.', rating: 5 },
      { user: 'Felipe Bass', text: 'Ótima resposta de médios. Meus mixes de baixo melhoraram da noite pro dia.', rating: 4 }
    ]
  },
  {
    id: 'eq-06',
    name: 'Plugin VST Neural DSP Archetype: Petrucci',
    type: 'Plugins',
    imageUrl: 'https://images.unsplash.com/photo-1601312378427-822b2b41da35?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    description: 'Simulação definitiva de amplificadores e efeitos desenvolvida com o mestre John Petrucci do Dream Theater. Sons de metal brutais e limpos cristalinos.',
    reviewText: 'A Neural DSP revolucionou as simulações de amplificador digitais. O Archetype Petrucci traz amplificadores potentes, compressores analógicos simulados e efeitos espaciais de modulação e ambiência de altíssima qualidade. O recurso de transposição de afinação (transpose) em tempo real é assustadoramente preciso, sem artefatos de áudio perceptíveis.',
    videoDemoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    comments: [
      { user: 'Tiago Riffs', text: 'O transpose embutido vale cada centavo. Toco afinado em Drop C usando minha guitarra de afinação padrão instantaneamente!', rating: 5 },
      { user: 'Bia Shred', text: 'O som do amplificador de ganho máximo é absurdo de realista. Sem aquela sensação de abelha das simulações antigas.', rating: 5 }
    ]
  }
];

// 3. LIVES (AGENDA & REPLAYS)
export const livesData: LiveSession[] = [
  {
    id: 'lv-01',
    title: 'Masterclass: Improvisação na Pentatônica com Cordas Soltas',
    presenter: 'Prof. Mateus Asato (Convidado)',
    date: '28/05/2026',
    time: '20:00',
    status: 'scheduled'
  },
  {
    id: 'lv-02',
    title: 'Mentoria Coletiva: Analisando as Gravações e Vídeos dos Alunos',
    presenter: 'Prof. Rafael Bittencourt',
    date: '02/06/2026',
    time: '19:30',
    status: 'scheduled'
  },
  {
    id: 'lv-03',
    title: 'Replay: Dominando as Ondas Graves - Técnicas Avançadas de Mixagem de Bumbo e Baixo',
    presenter: 'Eng. Adair Daufembach',
    date: '15/05/2026',
    time: '120 min',
    status: 'replay',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'lv-04',
    title: 'Replay: Primeiros Passos no Reaper do Zero Absoluto',
    presenter: 'Prof. Thiago Rodrigues',
    date: '08/05/2026',
    time: '90 min',
    status: 'replay',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  }
];

// 4. MARKETPLACE FUTURO (ESTRUTURA FAKE)
export const marketplaceData: MarketplaceItem[] = [
  {
    id: 'mkt-01',
    name: 'Neural Amp Presets - Rock & Metal Pack',
    type: 'Presets',
    price: 49.90,
    description: '30 Presets prontos para Reaper e plugins Neural DSP, focados em timbres de estúdio polidos para guitarras rítmicas pesadas e leads melódicos.',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'mkt-02',
    name: 'Acoustic Drum Kit Samples - Vintage Ludwig',
    type: 'Sample Packs',
    price: 99.00,
    description: 'Sample Pack completo gravado em estúdio lendário com microfones vintage. Batidas e arquivos TCI e GOG para substituição de bateria na mixagem.',
    thumbnail: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'mkt-03',
    name: 'Plugin VST Antigravity Amp Room',
    type: 'VSTs',
    price: 249.00,
    description: 'Nossa simulação exclusiva de amplificador valvulado analógico com gabinete IR dinâmico de 12 microfones clássicos integrados.',
    thumbnail: 'https://images.unsplash.com/photo-1601312378427-822b2b41da35?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'mkt-04',
    name: 'Curso Avançado: O Segredo das Produções de Podcast Milionárias',
    type: 'Cursos',
    price: 199.90,
    description: 'Aprenda roteiro, pós-produção ágil com IA, monetização avançada, patrocínios e estratégias de vídeo para o YouTube no seu podcast.',
    thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80'
  }
];

// 5. POSTS INICIAIS DA COMUNIDADE
export const initialPosts: CommunityPost[] = [
  {
    id: 'post-01',
    authorName: 'Gabriel Nogueira',
    authorInstrument: 'Guitarrista',
    authorLevel: 'Aprendiz',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    content: 'Galera, depois de 3 semanas treinando a aula de pestana sem segredos, finalmente consegui tirar o acorde Fá Maior sem chiar as cordas! O segredo do pivô mudou meu jogo. Postando aqui meu vídeo de evolução tocando Legião Urbana pra receber feedbacks!',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    likes: 24,
    date: 'Há 2 horas',
    comments: [
      { id: 'c-01', userName: 'Thiago Rodrigues', userInstrument: 'Professor', content: 'Incrível Gabriel! A pestana está limpa e no tempo certo. Tente relaxar um pouco mais os ombros no próximo vídeo. Voando!', date: 'Há 1 hora' },
      { id: 'c-02', userName: 'Mariana Costa', userInstrument: 'Violonista', content: 'Que evolução linda! Inspiração pra mim, que ainda estou apanhando do Fá Maior kkkk', date: 'Há 45 min' }
    ]
  },
  {
    id: 'post-02',
    authorName: 'Felipe Batera',
    authorInstrument: 'Baterista',
    authorLevel: 'Mediano',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    content: 'Hoje fiz o teste de resistência com pedal duplo aplicando os rudimentos de Paradiddle na caixa e no bumbo ao mesmo tempo no BPM 130. A Roland TD-07 responde perfeitamente. O que acham dessa sequência de batida para metal melódico?',
    likes: 18,
    date: 'Há 5 horas',
    comments: [
      { id: 'c-03', userName: 'Arthur Drum', userInstrument: 'Baterista', content: 'Brabo demais mano! Se você abaixar um pouco a tensão do pedal esquerdo vai ajudar na constância das semicolcheias.', date: 'Há 3 horas' }
    ]
  }
];

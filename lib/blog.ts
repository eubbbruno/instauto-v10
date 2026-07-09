export interface BlogSection {
  heading?: string;
  body: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string; // ISO
  readingTime: string;
  emoji: string;
  sections: BlogSection[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "quando-trocar-pastilhas-de-freio",
    title: "Quando trocar as pastilhas de freio? 6 sinais de alerta",
    excerpt:
      "Freio é item de segurança que não espera. Veja os sinais de que suas pastilhas estão no fim e evite acidentes e prejuízo maior.",
    category: "Manutenção",
    author: "Equipe Instauto",
    date: "2026-07-01",
    readingTime: "5 min",
    emoji: "🛑",
    sections: [
      {
        body: [
          "As pastilhas de freio são um dos itens de desgaste mais importantes do carro — e um dos mais ignorados. Trocar na hora certa evita danos ao disco de freio (que custa bem mais caro) e, principalmente, mantém você e sua família em segurança.",
          "Em média, as pastilhas duram entre 30.000 e 40.000 km, mas isso varia muito com o estilo de direção e o trânsito da sua cidade. Quem anda muito no trânsito parado desgasta mais rápido.",
        ],
      },
      {
        heading: "1. Barulho de chiado ou guincho ao frear",
        body: [
          "A maioria das pastilhas tem um indicador metálico que produz um chiado agudo quando o material de atrito está no fim. Se você ouve um guincho ao pisar no freio, é sinal quase certo de que chegou a hora.",
        ],
      },
      {
        heading: "2. Barulho de metal raspando metal",
        body: [
          "Se em vez de chiado você ouve um rangido grave, de metal contra metal, a pastilha já passou do ponto e está danificando o disco. Nesse caso, não dirija — leve o carro a uma oficina o quanto antes.",
        ],
      },
      {
        heading: "3. O pedal treme ou 'afunda' mais que o normal",
        body: [
          "Vibração no pedal ou no volante ao frear pode indicar disco empenado por superaquecimento. Um pedal mais mole ou que afunda demais também merece atenção imediata.",
        ],
      },
      {
        heading: "4. A distância de frenagem aumentou",
        body: [
          "Se o carro está demorando mais para parar do que costumava, a eficiência do freio caiu. Nunca ignore isso — é o sinal mais perigoso de todos.",
        ],
      },
      {
        heading: "5. Luz de freio no painel",
        body: [
          "Muitos carros têm sensor de desgaste que acende uma luz específica no painel. Se acendeu, agende a troca.",
        ],
      },
      {
        heading: "6. Inspeção visual: menos de 3 mm",
        body: [
          "Dá para ver a pastilha por trás da roda em muitos modelos. Se a camada de material de atrito estiver com menos de 3 mm, está na hora de trocar.",
        ],
      },
      {
        heading: "Quanto custa e onde trocar",
        body: [
          "O valor varia conforme o modelo do carro e a qualidade da peça. O importante é usar pastilhas de boa procedência e mão de obra qualificada — freio não é lugar para economizar no lugar errado.",
          "Pelo Instauto você descreve o serviço uma vez e recebe orçamentos de várias oficinas da sua cidade, comparando preço e avaliações antes de decidir.",
        ],
      },
    ],
  },
  {
    slug: "de-quanto-em-quanto-tempo-trocar-oleo",
    title: "De quanto em quanto tempo trocar o óleo do carro?",
    excerpt:
      "A troca de óleo é a manutenção mais básica — e a que mais protege o motor. Entenda o intervalo ideal e o que acontece se você atrasar.",
    category: "Manutenção",
    author: "Equipe Instauto",
    date: "2026-06-24",
    readingTime: "4 min",
    emoji: "🛢️",
    sections: [
      {
        body: [
          "O óleo lubrifica, resfria e limpa o motor. Com o tempo ele perde as propriedades e deixa de proteger as peças — e um motor sem lubrificação adequada é a receita para a conta mais cara da sua vida de motorista.",
        ],
      },
      {
        heading: "Qual o intervalo ideal?",
        body: [
          "Depende do tipo de óleo e do manual do seu carro. Como regra geral: óleo mineral a cada 5.000 km, semissintético a cada 7.500 km e sintético a cada 10.000 km ou uma vez por ano — o que vier primeiro.",
          "Sempre siga o manual do fabricante. Ele considera o motor específico do seu veículo e as condições de uso.",
        ],
      },
      {
        heading: "Uso severo pede troca mais frequente",
        body: [
          "Se você anda muito no trânsito parado, faz trajetos curtos, roda em estrada de terra ou puxa carga, o desgaste é maior. Nesses casos, antecipe a troca.",
        ],
      },
      {
        heading: "O que acontece se atrasar",
        body: [
          "Óleo velho vira uma borra que entope dutos e acelera o desgaste. Os sintomas incluem motor mais barulhento, perda de potência, consumo maior de combustível e, no limite, a fundição do motor.",
        ],
      },
      {
        heading: "Não esqueça do filtro",
        body: [
          "Troque o filtro de óleo junto. Um filtro saturado não segura as impurezas e compromete o óleo novo rapidamente.",
          "Precisa fazer a troca? No Instauto você encontra oficinas de confiança na sua cidade e pede orçamento em minutos.",
        ],
      },
    ],
  },
  {
    slug: "revisao-preventiva-vale-a-pena",
    title: "Revisão preventiva: o que é e por que economiza dinheiro",
    excerpt:
      "Muita gente só leva o carro na oficina quando quebra. A revisão preventiva inverte essa lógica — e sai muito mais barato no fim.",
    category: "Dicas",
    author: "Equipe Instauto",
    date: "2026-06-15",
    readingTime: "6 min",
    emoji: "🔧",
    sections: [
      {
        body: [
          "Revisão preventiva é a manutenção feita antes do problema aparecer, seguindo um cronograma por quilometragem ou tempo. É o oposto da manutenção corretiva, que é quando algo já quebrou.",
          "A lógica é simples: é muito mais barato trocar uma correia gasta do que consertar um motor que quebrou porque a correia arrebentou.",
        ],
      },
      {
        heading: "O que costuma entrar numa revisão",
        body: [
          "Os itens variam com a quilometragem, mas geralmente incluem: óleo e filtros, pastilhas e fluido de freio, correia dentada, velas de ignição, alinhamento e balanceamento, suspensão, bateria e o sistema de arrefecimento.",
        ],
      },
      {
        heading: "Por que economiza dinheiro",
        body: [
          "Problemas pequenos detectados cedo custam pouco. Ignorados, viram problemas grandes. Um exemplo clássico: uma pastilha de freio no fim que não é trocada acaba danificando o disco, triplicando o custo do reparo.",
          "Além disso, um carro bem cuidado consome menos combustível, quebra menos na estrada e vale mais na hora de vender.",
        ],
      },
      {
        heading: "De quanto em quanto tempo?",
        body: [
          "O padrão é revisar a cada 10.000 km ou uma vez por ano. Mas confira sempre o plano de manutenção do seu manual — alguns itens têm intervalos próprios (a correia dentada, por exemplo, costuma ser trocada entre 40.000 e 60.000 km).",
        ],
      },
      {
        heading: "Como não cair em furada",
        body: [
          "Escolha oficinas com boa reputação, peça orçamento detalhado por item e desconfie de quem 'acha' problemas demais. Comparar mais de uma oficina ajuda a ter noção do preço justo.",
          "No Instauto você compara oficinas da sua cidade por avaliação e preço, e pede orçamento sem compromisso.",
        ],
      },
    ],
  },
];

export function getAllPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

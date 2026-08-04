export interface ProjectShot {
  src: string;
  caption: string;
}

export interface Project {
  id: string;
  title: string;
  /** Uma linha para o card. Nada de parágrafo. */
  summary: string;
  /** O problema que o produto resolve — aparece no lightbox. */
  role: string;
  year: string;
  tags: string[];
  shots: ProjectShot[];
  liveUrl?: string;
  githubUrl?: string;
  /** Mantido para o ProjectCard, que usa uma imagem só. */
  image: string;
}

/**
 * ⚠️ CONTEÚDO FICTÍCIO — placeholder até os projetos reais entrarem.
 * As imagens em /public/projects são mockups gerados por
 * `scripts/gen-project-mockups.mjs`, não capturas de produtos existentes.
 * Troque este arquivo (e as imagens) antes de divulgar o portfólio.
 */
export const projects: Project[] = [
  {
    id: 'orbit-analytics',
    title: 'Orbit Analytics',
    summary: 'Painel de métricas em tempo real com alertas configuráveis.',
    role:
      'Dashboard para times de produto acompanharem eventos ao vivo. O desafio foi manter ' +
      'a tela fluida recebendo milhares de eventos por minuto — a solução foi agregar no ' +
      'cliente em janelas de tempo e só então repintar os gráficos.',
    year: '2025',
    tags: ['React', 'TypeScript', 'Recharts', 'WebSocket'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    image: '/projects/orbit-analytics-1.svg',
    shots: [
      { src: '/projects/orbit-analytics-1.svg', caption: 'Visão geral com KPIs e série temporal' },
      { src: '/projects/orbit-analytics-2.svg', caption: 'Exploração de eventos com filtros salvos' },
      { src: '/projects/orbit-analytics-3.svg', caption: 'Companion mobile para alertas' },
    ],
  },
  {
    id: 'rota-certa',
    title: 'Rota Certa',
    summary: 'Logística de frota em campo: rastreio, abastecimento e checklist.',
    role:
      'App para motoristas que trabalham sem sinal boa parte do dia. Tudo é gravado local ' +
      'primeiro e sincronizado quando a conexão volta, com resolução de conflito por ' +
      'carimbo de tempo do dispositivo.',
    year: '2025',
    tags: ['React Native', 'Expo', 'SQLite', 'Maps'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    image: '/projects/rota-certa-1.svg',
    shots: [
      { src: '/projects/rota-certa-1.svg', caption: 'Checklist de saída, funciona offline' },
      { src: '/projects/rota-certa-2.svg', caption: 'Painel de custo por veículo' },
      { src: '/projects/rota-certa-3.svg', caption: 'Histórico de abastecimentos' },
    ],
  },
  {
    id: 'cardapio-vivo',
    title: 'Cardápio Vivo',
    summary: 'Cardápio digital com pedido na mesa e cozinha em tempo real.',
    role:
      'QR code na mesa, pedido direto do celular do cliente e um painel de cozinha que ' +
      'atualiza sozinho. O ganho medido foi tirar a comanda de papel do caminho entre o ' +
      'salão e o fogão.',
    year: '2024',
    tags: ['Next.js', 'Prisma', 'Stripe', 'Postgres'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    image: '/projects/cardapio-vivo-1.svg',
    shots: [
      { src: '/projects/cardapio-vivo-1.svg', caption: 'Cardápio do cliente, aberto por QR code' },
      { src: '/projects/cardapio-vivo-2.svg', caption: 'Fila da cozinha por status' },
      { src: '/projects/cardapio-vivo-3.svg', caption: 'Fechamento de caixa do dia' },
    ],
  },
  {
    id: 'fluxo-obras',
    title: 'Fluxo',
    summary: 'Kanban de obras com dependências entre tarefas e medição.',
    role:
      'Gestão de obra onde uma etapa trava a seguinte. O quadro entende dependência: ' +
      'arrastar um cartão recalcula as datas de tudo que vem depois e avisa o que estourou ' +
      'o prazo.',
    year: '2024',
    tags: ['React', 'Zustand', 'dnd-kit', 'Vite'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    image: '/projects/fluxo-obras-1.svg',
    shots: [
      { src: '/projects/fluxo-obras-1.svg', caption: 'Quadro por etapa da obra' },
      { src: '/projects/fluxo-obras-2.svg', caption: 'Linha do tempo e desvio de prazo' },
      { src: '/projects/fluxo-obras-3.svg', caption: 'Medição em campo pelo celular' },
    ],
  },
];

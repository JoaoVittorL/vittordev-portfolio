// Gera mockups SVG fictícios para a seção de projetos.
// Saída: public/projects/<slug>-<1|2|3>.svg
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT = process.argv[2];
mkdirSync(OUT, { recursive: true });

const W = 1200;
const H = 750;

const BG = '#0B1220';
const PANEL = '#111C2E';
const PANEL_2 = '#0E1728';
const LINE = '#1E293B';
const DIM = '#334155';
const TEXT = '#CBD5E1';
const MUTED = '#64748B';

// PRNG com semente — regenerar o script produz exatamente os mesmos arquivos.
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

const bar = (x, y, w, h, fill, r = 3, o = 1) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" opacity="${o}"/>`;

const circle = (cx, cy, r, fill, o = 1) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" opacity="${o}"/>`;

/** Linhas de "texto" falso — barras de larguras variadas. */
const textLines = (x, y, widths, lh, fill, h = 7, o = 0.85) =>
  widths.map((w, i) => bar(x, y + i * lh, w, h, fill, 3, o)).join('');

const chrome = (accent, title) => `
  ${bar(0, 0, W, 40, PANEL_2, 0)}
  ${circle(26, 20, 5.5, '#F87171', 0.85)}
  ${circle(46, 20, 5.5, '#FBBF24', 0.85)}
  ${circle(66, 20, 5.5, '#34D399', 0.85)}
  ${bar(96, 12, 340, 16, BG, 8)}
  ${circle(112, 20, 3.5, accent, 0.9)}
  ${bar(124, 16, 150, 8, DIM, 4, 0.7)}
  <text x="${W - 24}" y="25" text-anchor="end" font-family="ui-monospace,monospace" font-size="11"
        fill="${MUTED}" opacity="0.8">${title}</text>
`;

/** Área com curva suave + preenchimento em degradê. */
function areaChart(x, y, w, h, accent, seed, id) {
  const r = rng(seed);
  const n = 14;
  const pts = Array.from({ length: n }, (_, i) => {
    const px = x + (i / (n - 1)) * w;
    const t = i / (n - 1);
    // tendência de alta + ruído: parece métrica de produto, não serra elétrica
    const py = y + h - (0.25 + t * 0.5 + r() * 0.22) * h;
    return [px, py];
  });

  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
  }

  const grid = Array.from({ length: 4 }, (_, i) =>
    bar(x, y + (i * h) / 4, w, 1, LINE, 0, 0.55),
  ).join('');

  const last = pts[pts.length - 1];

  return `
    <defs>
      <linearGradient id="fill-${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.28"/>
        <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    ${grid}
    <path d="${d} L ${x + w} ${y + h} L ${x} ${y + h} Z" fill="url(#fill-${id})"/>
    <path d="${d}" fill="none" stroke="${accent}" stroke-width="2.5" stroke-linecap="round"/>
    ${circle(last[0], last[1], 4.5, accent)}
    ${circle(last[0], last[1], 9, accent, 0.22)}
  `;
}

function barChart(x, y, w, h, accent, seed) {
  const r = rng(seed);
  const n = 9;
  const gap = 10;
  const bw = (w - gap * (n - 1)) / n;
  return Array.from({ length: n }, (_, i) => {
    const bh = (0.3 + r() * 0.7) * h;
    const isLast = i === n - 1;
    return bar(x + i * (bw + gap), y + h - bh, bw, bh, isLast ? accent : DIM, 3, isLast ? 0.95 : 0.65);
  }).join('');
}

function donut(cx, cy, rad, accent, pct) {
  const c = 2 * Math.PI * rad;
  return `
    <circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="${LINE}" stroke-width="12"/>
    <circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="${accent}" stroke-width="12"
            stroke-linecap="round" stroke-dasharray="${c * pct} ${c}"
            transform="rotate(-90 ${cx} ${cy})"/>
    <text x="${cx}" y="${cy + 7}" text-anchor="middle" font-family="ui-monospace,monospace"
          font-size="13" fill="${TEXT}" font-weight="600">${Math.round(pct * 100)}%</text>
  `;
}

// ---------------------------------------------------------------- arquétipos

function dashboard({ accent, name, seed }) {
  const r = rng(seed);
  const kpi = (i) => {
    const x = 300 + i * 290;
    return `
      ${bar(x, 130, 265, 92, PANEL, 12)}
      ${bar(x, 130, 3, 92, accent, 2, 0.8)}
      ${bar(x + 20, 152, 70, 7, MUTED, 3, 0.7)}
      ${bar(x + 20, 172, 96, 18, TEXT, 4, 0.9)}
      ${bar(x + 20, 200, 46, 6, accent, 3, 0.75)}
    `;
  };

  return `
    ${bar(0, 0, W, H, BG, 0)}
    ${chrome(accent, name)}

    <!-- sidebar -->
    ${bar(0, 40, 260, H - 40, PANEL_2, 0)}
    ${bar(260, 40, 1, H - 40, LINE, 0)}
    ${bar(24, 68, 30, 30, accent, 8, 0.9)}
    ${bar(64, 76, 96, 12, TEXT, 4, 0.8)}
    ${Array.from({ length: 6 }, (_, i) => {
      const y = 140 + i * 46;
      const active = i === 1;
      return `
        ${active ? bar(14, y - 10, 232, 36, accent, 8, 0.12) : ''}
        ${bar(24, y, 14, 14, active ? accent : DIM, 4, active ? 1 : 0.7)}
        ${bar(50, y + 3, 60 + Math.round(r() * 70), 8, active ? TEXT : MUTED, 3, 0.8)}
      `;
    }).join('')}
    ${bar(14, H - 90, 232, 56, PANEL, 10)}
    ${circle(42, H - 62, 14, accent, 0.85)}
    ${textLines(66, H - 72, [78, 52], 16, MUTED, 7, 0.7)}

    <!-- header -->
    ${bar(300, 70, 210, 20, TEXT, 5, 0.9)}
    ${bar(300, 100, 300, 8, MUTED, 3, 0.6)}
    ${bar(W - 150, 68, 120, 30, PANEL, 8)}
    ${bar(W - 136, 79, 60, 8, MUTED, 3, 0.8)}

    ${[0, 1, 2].map(kpi).join('')}

    <!-- gráfico principal -->
    ${bar(300, 250, 555, 300, PANEL, 12)}
    ${bar(324, 274, 130, 10, TEXT, 4, 0.85)}
    ${bar(324, 292, 80, 7, MUTED, 3, 0.6)}
    ${areaChart(324, 320, 507, 200, accent, seed + 7, `a${seed}`)}

    <!-- coluna lateral -->
    ${bar(880, 250, 290, 300, PANEL, 12)}
    ${bar(904, 274, 110, 10, TEXT, 4, 0.85)}
    ${donut(1025, 370, 52, accent, 0.5 + r() * 0.4)}
    ${Array.from({ length: 3 }, (_, i) => `
      ${circle(912, 460 + i * 28, 4, i === 0 ? accent : DIM, 0.9)}
      ${bar(926, 456 + i * 28, 100 + Math.round(r() * 60), 7, MUTED, 3, 0.7)}
      ${bar(1120, 456 + i * 28, 28, 7, TEXT, 3, 0.6)}
    `).join('')}

    <!-- rodapé -->
    ${bar(300, 580, 870, 140, PANEL, 12)}
    ${bar(324, 604, 140, 10, TEXT, 4, 0.85)}
    ${barChart(324, 632, 820, 66, accent, seed + 13)}
  `;
}

function mobile({ accent, name, seed }) {
  const r = rng(seed);
  const PX = 430;
  const PY = 70;
  const PW = 340;
  const PH = 620;

  return `
    ${bar(0, 0, W, H, BG, 0)}
    <defs>
      <radialGradient id="glow-${seed}" cx="50%" cy="35%" r="55%">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.16"/>
        <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect x="0" y="0" width="${W}" height="${H}" fill="url(#glow-${seed})"/>
    ${chrome(accent, name)}

    <!-- texto de apoio à esquerda -->
    ${bar(90, 210, 60, 6, accent, 3, 0.9)}
    ${bar(90, 234, 230, 16, TEXT, 4, 0.85)}
    ${textLines(90, 272, [250, 210, 170], 18, MUTED, 7, 0.55)}
    ${Array.from({ length: 3 }, (_, i) => `
      ${bar(90, 350 + i * 40, 26, 26, PANEL, 7)}
      ${circle(103, 363 + i * 40, 5, accent, 0.8)}
      ${bar(128, 359 + i * 40, 120 + Math.round(r() * 60), 8, MUTED, 3, 0.6)}
    `).join('')}

    <!-- aparelho -->
    ${bar(PX - 4, PY - 4, PW + 8, PH + 8, LINE, 40)}
    ${bar(PX, PY, PW, PH, PANEL_2, 36)}
    ${bar(PX + PW / 2 - 45, PY + 12, 90, 18, BG, 9)}

    <!-- status bar -->
    ${bar(PX + 24, PY + 17, 34, 7, MUTED, 3, 0.7)}
    ${bar(PX + PW - 60, PY + 17, 36, 7, MUTED, 3, 0.7)}

    <!-- header do app -->
    ${bar(PX + 24, PY + 56, 140, 14, TEXT, 4, 0.9)}
    ${bar(PX + 24, PY + 80, 90, 7, MUTED, 3, 0.6)}
    ${circle(PX + PW - 42, PY + 68, 16, PANEL, 1)}
    ${circle(PX + PW - 42, PY + 68, 5, accent, 0.9)}

    <!-- destaque -->
    ${bar(PX + 20, PY + 110, PW - 40, 96, accent, 14, 0.14)}
    ${bar(PX + 38, PY + 132, 80, 7, accent, 3, 0.9)}
    ${bar(PX + 38, PY + 150, 150, 14, TEXT, 4, 0.9)}
    ${bar(PX + 38, PY + 174, 110, 7, MUTED, 3, 0.7)}

    <!-- lista -->
    ${Array.from({ length: 4 }, (_, i) => {
      const y = PY + 226 + i * 82;
      return `
        ${bar(PX + 20, y, PW - 40, 68, PANEL, 12)}
        ${bar(PX + 34, y + 16, 36, 36, accent, 10, 0.18)}
        ${circle(PX + 52, y + 34, 7, accent, 0.85)}
        ${bar(PX + 84, y + 20, 110 + Math.round(r() * 60), 8, TEXT, 3, 0.8)}
        ${bar(PX + 84, y + 38, 70 + Math.round(r() * 50), 7, MUTED, 3, 0.55)}
        ${bar(PX + PW - 66, y + 26, 32, 16, accent, 8, 0.2)}
      `;
    }).join('')}

    <!-- tab bar -->
    ${bar(PX + 1, PY + PH - 66, PW - 2, 65, PANEL, 0)}
    ${bar(PX + 1, PY + PH - 66, PW - 2, 1, LINE, 0)}
    ${Array.from({ length: 4 }, (_, i) => {
      const cx = PX + 56 + i * 76;
      const on = i === 0;
      return `
        ${bar(cx - 9, PY + PH - 46, 18, 18, on ? accent : DIM, 5, on ? 0.95 : 0.5)}
        ${bar(cx - 14, PY + PH - 22, 28, 5, on ? accent : DIM, 3, on ? 0.8 : 0.35)}
      `;
    }).join('')}

    <!-- métricas à direita -->
    ${Array.from({ length: 2 }, (_, i) => `
      ${bar(830, 250 + i * 130, 280, 108, PANEL, 12)}
      ${bar(854, 274 + i * 130, 80, 7, MUTED, 3, 0.7)}
      ${bar(854, 292 + i * 130, 110, 18, TEXT, 4, 0.9)}
      ${barChart(854, 322 + i * 130, 232, 22, accent, seed + i * 5)}
    `).join('')}
  `;
}

function table({ accent, name, seed }) {
  const r = rng(seed);
  const statuses = [accent, '#FBBF24', '#34D399', '#F87171'];

  return `
    ${bar(0, 0, W, H, BG, 0)}
    ${chrome(accent, name)}

    ${bar(0, 40, W, 1, LINE, 0)}

    <!-- cabeçalho -->
    ${bar(56, 78, 240, 18, TEXT, 5, 0.9)}
    ${bar(56, 108, 320, 8, MUTED, 3, 0.55)}
    ${bar(W - 190, 78, 134, 36, accent, 9, 0.9)}
    ${bar(W - 168, 92, 90, 8, BG, 3, 0.9)}

    <!-- filtros -->
    ${(() => {
      const rr = rng(seed + 3);
      let x = 56;
      return Array.from({ length: 5 }, (_, i) => {
        const w = 78 + Math.round(rr() * 56);
        const on = i === 0;
        const el = `
          ${bar(x, 148, w, 30, on ? accent : PANEL, 15, on ? 0.16 : 1)}
          ${bar(x + 16, 159, w - 32, 8, on ? accent : MUTED, 3, on ? 0.9 : 0.6)}
        `;
        x += w + 10;
        return el;
      }).join('');
    })()}
    ${bar(W - 250, 148, 194, 30, PANEL, 8)}
    ${circle(W - 230, 163, 5, MUTED, 0.7)}
    ${bar(W - 216, 159, 100, 8, MUTED, 3, 0.5)}

    <!-- tabela -->
    ${bar(56, 206, W - 112, 470, PANEL, 12)}
    ${bar(56, 206, W - 112, 46, PANEL_2, 12)}
    ${bar(56, 251, W - 112, 1, LINE, 0)}
    ${[0, 1, 2, 3, 4].map((i) => bar(90 + i * 210, 225, [70, 96, 60, 84, 54][i], 8, MUTED, 3, 0.75)).join('')}

    ${Array.from({ length: 8 }, (_, i) => {
      const y = 252 + i * 52;
      const st = statuses[Math.floor(r() * statuses.length)];
      return `
        ${i % 2 === 1 ? bar(57, y, W - 114, 52, PANEL_2, 0, 0.45) : ''}
        ${bar(56, y + 51, W - 112, 1, LINE, 0, 0.7)}
        ${circle(102, y + 26, 11, accent, 0.16)}
        ${circle(102, y + 26, 4, accent, 0.8)}
        ${bar(122, y + 22, 92 + Math.round(r() * 46), 8, TEXT, 3, 0.8)}
        ${bar(300, y + 22, 110 + Math.round(r() * 60), 8, MUTED, 3, 0.55)}
        ${bar(510, y + 22, 70 + Math.round(r() * 30), 8, MUTED, 3, 0.55)}
        ${bar(720, y + 18, 84, 18, st, 9, 0.18)}
        ${bar(736, y + 24, 52, 6, st, 3, 0.9)}
        ${bar(930, y + 22, 60 + Math.round(r() * 40), 8, MUTED, 3, 0.55)}
        ${circle(1112, y + 26, 2.5, DIM, 0.9)}
        ${circle(1120, y + 26, 2.5, DIM, 0.9)}
        ${circle(1128, y + 26, 2.5, DIM, 0.9)}
      `;
    }).join('')}

    <!-- paginação -->
    ${bar(56, 700, 170, 8, MUTED, 3, 0.5)}
    ${Array.from({ length: 4 }, (_, i) => `
      ${bar(W - 190 + i * 36, 690, 28, 28, i === 0 ? accent : PANEL, 7, i === 0 ? 0.9 : 1)}
      ${bar(W - 182 + i * 36, 702, 12, 5, i === 0 ? BG : MUTED, 2, 0.85)}
    `).join('')}
  `;
}

const ARCHETYPES = { dashboard, mobile, table };

const PROJECTS = [
  { slug: 'orbit-analytics', name: 'Orbit Analytics', accent: '#2DD4BF', seed: 101 },
  { slug: 'rota-certa', name: 'Rota Certa', accent: '#60A5FA', seed: 202 },
  { slug: 'cardapio-vivo', name: 'Cardápio Vivo', accent: '#F472B6', seed: 303 },
  { slug: 'fluxo-obras', name: 'Fluxo', accent: '#A78BFA', seed: 404 },
];

// Cada projeto mostra as três telas, mas em ordem diferente: assim a primeira
// miniatura da pasta não é sempre o mesmo layout.
const ORDERS = [
  ['dashboard', 'table', 'mobile'],
  ['mobile', 'dashboard', 'table'],
  ['mobile', 'table', 'dashboard'],
  ['table', 'dashboard', 'mobile'],
];

PROJECTS.forEach((project, pi) => {
  ORDERS[pi].forEach((kind, i) => {
    const body = ARCHETYPES[kind]({ ...project, seed: project.seed + i * 31 });
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">${body}</svg>`;
    const file = join(OUT, `${project.slug}-${i + 1}.svg`);
    /* Colapsa para UM espaço, nunca para nada: `attr="a"\n  attr2="b"` sem o
       espaço vira `attr="a"attr2="b"` e o SVG inteiro deixa de parsear. */
    const minified = svg.replace(/\s*\n\s*/g, ' ').trim();
    writeFileSync(file, minified, 'utf8');
    console.log(`${project.slug}-${i + 1}.svg  (${kind})`);
  });
});

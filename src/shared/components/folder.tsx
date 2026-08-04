import React, { useState } from 'react';

const MAX_PAPERS = 3;

export interface FolderProps {
  /** Cor da pasta. O verso é a mesma cor escurecida, para dar profundidade. */
  color?: string;
  /** Multiplicador sobre a base de 100x80px. */
  size?: number;
  /** Até 3 nós — viram os "papéis" que saem da pasta ao abrir. */
  items?: React.ReactNode[];
  /** Nome acessível do botão (ex.: o nome do projeto). */
  label: string;
  open: boolean;
  onToggle: () => void;
  className?: string;
}

/** Escurece um hex em `amount` (0–1). Usado no verso da pasta. */
function darken(hex: string, amount: number): string {
  const normalized = hex.replace('#', '');
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized;

  const int = parseInt(full.slice(0, 6), 16);
  const channels = [(int >> 16) & 0xff, (int >> 8) & 0xff, int & 0xff].map((channel) =>
    Math.max(0, Math.min(255, Math.floor(channel * (1 - amount)))),
  );

  return `#${channels.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

/* Cada papel abre numa direção diferente — em leque, não empilhado. */
const OPEN_TRANSFORMS = [
  'translate(-116%, -68%) rotate(-14deg)',
  'translate(14%, -68%) rotate(14deg)',
  'translate(-50%, -96%) rotate(4deg)',
];

const CLOSED_SIZES = ['w-[70%] h-[80%]', 'w-[80%] h-[70%]', 'w-[90%] h-[60%]'];
const OPEN_SIZES = ['w-[74%] h-[82%]', 'w-[82%] h-[82%]', 'w-[90%] h-[82%]'];

/**
 * Pasta que abre em leque revelando três "papéis" (aqui, telas do projeto).
 * Baseada no Folder do React Bits, adaptada para ser controlada pelo pai —
 * só uma pasta fica aberta por vez, senão os papéis de pastas vizinhas se
 * sobrepõem no grid.
 *
 * O movimento é todo em CSS transition, então a regra global de
 * `prefers-reduced-motion` no index.css já o neutraliza sem código extra.
 */
const Folder: React.FC<FolderProps> = ({
  color = '#2DD4BF',
  size = 1,
  items = [],
  label,
  open,
  onToggle,
  className = '',
}) => {
  const papers: React.ReactNode[] = [...items.slice(0, MAX_PAPERS)];
  while (papers.length < MAX_PAPERS) papers.push(null);

  /* Deslocamento por papel: o papel acompanha um pouco o cursor quando a pasta
     está aberta. Dá a sensação de folha solta em vez de figurinha colada. */
  const [offsets, setOffsets] = useState(() =>
    Array.from({ length: MAX_PAPERS }, () => ({ x: 0, y: 0 })),
  );

  const resetOffsets = () =>
    setOffsets(Array.from({ length: MAX_PAPERS }, () => ({ x: 0, y: 0 })));

  const handleToggle = () => {
    if (open) resetOffsets();
    onToggle();
  };

  const trackPaper = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (!open) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) * 0.12;
    const y = (event.clientY - (rect.top + rect.height / 2)) * 0.12;

    setOffsets((prev) => prev.map((offset, i) => (i === index ? { x, y } : offset)));
  };

  const releasePaper = (index: number) =>
    setOffsets((prev) => prev.map((offset, i) => (i === index ? { x: 0, y: 0 } : offset)));

  const backColor = darken(color, 0.22);

  return (
    /* O wrapper reserva a caixa de layout no tamanho final; o scale fica no
       filho, com origem no topo-esquerda. Sem isso o grid calcularia a célula
       pelo tamanho base (100x80) e as pastas se sobreporiam. */
    <div
      className={className}
      style={{ width: 100 * size, height: 80 * size }}
    >
      <div style={{ transform: `scale(${size})`, transformOrigin: 'top left' }}>
        <div
          role="button"
          tabIndex={0}
          aria-expanded={open}
          aria-label={open ? `Fechar ${label}` : `Abrir ${label}`}
          onClick={handleToggle}
          onKeyDown={(event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            handleToggle();
          }}
          className={`group relative cursor-pointer rounded transition-transform duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400/60 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950 ${
            open ? '-translate-y-2' : 'hover:-translate-y-2'
          }`}
        >
          <div
            className="relative h-[80px] w-[100px] rounded-b-[10px] rounded-tr-[10px]"
            style={{ backgroundColor: backColor }}
          >
            {/* Aba da pasta */}
            <span
              aria-hidden="true"
              className="absolute bottom-[98%] left-0 z-0 h-[10px] w-[30px] rounded-t-[5px]"
              style={{ backgroundColor: backColor }}
            />

            {papers.map((item, index) => (
              <div
                key={index}
                onMouseMove={(event) => trackPaper(event, index)}
                onMouseLeave={() => releasePaper(index)}
                className={`absolute bottom-[10%] left-1/2 z-20 overflow-hidden rounded-[6px] bg-slate-800 shadow-lg transition-all duration-300 ease-in-out ${
                  open
                    ? `${OPEN_SIZES[index]} hover:z-40 hover:scale-[1.14]`
                    : `${CLOSED_SIZES[index]} -translate-x-1/2 translate-y-[10%] group-hover:translate-y-0`
                }`}
                style={
                  open
                    ? {
                        transform: `${OPEN_TRANSFORMS[index]} translate(${offsets[index].x}px, ${offsets[index].y}px)`,
                      }
                    : undefined
                }
              >
                {item}
              </div>
            ))}

            {/* As duas metades da frente da pasta, que se abrem em "V" */}
            {[15, -15].map((skew) => (
              <div
                key={skew}
                aria-hidden="true"
                className={`absolute z-30 h-full w-full origin-bottom transition-transform duration-300 ease-in-out ${
                  open ? '' : 'group-hover:[transform:skew(var(--skew),0deg)_scaleY(0.6)]'
                }`}
                style={
                  {
                    '--skew': `${skew}deg`,
                    backgroundColor: color,
                    borderRadius: '5px 10px 10px 10px',
                    ...(open ? { transform: `skew(${skew}deg) scaleY(0.6)` } : {}),
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Folder;

import React, { useEffect, useRef } from 'react';

import { useMediaQuery } from '@/shared/hooks/use-media-query';

interface ElectricBorderProps extends React.PropsWithChildren {
  /** Liga o traço. Fora do hover/foco o canvas nem existe. */
  active?: boolean;
  color?: string;
  speed?: number;
  /** Amplitude do ruído. Acima de ~0.2 vira rabisco. */
  chaos?: number;
  borderRadius?: number;
  className?: string;
}

/** Margem em volta do elemento para o traço deslocado não ser cortado. */
const BLEED = 44;
const DISPLACEMENT = 46;
const OCTAVES = 8;
const LACUNARITY = 1.6;
const GAIN = 0.7;
const FREQUENCY = 10;

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized;

  const int = parseInt(full.slice(0, 6), 16);
  return `rgba(${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}, ${alpha})`;
}

const hash = (x: number) => (Math.sin(x * 12.9898) * 43758.5453) % 1;

function noise2D(x: number, y: number) {
  const i = Math.floor(x);
  const j = Math.floor(y);
  const fx = x - i;
  const fy = y - j;

  const a = hash(i + j * 57);
  const b = hash(i + 1 + j * 57);
  const c = hash(i + (j + 1) * 57);
  const d = hash(i + 1 + (j + 1) * 57);

  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
}

/** Ruído fractal: várias oitavas somadas, cada uma mais fina e mais fraca. */
function fractalNoise(x: number, amplitude: number, time: number, seed: number) {
  let value = 0;
  let amp = amplitude;
  let freq = FREQUENCY;

  for (let i = 0; i < OCTAVES; i++) {
    value += amp * noise2D(freq * x + seed * 100, time * freq * 0.3);
    freq *= LACUNARITY;
    amp *= GAIN;
  }

  return value;
}

/** Ponto sobre o perímetro de um retângulo arredondado, em t ∈ [0,1]. */
function pointOnRoundedRect(
  t: number,
  left: number,
  top: number,
  width: number,
  height: number,
  radius: number,
) {
  const straightW = width - 2 * radius;
  const straightH = height - 2 * radius;
  const arc = (Math.PI * radius) / 2;
  const perimeter = 2 * straightW + 2 * straightH + 4 * arc;

  let d = t * perimeter;

  const corner = (cx: number, cy: number, start: number, progress: number) => ({
    x: cx + radius * Math.cos(start + progress * (Math.PI / 2)),
    y: cy + radius * Math.sin(start + progress * (Math.PI / 2)),
  });

  if (d <= straightW) return { x: left + radius + d, y: top };
  d -= straightW;

  if (d <= arc) return corner(left + width - radius, top + radius, -Math.PI / 2, d / arc);
  d -= arc;

  if (d <= straightH) return { x: left + width, y: top + radius + d };
  d -= straightH;

  if (d <= arc) return corner(left + width - radius, top + height - radius, 0, d / arc);
  d -= arc;

  if (d <= straightW) return { x: left + width - radius - d, y: top + height };
  d -= straightW;

  if (d <= arc) return corner(left + radius, top + height - radius, Math.PI / 2, d / arc);
  d -= arc;

  if (d <= straightH) return { x: left, y: top + height - radius - d };
  d -= straightH;

  return corner(left + radius, top + radius, Math.PI, d / arc);
}

/**
 * Contorno elétrico: o perímetro do elemento redesenhado a cada frame com
 * deslocamento por ruído fractal.
 *
 * Diferente do original do React Bits, o loop só roda enquanto `active` for
 * verdadeiro — no portfólio isso é o hover/foco do botão. Parado, o custo é
 * zero e o botão fica exatamente como era.
 */
const ElectricBorder: React.FC<ElectricBorderProps> = ({
  children,
  active = false,
  color = '#2DD4BF',
  speed = 1,
  chaos = 0.1,
  borderRadius = 6,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const running = active && !prefersReducedMotion;

  useEffect(() => {
    if (!running) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!container || !canvas || !ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width + BLEED * 2;
      height = rect.height + BLEED * 2;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    resize();

    let raf = 0;
    let time = 0;
    let last = performance.now();

    const draw = (now: number) => {
      time += ((now - last) / 1000) * speed;
      last = now;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      const boxW = width - BLEED * 2;
      const boxH = height - BLEED * 2;
      const radius = Math.min(borderRadius, Math.min(boxW, boxH) / 2);
      const samples = Math.max(60, Math.floor((2 * (boxW + boxH)) / 2));

      ctx.beginPath();
      for (let i = 0; i <= samples; i++) {
        const t = i / samples;
        const point = pointOnRoundedRect(t, BLEED, BLEED, boxW, boxH, radius);

        const x = point.x + fractalNoise(t * 8, chaos, time, 0) * DISPLACEMENT;
        const y = point.y + fractalNoise(t * 8, chaos, time, 1) * DISPLACEMENT;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    const observer = new ResizeObserver(resize);
    observer.observe(container);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [borderRadius, chaos, color, running, speed]);

  return (
    <div
      ref={containerRef}
      className={`relative isolate ${className}`}
      style={{ borderRadius }}
    >
      {running && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2"
          >
            <canvas ref={canvasRef} className="block" />
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit]">
            <span
              className="absolute inset-0 rounded-[inherit]"
              style={{ border: `1px solid ${hexToRgba(color, 0.6)}`, filter: 'blur(1px)' }}
            />
            <span
              className="absolute inset-0 rounded-[inherit]"
              style={{ border: `1px solid ${color}`, filter: 'blur(5px)' }}
            />
            <span
              className="absolute inset-0 -z-[1] scale-110 rounded-[inherit] opacity-25"
              style={{
                filter: 'blur(26px)',
                background: `linear-gradient(-30deg, ${color}, transparent, ${color})`,
              }}
            />
          </div>
        </>
      )}

      <div className="relative z-[1] rounded-[inherit]">{children}</div>
    </div>
  );
};

export default ElectricBorder;

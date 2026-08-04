import { gsap } from 'gsap';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { useMediaQuery } from '@/shared/hooks/use-media-query';

gsap.registerPlugin(InertiaPlugin);

interface Dot {
  cx: number;
  cy: number;
  xOffset: number;
  yOffset: number;
  inertiaApplied: boolean;
}

export interface DotGridProps {
  /** Diâmetro do ponto em px. Acima de ~4 deixa de ser textura e vira decoração. */
  dotSize?: number;
  /** Espaço entre pontos. `dotSize + gap` é o lado da célula. */
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  /** Raio (px) em que o ponto começa a acender na direção de `activeColor`. */
  proximity?: number;
  /** Velocidade mínima do cursor (px/s) para empurrar os pontos. */
  speedTrigger?: number;
  shockRadius?: number;
  shockStrength?: number;
  maxSpeed?: number;
  resistance?: number;
  returnDuration?: number;
  className?: string;
}

function hexToRgb(hex: string) {
  const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) return { r: 0, g: 0, b: 0 };

  return {
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16),
  };
}

function throttle<T extends (...args: never[]) => void>(fn: T, limit: number) {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = performance.now();
    if (now - lastCall < limit) return;
    lastCall = now;
    fn(...args);
  };
}

/**
 * Campo de pontos que reage ao cursor: os pontos acendem por proximidade e são
 * empurrados com inércia física (GSAP InertiaPlugin) quando o mouse passa
 * rápido ou clica. Substitui o grid de linhas em CSS do hero — mesma linguagem
 * visual, só que viva.
 *
 * Sem cursor não há efeito: em telas touch e para quem prefere movimento
 * reduzido o canvas é pintado uma única vez, estático. O grid continua lá, mas
 * não custa um único frame de animação.
 */
const DotGrid: React.FC<DotGridProps> = ({
  dotSize = 3,
  gap = 29,
  baseColor = '#1E293B', // slate-800 — mesma cor das linhas que este canvas substitui
  activeColor = '#2DD4BF', // accent-400
  proximity = 130,
  speedTrigger = 100,
  shockRadius = 220,
  shockStrength = 4,
  maxSpeed = 5000,
  resistance = 750,
  returnDuration = 1.4,
  className = '',
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);

  /*
   * Começa fora da tela, não em (0,0): senão os pontos do canto superior
   * esquerdo já nascem acesos antes do primeiro movimento do mouse.
   */
  const pointerRef = useRef({
    x: -9999,
    y: -9999,
    lastTime: 0,
    lastX: 0,
    lastY: 0,
  });

  /* Hero fora da viewport não precisa de frames — o loop continua agendado,
     mas não pinta. Evita queimar GPU enquanto a pessoa lê o resto da página. */
  const isVisibleRef = useRef(true);

  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isCoarsePointer = useMediaQuery('(pointer: coarse)');
  const isInteractive = !prefersReducedMotion && !isCoarsePointer;

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

  const circlePath = useMemo(() => {
    if (typeof window === 'undefined' || typeof window.Path2D !== 'function') return null;

    const path = new Path2D();
    path.arc(0, 0, dotSize / 2, 0, Math.PI * 2);
    return path;
  }, [dotSize]);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !circlePath) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const { x: px, y: py } = pointerRef.current;
    const proximitySq = proximity * proximity;

    for (const dot of dotsRef.current) {
      const dx = dot.cx - px;
      const dy = dot.cy - py;
      const distanceSq = dx * dx + dy * dy;

      let fill = baseColor;
      if (distanceSq <= proximitySq) {
        const t = 1 - Math.sqrt(distanceSq) / proximity;
        const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
        const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
        const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
        fill = `rgb(${r},${g},${b})`;
      }

      ctx.save();
      ctx.translate(dot.cx + dot.xOffset, dot.cy + dot.yOffset);
      ctx.fillStyle = fill;
      ctx.fill(circlePath);
      ctx.restore();
    }
  }, [activeRgb, baseColor, baseRgb, circlePath, proximity]);

  const buildGrid = useCallback(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const { width, height } = wrapper.getBoundingClientRect();
    if (!width || !height) return;

    /* Teto de 2 no DPR: em telas 3x o bitmap fica 9x maior sem ganho visível
       num ponto de 3px. */
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }

    const cell = dotSize + gap;
    const cols = Math.floor((width + gap) / cell);
    const rows = Math.floor((height + gap) / cell);

    /* Centraliza a malha na área disponível para as sobras laterais ficarem
       simétricas — encostado num canto só, o grid denuncia o recorte. */
    const startX = (width - (cell * cols - gap)) / 2 + dotSize / 2;
    const startY = (height - (cell * rows - gap)) / 2 + dotSize / 2;

    const dots: Dot[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        dots.push({
          cx: startX + col * cell,
          cy: startY + row * cell,
          xOffset: 0,
          yOffset: 0,
          inertiaApplied: false,
        });
      }
    }

    dotsRef.current = dots;
    paint();
  }, [dotSize, gap, paint]);

  // Monta a malha e refaz quando o container muda de tamanho
  useEffect(() => {
    buildGrid();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', buildGrid);
      return () => window.removeEventListener('resize', buildGrid);
    }

    const observer = new ResizeObserver(buildGrid);
    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [buildGrid]);

  // Pausa a pintura enquanto o hero está fora da tela
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!isInteractive || !wrapper || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 },
    );

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [isInteractive]);

  // Loop de animação — só existe no modo interativo
  useEffect(() => {
    if (!isInteractive || !circlePath) return;

    let rafId = 0;
    const loop = () => {
      if (isVisibleRef.current) paint();
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [circlePath, isInteractive, paint]);

  // Empurrão por velocidade do cursor + onda de choque no clique
  useEffect(() => {
    if (!isInteractive) return;

    const push = (dot: Dot, pushX: number, pushY: number) => {
      dot.inertiaApplied = true;
      gsap.killTweensOf(dot);
      gsap.to(dot, {
        inertia: { xOffset: pushX, yOffset: pushY, resistance },
        onComplete: () => {
          gsap.to(dot, {
            xOffset: 0,
            yOffset: 0,
            duration: returnDuration,
            ease: 'elastic.out(1,0.75)',
          });
          dot.inertiaApplied = false;
        },
      });
    };

    const onMove = (event: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const pointer = pointerRef.current;
      const now = performance.now();
      const dt = pointer.lastTime ? now - pointer.lastTime : 16;

      let vx = ((event.clientX - pointer.lastX) / dt) * 1000;
      let vy = ((event.clientY - pointer.lastY) / dt) * 1000;
      let speed = Math.hypot(vx, vy);

      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        vx *= scale;
        vy *= scale;
        speed = maxSpeed;
      }

      pointer.lastTime = now;
      pointer.lastX = event.clientX;
      pointer.lastY = event.clientY;

      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;

      /* Saída antecipada: abaixo do gatilho não há empurrão, então nem vale
         percorrer a malha inteira a cada movimento. */
      if (speed <= speedTrigger) return;

      for (const dot of dotsRef.current) {
        if (dot.inertiaApplied) continue;
        if (Math.hypot(dot.cx - pointer.x, dot.cy - pointer.y) >= proximity) continue;

        push(dot, dot.cx - pointer.x + vx * 0.005, dot.cy - pointer.y + vy * 0.005);
      }
    };

    const onClick = (event: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const cx = event.clientX - rect.left;
      const cy = event.clientY - rect.top;

      /* O listener é global (o canvas é pointer-events-none), então filtra na
         mão: clicar no menu ou no rodapé não pode sacudir o hero. */
      if (cx < 0 || cy < 0 || cx > rect.width || cy > rect.height) return;

      for (const dot of dotsRef.current) {
        if (dot.inertiaApplied) continue;

        const distance = Math.hypot(dot.cx - cx, dot.cy - cy);
        if (distance >= shockRadius) continue;

        const falloff = Math.max(0, 1 - distance / shockRadius);
        push(dot, (dot.cx - cx) * shockStrength * falloff, (dot.cy - cy) * shockStrength * falloff);
      }
    };

    /* 16ms e não os 50ms do upstream: com 50ms o brilho de proximidade anda a
       20fps e "pula" atrás do cursor. O custo extra é só a saída antecipada. */
    const throttledMove = throttle(onMove, 16);

    window.addEventListener('mousemove', throttledMove, { passive: true });
    window.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('mousemove', throttledMove);
      window.removeEventListener('click', onClick);
      dotsRef.current.forEach((dot) => gsap.killTweensOf(dot));
    };
  }, [
    isInteractive,
    maxSpeed,
    proximity,
    resistance,
    returnDuration,
    shockRadius,
    shockStrength,
    speedTrigger,
  ]);

  return (
    <div ref={wrapperRef} aria-hidden="true" className={`pointer-events-none ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
};

export default DotGrid;

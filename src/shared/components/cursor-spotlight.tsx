import { useEffect, useRef } from 'react';

/**
 * Holofote sutil que segue o cursor (assinatura de portfólios dark
 * como brittanychiang.com). Desativado em telas touch e para quem
 * prefere movimento reduzido.
 */
const CursorSpotlight: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let raf = 0;
    const move = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.background = `radial-gradient(600px at ${e.clientX}px ${e.clientY}px, rgb(45 212 191 / 0.06), transparent 80%)`;
      });
    };

    window.addEventListener('mousemove', move, { passive: true });
    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30"
    />
  );
};

export default CursorSpotlight;

import React, { useRef, useState } from 'react';

interface SpotlightCardProps extends React.PropsWithChildren {
  className?: string;
  /** Cor do holofote. Padrão: o acento do tema. */
  spotlightColor?: string;
}

/**
 * Card com um holofote que segue o cursor por dentro.
 *
 * Mesma ideia do CursorSpotlight global, um nível abaixo: lá o cursor ilumina
 * a página, aqui ilumina o card sob ele.
 */
const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgb(45 212 191 / 0.10)',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [lit, setLit] = useState(false);

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (event) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    setPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setLit(true)}
      onMouseLeave={() => setLit(false)}
      onFocus={() => setLit(true)}
      onBlur={() => setLit(false)}
      className={`relative overflow-hidden rounded-lg border border-slate-800 bg-slate-900/40 transition-colors hover:border-slate-700 ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out"
        style={{
          opacity: lit ? 1 : 0,
          background: `radial-gradient(420px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
};

export default SpotlightCard;

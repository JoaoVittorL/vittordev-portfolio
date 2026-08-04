import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useEffect, useMemo, useRef } from 'react';

import { useMediaQuery } from '@/shared/hooks/use-media-query';

gsap.registerPlugin(ScrollTrigger);

interface ScrollFloatProps {
  children: string;
  className?: string;
  duration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
}

/**
 * Título cujas letras sobem e assentam conforme a página rola (`scrub`, então
 * o movimento segue o scroll em vez de disparar sozinho).
 *
 * Duas correções sobre o original do React Bits:
 * 1. As letras são agrupadas por palavra. Letra solta em `inline-block` faz o
 *    navegador quebrar a linha no meio da palavra.
 * 2. `gsap.context().revert()` na limpeza — sem isso cada desmontagem deixa um
 *    ScrollTrigger vivo apontando para um nó que não existe mais.
 *
 * O estado inicial é aplicado pelo GSAP, não por CSS: se o script não rodar
 * (ou o usuário preferir movimento reduzido), o título aparece normalmente.
 */
const ScrollFloat: React.FC<ScrollFloatProps> = ({
  children,
  className = '',
  duration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'center bottom+=40%',
  scrollEnd = 'bottom bottom-=30%',
  stagger = 0.025,
}) => {
  const ref = useRef<HTMLHeadingElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const words = useMemo(() => children.split(' '), [children]);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        '[data-char]',
        {
          willChange: 'opacity, transform',
          opacity: 0,
          yPercent: 110,
          scaleY: 2.2,
          scaleX: 0.75,
          transformOrigin: '50% 0%',
        },
        {
          opacity: 1,
          yPercent: 0,
          scaleY: 1,
          scaleX: 1,
          duration,
          ease,
          stagger,
          scrollTrigger: {
            trigger: el,
            start: scrollStart,
            end: scrollEnd,
            scrub: true,
          },
        },
      );
    }, el);

    return () => context.revert();
  }, [duration, ease, prefersReducedMotion, scrollEnd, scrollStart, stagger, words]);

  return (
    <h2 ref={ref} className={className}>
      {/* O texto quebrado em letras é lixo para leitor de tela ("M-i-n-h-a-s").
          A versão íntegra fica só para a acessibilidade; a animada, só para os olhos. */}
      <span className="sr-only">{children}</span>

      <span aria-hidden="true">
        {words.map((word, wordIndex) => (
          <React.Fragment key={`${word}-${wordIndex}`}>
            {/* A palavra é a unidade indivisível; as letras animam dentro dela */}
            <span className="inline-block whitespace-nowrap">
              {word.split('').map((char, charIndex) => (
                <span key={charIndex} data-char className="inline-block">
                  {char}
                </span>
              ))}
            </span>
            {wordIndex < words.length - 1 ? ' ' : null}
          </React.Fragment>
        ))}
      </span>
    </h2>
  );
};

export default ScrollFloat;

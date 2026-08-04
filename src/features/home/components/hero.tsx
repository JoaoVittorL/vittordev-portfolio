import DotGrid from "@/shared/components/dot-grid";
import ElectricBorder from "@/shared/components/electric-border";
import SocialButton from "@/shared/components/social-button";
import { useReveal } from "@/shared/hooks/use-reveal";
import { ArrowDown, Github, Linkedin } from "lucide-react";
import React from "react";

const Hero: React.FC = () => {
  const { ref, isRevealed } = useReveal<HTMLDivElement>();
  const revealed = isRevealed ? 'is-revealed' : '';
  const [ctaLive, setCtaLive] = React.useState(false);

  return (
    /*
     * min-h-svh e não 100vh: no iOS a barra de endereço entra na conta de vh, o
     * conteúdo é cortado e a altura "salta" ao rolar.
     * pb-32 no mobile reserva espaço para o indicador de scroll não sobrepor os CTAs.
     */
    <section
      id="hero"
      className="relative flex min-h-svh items-center overflow-hidden pb-32 pt-24 sm:pb-16 sm:pt-28"
    >
      {/* Grid técnico sutil com máscara radial — textura, não decoração.
          Os pontos acendem e são empurrados pelo cursor; em touch e com
          movimento reduzido o canvas fica estático. */}
      <DotGrid className="absolute inset-0 [mask-image:radial-gradient(ellipse_65%_55%_at_50%_40%,black,transparent)]" />

      <div ref={ref} className="container mx-auto px-4 md:px-6 relative">
        <div className="max-w-4xl">
          {/* Status de disponibilidade — detalhe humano, não template */}
          <span className={`reveal ${revealed} eyebrow mb-6 sm:mb-8`}>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-60"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-400"></span>
            </span>
            Disponível para novas oportunidades
          </span>

          <h1
            className={`reveal ${revealed} mb-5 text-4xl font-bold leading-[1.05] sm:mb-6 sm:text-5xl md:text-7xl`}
            style={{ '--reveal-delay': '90ms' } as React.CSSProperties}
          >
            João Vittor<span className="text-accent-400">.</span>
          </h1>

          <p
            className={`reveal ${revealed} mb-8 max-w-2xl text-base leading-relaxed text-slate-400 sm:mb-10 sm:text-lg md:text-2xl`}
            style={{ '--reveal-delay': '180ms' } as React.CSSProperties}
          >
            Analista de dados e desenvolvedor frontend. Transformo números e
            interfaces em produtos que as pessoas realmente entendem — com{" "}
            <span className="text-slate-200 font-medium">
              React, TypeScript e um olhar para detalhe
            </span>
            .
          </p>

          <div
            className={`reveal ${revealed} flex flex-wrap items-center gap-4`}
            style={{ '--reveal-delay': '270ms' } as React.CSSProperties}
          >
            {/* O contorno elétrico só existe no hover/foco: parado, o botão é
                exatamente o de antes e não custa um frame sequer. */}
            <ElectricBorder
              active={ctaLive}
              borderRadius={4}
              className="inline-block"
            >
              <a
                href="#contact"
                onMouseEnter={() => setCtaLive(true)}
                onMouseLeave={() => setCtaLive(false)}
                onFocus={() => setCtaLive(true)}
                onBlur={() => setCtaLive(false)}
                className="inline-flex items-center gap-2 rounded border border-accent-400/50 bg-slate-950 px-6 py-3 font-mono text-sm text-accent-300 transition-colors duration-300 hover:bg-accent-400/10"
              >
                Vamos conversar
              </a>
            </ElectricBorder>
            <div className="flex gap-3">
              <SocialButton href="https://github.com/JoaoVittorL" icon={<Github size={20} />} label="GitHub" />
              <SocialButton
                href="https://www.linkedin.com/in/jo%C3%A3o-vittor-lopes-dos-santos-199103201"
                icon={<Linkedin size={20} />}
                label="LinkedIn"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de scroll discreto (sem bounce infinito) */}
      <a
        href="#about"
        className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 p-2 text-slate-600 transition-colors hover:text-accent-300"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)' }}
        aria-label="Ir para a seção sobre"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Role</span>
        <ArrowDown size={16} className="animate-float" />
      </a>
    </section>
  );
};

export default Hero;

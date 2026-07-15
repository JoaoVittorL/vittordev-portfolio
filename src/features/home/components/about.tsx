import React from 'react';
import { Code, Layers, Globe, PenTool } from 'lucide-react';
import AboutItem from '@/shared/components/about-item';
import { useReveal } from '@/shared/hooks/use-reveal';

const About: React.FC = () => {
  const { ref, isRevealed } = useReveal<HTMLDivElement>();

  return (
    <section id="about" className="py-20 md:py-28">
      <div
        ref={ref}
        className={`reveal ${isRevealed ? 'is-revealed' : ''} container mx-auto px-4 md:px-6`}
      >
        <div className="max-w-5xl mx-auto">
          <div className="relative mb-16">
            {/* Número-fantasma editorial atrás do título */}
            <span
              aria-hidden="true"
              className="pointer-events-none select-none absolute -top-8 -left-1 font-display text-8xl md:text-9xl font-bold leading-none text-slate-800/40"
            >
              01
            </span>
            <div className="relative">
              <span className="eyebrow mb-4">01 <span className="accent-rule" /> Sobre</span>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Sobre mim
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl">
                Eu tenho uma paixão por criar interfaces de usuário intuitivas e engajadas,
                capazes de proporcionar uma experiência excepcional aos usuários.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
            <div className={`reveal ${isRevealed ? 'is-revealed' : ''} rounded-lg border border-slate-800 bg-slate-900/40 overflow-hidden transition-colors hover:border-slate-700`}>
              <div className="p-6 sm:p-8">
                <h3 className="text-2xl font-bold mb-4">Minha Jornada</h3>
                <p className="text-slate-400 mb-6">
                  Minha viagem na área de desenvolvimento web começou com uma curiosidade sobre
                  como os sites funcionam. Através de aprendizado dedicado e projetos práticos,
                  desenvolvi uma sólida base em tecnologias de frontend. Estou sempre explorando
                  novas técnicas e mantendo-me atualizado com as tendências do desenvolvimento web.
                </p>
                <p className="text-slate-400">
                  Eu acredito em criar sites que não apenas sejam visualmente atraentes, mas também
                  sejam acessíveis, performantes e fáceis de usar. Meu objetivo é criar experiências
                  digitais que deixem uma impressão duradoura.
                </p>
              </div>
            </div>

            <div
              className={`reveal ${isRevealed ? 'is-revealed' : ''} rounded-lg border border-slate-800 bg-slate-900/40 overflow-hidden transition-colors hover:border-slate-700`}
              style={{ '--reveal-delay': '120ms' } as React.CSSProperties}
            >
              <div className="p-6 sm:p-8">
                <h3 className="text-2xl font-bold mb-4">Minhas Competências</h3>
                <ul className="space-y-4">
                  <AboutItem
                    icon={<Code size={24} className="text-accent-400" />}
                    title="Código limpo"
                    description="Eu escrevo código limpo e bem documentado, facilitando a manutenção e colaboração nos projetos."
                  />
                  <AboutItem
                    icon={<Layers size={24} className="text-accent-400" />}
                    title="Responsividade"
                    description="Eu desenvolvo sites responsivos, garantindo que eles sejam acessíveis em diferentes dispositivos e tamanhos de tela para uma experiência consistente."
                  />
                  <AboutItem
                    icon={<Globe size={24} className="text-accent-400" />}
                    title="Frontend Frameworks"
                    description="Eu uso frameworks front-end modernos, como React ou Next, para criar interfaces de usuário interativas e dinâmicas."
                  />
                  <AboutItem
                    icon={<PenTool size={24} className="text-accent-400" />}
                    title="UI/UX"
                    description="Eu desenvolvo interfaces de usuário intuitivas e agradáveis, proporcionando uma experiência de usuário excepcional."
                  />
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

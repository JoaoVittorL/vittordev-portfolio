import AboutItem from '@/shared/components/about-item';
import { useReveal } from '@/shared/hooks/use-reveal';
import { Code, Globe, Layers, PenTool } from 'lucide-react';
import React from 'react';

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
                  Comecei querendo entender como as coisas funcionavam por trás da tela e acabei
                  construindo do zero o sistema que hoje mantém uma empresa inteira de pé. É uma
                  plataforma de gestão completa (almoxarifado, orçamento, frota, projetos e
                  materiais) feita em React e TypeScript. Está no ar há mais de 2 anos, usada todos
                  os dias por todos os setores. O maior elogio que ela recebe é o silêncio: ninguém
                  cogita voltar atrás.
                </p>
                <p className="text-slate-400">
                  Depois disso, coloquei em produção um app mobile em React Native que tirou do papel
                  as solicitações de compra e abastecimento — o que era formulário e telefonema virou
                  alguns toques na tela. Gosto de trabalhar perto do dado: além da interface, sou
                  fluente em Google Sheets, Excel e Looker Studio, então entrego a tela e também a
                  história que os números dela contam. Sigo curioso, aprendendo algo novo a cada
                  projeto. Acredito que a curiosidade é o que me mantém aqui.
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
                    title="Código que envelhece bem"
                    description="Escrevo pensando em quem vai mexer nele depois — inclusive eu, seis meses adiante. Prefiro código simples e legível a código esperto."
                  />
                  <AboutItem
                    icon={<Layers size={24} className="text-accent-400" />}
                    title="Do celular ao monitor"
                    description="Faço interfaces que se comportam bem em qualquer tela. Se funciona no celular no meio da rua e no monitor grande, está no ponto."
                  />
                  <AboutItem
                    icon={<Globe size={24} className="text-accent-400" />}
                    title="React & Next no dia a dia"
                    description="É onde eu me sinto em casa. Uso React e Next há anos para construir aplicações reais, que aguentam uso diário e crescem sem virar bagunça."
                  />
                  <AboutItem
                    icon={<PenTool size={24} className="text-accent-400" />}
                    title="Cuidado com quem usa"
                    description="Uma boa interface é aquela que ninguém precisa explicar. Cuido dos detalhes que fazem a pessoa terminar a tarefa sem nem perceber o caminho."
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

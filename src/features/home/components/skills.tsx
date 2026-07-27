import CategoryButton from '@/shared/components/category-button';
import { useReveal } from '@/shared/hooks/use-reveal';
import React from 'react';

interface Skill {
  name: string;
  category: 'frontend' | 'tools' | 'other' | 'backend';
}

const Skills: React.FC = () => {
  const skills: Skill[] = [
    { name: 'Next', category: 'frontend' },
    { name: 'React', category: 'frontend' },
    { name: 'React Native', category: 'frontend' },
    { name: 'Shopify', category: 'frontend' },
    { name: 'Tailwind CSS', category: 'frontend' },
    { name: 'Responsive Design', category: 'frontend' },
    { name: 'HTML5', category: 'frontend' },
    { name: 'CSS3/SASS', category: 'frontend' },
    { name: 'Styled Components', category: 'frontend' },
    { name: 'JavaScript', category: 'frontend' },
    { name: 'TypeScript', category: 'frontend' },
    { name: 'Restful API', category: 'frontend' },

    { name: 'Redux/Context API', category: 'frontend' },
    { name: 'Zod', category: 'frontend' },
    { name: 'react-hook-form', category: 'frontend' },
    { name: 'Framer Motion', category: 'frontend' },

    { name: 'Git', category: 'tools' },
    { name: 'Figma', category: 'tools' },
    { name: 'Jest', category: 'tools' },
    { name: 'Testing Library', category: 'tools' },
    { name: 'Insomnia', category: 'tools' },
    { name: 'Postman', category: 'tools' },
    { name: 'ESLint & Prettier', category: 'tools' },

    { name: 'UI/UX Design', category: 'other' },
    { name: 'Agile/Scrum', category: 'other' },
    { name: 'Excel', category: 'other' },
    { name: 'Looker Studio', category: 'other' },
    { name: 'Google Analytics', category: 'other' },

    { name: 'SQL', category: 'backend' },
    { name: 'Node', category: 'backend' },
    { name: 'Express', category: 'backend' },
    { name: 'Prisma ORM', category: 'backend' },
    { name: 'MongoDB', category: 'backend' },
  ];

  const { ref, isRevealed } = useReveal<HTMLDivElement>();
  const [category, setCategory] = React.useState<'all' | 'frontend' | 'tools' | 'other' | 'backend'>('all');

  const filteredSkills = skills.filter(skill =>
    category === 'all' || skill.category === category
  );

  return (
    <section id="skills" className="py-16 sm:py-20 md:py-28">
      <div
        ref={ref}
        className={`reveal ${isRevealed ? 'is-revealed' : ''} container mx-auto px-4 md:px-6`}
      >
        <div className="max-w-5xl mx-auto">
          <div className="relative mb-8 sm:mb-12">
            {/* Número-fantasma editorial atrás do título — precisa de espaço para
                funcionar; no mobile virava ruído sobre o próprio rótulo. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-1 -top-8 hidden select-none font-display text-8xl font-bold leading-none text-slate-800/40 sm:block md:text-9xl"
            >
              02
            </span>
            <div className="relative">
              <span className="eyebrow mb-4">02 <span className="accent-rule" /> Habilidades</span>
              <h2 className="mb-4 text-3xl font-bold sm:mb-6 md:text-5xl">
                Minhas Habilidades
              </h2>
              <p className="max-w-2xl text-base text-slate-400 sm:text-lg">
                Aqui estão as tecnologias e ferramentas que sou proficiente.
                Estou constantemente aprendendo e expandindo minha
                habilidade para ficar atualizado com as tendências do mercado.
              </p>
            </div>
          </div>

          <div className="mb-8 flex flex-wrap gap-2 sm:mb-10">
            <CategoryButton
              active={category === 'all'}
              onClick={() => setCategory('all')}
            >
              Tudo
            </CategoryButton>
            <CategoryButton
              active={category === 'frontend'}
              onClick={() => setCategory('frontend')}
            >
              Frontend
            </CategoryButton>
            <CategoryButton
              active={category === 'tools'}
              onClick={() => setCategory('tools')}
            >
              Ferramentas
            </CategoryButton>
            <CategoryButton
              active={category === 'backend'}
              onClick={() => setCategory('backend')}
            >
              Backend
            </CategoryButton>
            <CategoryButton
              active={category === 'other'}
              onClick={() => setCategory('other')}
            >
              Outros
            </CategoryButton>
          </div>

          <ul className="flex flex-wrap gap-2">
            {filteredSkills.map((skill, index) => (
              <li
                key={skill.name}
                // Mais compacto no mobile: com px-4/text-sm cabiam só 2 por linha
                // e a lista de 33 tags virava uma rolagem interminável.
                className={`reveal ${isRevealed ? 'is-revealed' : ''} rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1.5 font-mono text-xs text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-400/40 hover:text-accent-300 sm:px-4 sm:text-sm`}
                // Teto no atraso: com 30+ tags o efeito em cascata levava mais de
                // 1s para terminar — no mobile parecia travamento.
                style={{ '--reveal-delay': `${Math.min(index, 10) * 30}ms` } as React.CSSProperties}
              >
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Skills;

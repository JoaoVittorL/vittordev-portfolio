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
    <section id="skills" className="py-20 md:py-28">
      <div
        ref={ref}
        className={`reveal ${isRevealed ? 'is-revealed' : ''} container mx-auto px-4 md:px-6`}
      >
        <div className="max-w-5xl mx-auto">
          <div className="relative mb-12">
            {/* Número-fantasma editorial atrás do título */}
            <span
              aria-hidden="true"
              className="pointer-events-none select-none absolute -top-8 -left-1 font-display text-8xl md:text-9xl font-bold leading-none text-slate-800/40"
            >
              02
            </span>
            <div className="relative">
              <span className="eyebrow mb-4">02 <span className="accent-rule" /> Habilidades</span>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Minhas Habilidades
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl">
                Aqui estão as tecnologias e ferramentas que sou proficiente.
                Estou constantemente aprendendo e expandindo minha
                habilidade para ficar atualizado com as tendências do mercado.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
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
                className={`reveal ${isRevealed ? 'is-revealed' : ''} rounded-full border border-slate-800 bg-slate-900/60 px-4 py-1.5 font-mono text-sm text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-400/40 hover:text-accent-300`}
                style={{ '--reveal-delay': `${index * 40}ms` } as React.CSSProperties}
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

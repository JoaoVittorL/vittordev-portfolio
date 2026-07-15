import React, { useState } from 'react';
import TagButton from '@/shared/components/tag-button';
import ProjectCard from '@/shared/components/project-card';
import { useReveal } from '@/shared/hooks/use-reveal';

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
}

const Projects: React.FC = () => {
  const { ref, isRevealed } = useReveal<HTMLDivElement>();
  const [filter, setFilter] = useState<string>('all');

  const projects: Project[] = [
    {
      id: 1,
      title: "Em breve",
      description: "Organizando projetos para exibir...",
      image: "https://images.pexels.com/photos/4482900/pexels-photo-4482900.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      tags: ["React", "TypeScript", "Tailwind CSS"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com"
    },
  ];

  const allTags = Array.from(new Set(projects.flatMap(project => project.tags)));

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(project => project.tags.includes(filter));

  return (
    <section id="projects" className="py-20 md:py-28">
      <div
        ref={ref}
        className={`reveal ${isRevealed ? 'is-revealed' : ''} container mx-auto px-4 md:px-6`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <span className="eyebrow mb-4">04 <span className="accent-rule" /> Projetos</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Meus Projetos
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl">
              Aqui estão alguns dos meus projetos.
              Cada projeto representa uma desafio único e mostra
              diferentes aspectos de minhas habilidades e experiência.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-12">
            <TagButton
              active={filter === 'all'}
              onClick={() => setFilter('all')}
            >
              Todos
            </TagButton>
            {allTags.map(tag => (
              <TagButton
                key={tag}
                active={filter === tag}
                onClick={() => setFilter(tag)}
              >
                {tag}
              </TagButton>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;

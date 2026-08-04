import { projects } from '@/features/home/data/projects';
import Folder from '@/shared/components/folder';
import ProjectLightbox from '@/shared/components/project-lightbox';
import ScrollFloat from '@/shared/components/scroll-float';
import { useReveal } from '@/shared/hooks/use-reveal';
import { MousePointerClick } from 'lucide-react';
import React, { useState } from 'react';

const Projects: React.FC = () => {
  const { ref, isRevealed } = useReveal<HTMLDivElement>();
  const revealed = isRevealed ? 'is-revealed' : '';

  /* Uma pasta aberta por vez: os papéis saem para fora da caixa da pasta e
     duas abertas lado a lado se sobrepõem. */
  const [openId, setOpenId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ id: string; index: number } | null>(null);

  const lightboxProject = projects.find((project) => project.id === lightbox?.id) ?? null;

  return (
    <section id="projects" className="py-16 sm:py-20 md:py-28">
      <div ref={ref} className={`reveal ${revealed} container mx-auto px-4 md:px-6`}>
        <div className="mx-auto max-w-5xl">
          <div className="relative mb-10 sm:mb-14">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-1 -top-8 hidden select-none font-display text-8xl font-bold leading-none text-slate-800/40 sm:block md:text-9xl"
            >
              03
            </span>
            <div className="relative">
              <span className="eyebrow mb-4">
                03 <span className="accent-rule" /> Projetos
              </span>
              <ScrollFloat className="mb-4 text-3xl font-bold sm:mb-6 md:text-5xl">
                Meus Projetos
              </ScrollFloat>
              <p className="max-w-2xl text-base text-slate-400 sm:text-lg">
                Cada pasta guarda as telas de um projeto. Abra uma para ver por dentro — e
                clique numa tela para olhar de perto.
              </p>

              <p className="mt-5 inline-flex items-center gap-2 font-mono text-xs text-slate-600">
                <MousePointerClick size={14} className="text-accent-400/70" />
                Clique na pasta para abrir
              </p>
            </div>
          </div>

          <ul className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
            {projects.map((project, projectIndex) => {
              const isOpen = openId === project.id;

              return (
                <li
                  key={project.id}
                  className={`reveal ${revealed} flex flex-col`}
                  style={{ '--reveal-delay': `${projectIndex * 90}ms` } as React.CSSProperties}
                >
                  {/* Altura reservada: o leque sobe acima da pasta e não pode
                      invadir o texto da seção nem o card de cima. */}
                  <div className="flex h-[260px] items-end justify-center sm:justify-start">
                    <Folder
                      label={`projeto ${project.title}`}
                      size={1.75}
                      open={isOpen}
                      onToggle={() => setOpenId(isOpen ? null : project.id)}
                      items={project.shots.map((shot, shotIndex) => (
                        <button
                          key={shot.src}
                          type="button"
                          tabIndex={isOpen ? 0 : -1}
                          aria-hidden={!isOpen}
                          onClick={(event) => {
                            // Sem isto o clique sobe para a pasta e a fecha
                            event.stopPropagation();
                            setLightbox({ id: project.id, index: shotIndex });
                          }}
                          className="block h-full w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                          aria-label={`Ampliar: ${shot.caption}`}
                        >
                          <img
                            src={shot.src}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover object-top"
                          />
                        </button>
                      ))}
                    />
                  </div>

                  <h3 className="text-base font-bold text-slate-200">{project.title}</h3>
                  <p className="mt-1 font-mono text-xs text-slate-600">{project.year}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{project.summary}</p>

                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-500"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <ProjectLightbox
        project={lightboxProject}
        index={lightbox?.index ?? 0}
        onIndexChange={(index) => setLightbox((prev) => (prev ? { ...prev, index } : prev))}
        onClose={() => setLightbox(null)}
      />
    </section>
  );
};

export default Projects;

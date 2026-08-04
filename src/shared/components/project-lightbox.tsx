import type { Project } from '@/features/home/data/projects';
import { useScrollLock } from '@/shared/hooks/use-scroll-lock';
import { ChevronLeft, ChevronRight, ExternalLink, Github, X } from 'lucide-react';
import React, { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ProjectLightboxProps {
  project: Project | null;
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

/**
 * Visualizador de telas do projeto. Existe em vez do Modal genérico porque
 * aquele é `max-w-lg` — largura de formulário, não de screenshot.
 */
const ProjectLightbox: React.FC<ProjectLightboxProps> = ({
  project,
  index,
  onIndexChange,
  onClose,
}) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const total = project?.shots.length ?? 0;

  useScrollLock(Boolean(project));

  const step = useCallback(
    (direction: number) => {
      if (!total) return;
      onIndexChange((index + direction + total) % total);
    },
    [index, onIndexChange, total],
  );

  useEffect(() => {
    if (!project) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [project, onClose, step]);

  if (!project) return null;

  const shot = project.shots[index] ?? project.shots[0];

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`Telas do projeto ${project.title}`}
    >
      <div
        className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <div className="flex flex-none items-start justify-between gap-4 border-b border-slate-800 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-slate-200 sm:text-lg">
              {project.title}
            </h3>
            <p className="truncate font-mono text-xs text-slate-500">
              {index + 1} / {total} — {shot.caption}
            </p>
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="-mr-1 flex h-10 w-10 flex-none items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="relative min-h-0 flex-1 overflow-auto bg-slate-950/60 p-3 sm:p-6">
          <img
            src={shot.src}
            alt={`${project.title} — ${shot.caption}`}
            className="mx-auto w-full max-w-4xl rounded-lg border border-slate-800"
          />

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 text-slate-300 transition-colors hover:border-accent-400/50 hover:text-accent-300"
                aria-label="Tela anterior"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 text-slate-300 transition-colors hover:border-accent-400/50 hover:text-accent-300"
                aria-label="Próxima tela"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        <div className="flex flex-none flex-col gap-4 border-t border-slate-800 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="max-w-2xl text-sm leading-relaxed text-slate-400">{project.role}</p>

          <div className="flex flex-none gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded border border-slate-700 px-3 py-2 font-mono text-xs text-slate-300 transition-colors hover:border-accent-400/50 hover:text-accent-300"
              >
                <Github size={14} /> Código
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded border border-accent-400/50 px-3 py-2 font-mono text-xs text-accent-300 transition-colors hover:bg-accent-400/10"
              >
                <ExternalLink size={14} /> Ver no ar
              </a>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ProjectLightbox;

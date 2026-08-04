import { Project } from "@/features/home/data/projects";
import { ExternalLink, Github } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 overflow-hidden transition-colors hover:border-slate-600">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 w-full flex justify-between items-center">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-950/50 backdrop-blur-sm rounded-full hover:bg-slate-950/70 transition-colors duration-300"
                aria-label="Ver código-fonte no GitHub"
              >
                <Github size={20} className="text-slate-200" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-950/50 backdrop-blur-sm rounded-full hover:bg-slate-950/70 transition-colors duration-300"
                aria-label="Ver projeto no ar"
              >
                <ExternalLink size={20} className="text-slate-200" />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
        <p className="text-slate-400 mb-4">{project.summary}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map(tag => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-mono bg-accent-400/10 text-accent-300 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

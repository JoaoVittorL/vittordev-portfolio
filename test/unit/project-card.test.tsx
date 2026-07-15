import { render, screen } from '@testing-library/react';

import type { Project } from '@/features/home/components/projects';
import ProjectCard from '@/shared/components/project-card';

const project: Project = {
  id: 1,
  title: 'Meu Projeto',
  description: 'Descrição do projeto',
  image: 'https://exemplo.com/imagem.png',
  tags: ['React', 'TypeScript'],
  liveUrl: 'https://exemplo.com',
  githubUrl: 'https://github.com/exemplo',
};

describe('ProjectCard', () => {
  it('renderiza título, descrição, imagem e tags', () => {
    render(<ProjectCard project={project} />);

    expect(screen.getByRole('heading', { name: 'Meu Projeto' })).toBeInTheDocument();
    expect(screen.getByText('Descrição do projeto')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Meu Projeto' })).toHaveAttribute(
      'src',
      project.image,
    );
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('renderiza links para o código e para o projeto no ar', () => {
    render(<ProjectCard project={project} />);

    expect(screen.getByLabelText(/GitHub/)).toHaveAttribute('href', project.githubUrl);
    expect(screen.getByLabelText(/projeto no ar/i)).toHaveAttribute('href', project.liveUrl);
  });

  it('omite os links quando as urls não existem', () => {
    render(<ProjectCard project={{ ...project, liveUrl: undefined, githubUrl: undefined }} />);

    expect(screen.queryByLabelText(/GitHub/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/projeto no ar/i)).not.toBeInTheDocument();
  });
});

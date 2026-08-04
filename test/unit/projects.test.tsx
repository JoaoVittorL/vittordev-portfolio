import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Projects from '@/features/home/components/projects';
import { projects } from '@/features/home/data/projects';

describe('Projects', () => {
  it('renderiza uma pasta por projeto', () => {
    render(<Projects />);

    projects.forEach((project) => {
      expect(
        screen.getByRole('button', { name: `Abrir projeto ${project.title}` }),
      ).toBeInTheDocument();
    });
  });

  it('abre a pasta clicada', async () => {
    render(<Projects />);

    const first = projects[0];
    await userEvent.click(screen.getByRole('button', { name: `Abrir projeto ${first.title}` }));

    expect(
      screen.getByRole('button', { name: `Fechar projeto ${first.title}` }),
    ).toBeInTheDocument();
  });

  it('mantém apenas uma pasta aberta por vez', async () => {
    render(<Projects />);

    const [first, second] = projects;
    await userEvent.click(screen.getByRole('button', { name: `Abrir projeto ${first.title}` }));
    await userEvent.click(screen.getByRole('button', { name: `Abrir projeto ${second.title}` }));

    expect(
      screen.getByRole('button', { name: `Abrir projeto ${first.title}` }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: `Fechar projeto ${second.title}` }),
    ).toBeInTheDocument();
  });

  it('clicar numa tela abre o lightbox sem fechar a pasta', async () => {
    render(<Projects />);

    const project = projects[0];
    await userEvent.click(screen.getByRole('button', { name: `Abrir projeto ${project.title}` }));
    await userEvent.click(
      screen.getByRole('button', { name: `Ampliar: ${project.shots[0].caption}` }),
    );

    const dialog = screen.getByRole('dialog', { name: `Telas do projeto ${project.title}` });
    expect(within(dialog).getByText(`1 / 3 — ${project.shots[0].caption}`)).toBeInTheDocument();

    // A pasta continua aberta atrás do lightbox
    expect(
      screen.getByRole('button', { name: `Fechar projeto ${project.title}` }),
    ).toBeInTheDocument();
  });

  it('navega entre as telas no lightbox e volta ao início ao passar do fim', async () => {
    render(<Projects />);

    const project = projects[0];
    await userEvent.click(screen.getByRole('button', { name: `Abrir projeto ${project.title}` }));
    await userEvent.click(
      screen.getByRole('button', { name: `Ampliar: ${project.shots[0].caption}` }),
    );

    const next = screen.getByRole('button', { name: 'Próxima tela' });
    await userEvent.click(next);
    expect(screen.getByText(`2 / 3 — ${project.shots[1].caption}`)).toBeInTheDocument();

    await userEvent.click(next);
    await userEvent.click(next);
    expect(screen.getByText(`1 / 3 — ${project.shots[0].caption}`)).toBeInTheDocument();
  });

  it('fecha o lightbox no Escape', async () => {
    render(<Projects />);

    const project = projects[0];
    await userEvent.click(screen.getByRole('button', { name: `Abrir projeto ${project.title}` }));
    await userEvent.click(
      screen.getByRole('button', { name: `Ampliar: ${project.shots[0].caption}` }),
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('tira as telas da ordem de tabulação enquanto a pasta está fechada', () => {
    const { container } = render(<Projects />);

    // Consulta por DOM, não por role: elemento aria-hidden não tem nome acessível
    const shots = container.querySelectorAll('button[aria-label^="Ampliar:"]');

    expect(shots.length).toBe(projects.length * 3);
    shots.forEach((shot) => {
      expect(shot).toHaveAttribute('tabindex', '-1');
      expect(shot).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('devolve as telas da pasta aberta à ordem de tabulação', async () => {
    const { container } = render(<Projects />);

    const project = projects[0];
    await userEvent.click(screen.getByRole('button', { name: `Abrir projeto ${project.title}` }));

    const focusable = container.querySelectorAll(
      'button[aria-label^="Ampliar:"][tabindex="0"]',
    );

    expect(focusable.length).toBe(3);
  });
});

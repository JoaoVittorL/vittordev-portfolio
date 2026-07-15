import { renderHook, waitFor } from '@testing-library/react';

import { useActiveSection } from '@/shared/hooks/use-active-section';
import { MockIntersectionObserver } from '../mocks/intersection-observer';

const IDS = ['hero', 'about', 'contact'] as const;

function createSections() {
  IDS.forEach((id) => {
    const section = document.createElement('section');
    section.id = id;
    document.body.appendChild(section);
  });
}

function removeSections() {
  IDS.forEach((id) => document.getElementById(id)?.remove());
}

describe('useActiveSection', () => {
  beforeEach(createSections);
  afterEach(removeSections);

  it('começa sem seção ativa', () => {
    const { result } = renderHook(() => useActiveSection(IDS));
    expect(result.current).toBeNull();
  });

  it('observa todas as seções existentes', () => {
    renderHook(() => useActiveSection(IDS));

    const observer = MockIntersectionObserver.instances.at(-1)!;
    expect(observer.elements.size).toBe(3);
  });

  it('ativa a seção que entra na faixa central da viewport', async () => {
    const { result } = renderHook(() => useActiveSection(IDS));

    const observer = MockIntersectionObserver.instances.at(-1)!;
    observer.triggerWith([
      { target: document.getElementById('about')!, isIntersecting: true },
    ]);

    await waitFor(() => {
      expect(result.current).toBe('about');
    });
  });

  it('quando duas seções intersectam, vence a de maior proporção visível', async () => {
    const { result } = renderHook(() => useActiveSection(IDS));

    const observer = MockIntersectionObserver.instances.at(-1)!;
    observer.triggerWith([
      { target: document.getElementById('hero')!, isIntersecting: true, intersectionRatio: 0.2 },
      { target: document.getElementById('contact')!, isIntersecting: true, intersectionRatio: 0.9 },
    ]);

    await waitFor(() => {
      expect(result.current).toBe('contact');
    });
  });

  it('mantém a última seção ativa quando nada intersecta', async () => {
    const { result } = renderHook(() => useActiveSection(IDS));

    const observer = MockIntersectionObserver.instances.at(-1)!;
    observer.triggerWith([
      { target: document.getElementById('hero')!, isIntersecting: true },
    ]);
    await waitFor(() => expect(result.current).toBe('hero'));

    observer.triggerWith([
      { target: document.getElementById('hero')!, isIntersecting: false },
    ]);

    expect(result.current).toBe('hero');
  });

  it('desconecta o observer ao desmontar', () => {
    const { unmount } = renderHook(() => useActiveSection(IDS));

    const observer = MockIntersectionObserver.instances.at(-1)!;
    unmount();

    expect(observer.elements.size).toBe(0);
  });
});

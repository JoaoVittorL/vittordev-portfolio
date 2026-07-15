/**
 * Mock controlável do IntersectionObserver para testes unitários.
 * Use `MockIntersectionObserver.instances` para acessar os observers criados
 * e `trigger()` / `triggerWith()` para simular interseções.
 */
export class MockIntersectionObserver implements IntersectionObserver {
  static instances: MockIntersectionObserver[] = [];

  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];

  elements = new Set<Element>();

  constructor(
    public callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit,
  ) {
    MockIntersectionObserver.instances.push(this);
  }

  observe = (el: Element) => {
    this.elements.add(el);
  };

  unobserve = (el: Element) => {
    this.elements.delete(el);
  };

  disconnect = () => {
    this.elements.clear();
  };

  takeRecords = (): IntersectionObserverEntry[] => [];

  /** Dispara o callback com o mesmo estado para todos os elementos observados */
  trigger(isIntersecting: boolean, intersectionRatio = isIntersecting ? 1 : 0) {
    const entries = Array.from(this.elements).map((target) =>
      buildEntry(target, isIntersecting, intersectionRatio),
    );
    this.callback(entries, this);
  }

  /** Dispara o callback com estados específicos por elemento */
  triggerWith(
    states: Array<{ target: Element; isIntersecting: boolean; intersectionRatio?: number }>,
  ) {
    const entries = states.map(({ target, isIntersecting, intersectionRatio }) =>
      buildEntry(target, isIntersecting, intersectionRatio ?? (isIntersecting ? 1 : 0)),
    );
    this.callback(entries, this);
  }

  static reset() {
    MockIntersectionObserver.instances = [];
  }
}

function buildEntry(
  target: Element,
  isIntersecting: boolean,
  intersectionRatio: number,
): IntersectionObserverEntry {
  return {
    target,
    isIntersecting,
    intersectionRatio,
    boundingClientRect: {} as DOMRectReadOnly,
    intersectionRect: {} as DOMRectReadOnly,
    rootBounds: null,
    time: 0,
  } as IntersectionObserverEntry;
}

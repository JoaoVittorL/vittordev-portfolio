import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

import { MockIntersectionObserver } from './mocks/intersection-observer';
import { mockMatchMedia } from './mocks/match-media';

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  mockMatchMedia();
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
});

afterEach(() => {
  cleanup();
  MockIntersectionObserver.reset();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

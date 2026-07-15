import './shared/styles/index.css';

import { Helmet, HelmetProvider } from 'react-helmet-async';
import { RouterProvider } from 'react-router-dom';

import { router } from './shared/routes/routes';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './shared/lib/react-query';

export function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Helmet titleTemplate="%s | Vittordev" defaultTitle="Portfólio - Vittordev" />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </HelmetProvider>
  );
}

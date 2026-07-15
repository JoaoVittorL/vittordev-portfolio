import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

export function AppLayout() {
  return <>
    <Toaster position="top-right" richColors expand theme="dark" />
    <Outlet />
  </>
}

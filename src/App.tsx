import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { createHashRouter, RouterProvider } from 'react-router';
import { createQueryClient } from './query-client';
import { routes } from './routes';

const router = createHashRouter(routes);

export default function App() {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

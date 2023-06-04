import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import router from './router';
import '@/shared/styles/scrollbar.css';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<RouterProvider router={router} />);

if (import.meta.env.PROD) {
  console.group('Build info:');
  console.log('BUILD', import.meta.env.VITE_BUILD);
  console.log('PLATFORM', import.meta.env.VITE_PLATFORM);
  console.log('VERSION', import.meta.env.VITE_VERSION);
  console.log('BASE_URL', import.meta.env.BASE_URL);
  console.groupEnd();
}

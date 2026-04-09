import { createBrowserRouter } from 'react-router';
import { Root } from './components/Root';
import { Home } from './pages/Home';
import { Add } from './pages/Add';
import { Next } from './pages/Next';
import { Working } from './pages/Working';
import { Done } from './pages/Done';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'add', Component: Add },
      { path: 'next', Component: Next },
      { path: 'working', Component: Working },
      { path: 'done', Component: Done },
    ],
  },
]);

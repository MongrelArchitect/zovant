import { useState } from 'react';
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from 'react-router-dom';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../util/firebase';

import About from './About';
import Contact from './Contact';
import Dashboard from './Dashboard';
import ErrorPage from './ErrorPage';
import Home from './Home';
import Login from './Login';
import Products from './Products';
import Root from './Root';

import '../styles/reset.css';
import '../styles/style.css';

export default function App() {
  const [user, setUser] = useState(null);

  onAuthStateChanged(auth, (tryUser) => {
    if (tryUser) {
      setUser(tryUser);
    } else {
      setUser(null);
    }
  });

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root user={user} />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <Home /> },
        {
          path: '/about',
          element: <About />,
        },
        {
          path: '/contact',
          element: <Contact />,
        },
        {
          path: '/dashboard',
          element: <Dashboard user={user} />,
          loader: () => {
            if (!user) {
              return redirect('/login');
            }
            return null;
          },
        },
        {
          path: '/login',
          element: <Login />,
          loader: () => {
            if (user) {
              return redirect('/dashboard');
            }
            return null;
          },
        },
        {
          path: '/products',
          element: <Products />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

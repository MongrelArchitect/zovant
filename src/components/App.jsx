import { useState } from 'react';
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from 'react-router-dom';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../util/firebase';

import About from './About';
import CategoryDetail from './CategoryDetail';
import Contact from './Contact';
import Dashboard from './Dashboard';
import ErrorPage from './ErrorPage';
import Home from './Home';
import ListCategories from './ListCategories';
import ListProducts from './ListProducts';
import Login from './Login';
import NewCategory from './NewCategory';
import NewProduct from './NewProduct';
import ProductDetail from './ProductDetail';
import Products from './Products';
import Root from './Root';
import Summary from './Summary';

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
          element: <Dashboard />,
          children: [
            { index: true, element: <Summary /> },
            {
              path: 'categories/detail/:id',
              element: <CategoryDetail />,
            },
            {
              path: 'categories/edit/:id',
              element: <CategoryDetail editing />,
            },
            {
              path: 'categories/list/',
              element: <ListCategories />,
            },
            {
              path: 'categories/new',
              element: <NewCategory />,
            },
            {
              path: 'products/detail/:id',
              element: <ProductDetail />,
            },
            {
              path: 'products/edit/:id',
              element: <ProductDetail editing />,
            },
            {
              path: 'products/new',
              element: <NewProduct />,
            },
            {
              path: 'products/list',
              element: <ListProducts />,
            },
          ],
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

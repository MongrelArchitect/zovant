import { useState, useEffect } from 'react';
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from 'react-router-dom';

import { collection, onSnapshot, query } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, database } from '../util/firebase';

import About from './About';
import Catalog from './Catalog';
import CatalogProductDetail from './CatalogProductDetail';
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
  const [allCategories, setAllCategories] = useState({});
  const [allProducts, setAllProducts] = useState({});
  const [user, setUser] = useState(null);

  onAuthStateChanged(auth, (tryUser) => {
    if (tryUser) {
      setUser(tryUser);
    } else {
      setUser(null);
    }
  });

  useEffect(() => {
    const productsQuery = query(collection(database, 'products'));
    onSnapshot(productsQuery, (querySnapshot) => {
      console.log('PRODUCTS CHANGED - DB SNAPSHOT');
      const products = { ...allProducts };
      querySnapshot.forEach((docu) => {
        products[docu.id] = {
          ...docu.data(),
          accessories: docu.data().accessories.map((accessory) => accessory.id),
          categories: docu.data().categories.map((category) => category.id),
          id: docu.id,
        };
      });
      setAllProducts(products);
    });

    const categoriesQuery = query(collection(database, 'categories'));
    onSnapshot(categoriesQuery, (querySnapshot) => {
      console.log('CATEGORIES CHANGED - DB SNAPSHOT');
      const categories = { ...allCategories };
      querySnapshot.forEach((docu) => {
        categories[docu.id] = {
          ...docu.data(),
          id: docu.id,
        };
      });
      setAllCategories(categories);
    });
  }, []);

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
          path: '/catalog',
          element: <Catalog allCategories={allCategories} />,
          children: [
            { index: true, element: <Products allProducts={allProducts} /> },
            {
              element: <Products allProducts={allProducts} />,
              loader: ({ params }) => allCategories[params.categoryid].name,
              path: 'categories/:categoryid',
            },
            {
              element: (
                <CatalogProductDetail
                  allCategories={allCategories}
                  allProducts={allProducts}
                />
              ),
              loader: ({ params }) => ({
                product: allProducts[params.productid],
              }),
              path: 'products/:productid',
            },
          ],
        },
        {
          path: '/contact',
          element: <Contact />,
        },
        {
          path: '/dashboard',
          element: <Dashboard user={user} />,
          children: [
            { index: true, element: <Summary /> },
            {
              path: 'categories/:id',
              element: <CategoryDetail />,
            },
            {
              path: 'categories/:id/deleted',
              element: <CategoryDetail deleted />,
            },
            {
              path: 'categories/:id/edit',
              element: <CategoryDetail editing />,
            },
            {
              path: 'categories/',
              element: <ListCategories />,
            },
            {
              path: 'categories/new',
              element: <NewCategory />,
            },
            {
              path: 'products/:id',
              element: <ProductDetail />,
            },
            {
              path: 'products/:id/deleted',
              element: <ProductDetail deleted />,
            },
            {
              path: 'products/:id/edit',
              element: <ProductDetail editing />,
            },
            {
              path: 'products/new',
              element: <NewProduct />,
            },
            {
              path: 'products/',
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
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

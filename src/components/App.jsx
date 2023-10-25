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
import ForgotPassword from './ForgotPassword';
import Home from './Home';
import ListCategories from './ListCategories';
import ListProducts from './ListProducts';
import LoadingScreen from './LoadingScreen';
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
  const [infoSections, setInfoSections] = useState({});
  const [loadedCategories, setLoadedCategories] = useState(false);
  const [loadedInfo, setLoadedInfo] = useState(false);
  const [loadedProducts, setLoadedProducts] = useState(false);
  const [loading, setLoading] = useState(true);
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
    const unsubProducts = onSnapshot(productsQuery, (querySnapshot) => {
      const products = {};
      querySnapshot.forEach((docu) => {
        products[docu.id] = {
          ...docu.data(),
          accessories: docu.data().accessories.map((accessory) => accessory.id),
          category: docu.data().category.id,
          id: docu.id,
        };
      });
      setAllProducts(products);
      setLoadedProducts(true);
    });

    const categoriesQuery = query(collection(database, 'categories'));
    const unsubCategories = onSnapshot(categoriesQuery, (querySnapshot) => {
      const categories = {};
      querySnapshot.forEach((docu) => {
        categories[docu.id] = {
          ...docu.data(),
          id: docu.id,
        };
      });
      setAllCategories(categories);
      setLoadedCategories(true);
    });

    const infoQuery = query(collection(database, 'info'));
    const unsubInfo = onSnapshot(infoQuery, (querySnapshot) => {
      const info = {};
      querySnapshot.forEach((docu) => {
        info[docu.id] = {
          ...docu.data(),
        };
      });
      setInfoSections(info);
      setLoadedInfo(true);
    });

    return () => {
      unsubProducts();
      unsubCategories();
      unsubInfo();
    };
  }, []);

  useEffect(() => {
    if (loadedCategories && loadedInfo && loadedProducts) {
      setLoading(false);
    }
  }, [loadedCategories, loadedInfo, loadedProducts]);

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <Root
          allCategories={allCategories}
          allProducts={allProducts}
          user={user}
        />
      ),
      errorElement: <ErrorPage user={user} />,
      children: [
        {
          index: true,
          element: <Home infoSections={infoSections} user={user} />,
        },
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
              loader: ({ params }) => ({
                description: allCategories[params.categoryid].description,
                features: allCategories[params.categoryid].features,
                title: allCategories[params.categoryid].name,
              }),
              path: 'categories/:categoryid',
            },
            {
              element: (
                <CatalogProductDetail
                  allCategories={allCategories}
                  allProducts={allProducts}
                  user={user}
                />
              ),
              loader: ({ params }) => {
                const currentProduct = allProducts[params.productid];
                // firebase wont accept nested arrays, so we strungify it
                const specsExcel = currentProduct.specsExcel
                  ? JSON.parse(currentProduct.specsExcel)
                  : null;
                return { product: { ...currentProduct, specsExcel } };
              },
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
            {
              index: true,
              element: (
                <Summary
                  allCategories={allCategories}
                  allProducts={allProducts}
                />
              ),
            },
            {
              path: 'categories/:id',
              element: (
                <CategoryDetail
                  allCategories={allCategories}
                  allProducts={allProducts}
                />
              ),
            },
            {
              path: 'categories/:id/deleted',
              element: (
                <CategoryDetail
                  allCategories={allCategories}
                  allProducts={allProducts}
                />
              ),
            },
            {
              path: 'categories/:id/edit',
              element: (
                <CategoryDetail
                  allCategories={allCategories}
                  allProducts={allProducts}
                />
              ),
            },
            {
              path: 'categories/',
              element: (
                <ListCategories
                  allCategories={allCategories}
                  allProducts={allProducts}
                />
              ),
            },
            {
              path: 'categories/new',
              element: <NewCategory allCategories={allCategories} />,
            },
            {
              path: 'products/:id',
              element: (
                <ProductDetail
                  allCategories={allCategories}
                  allProducts={allProducts}
                />
              ),
            },
            {
              path: 'products/:id/deleted',
              element: (
                <ProductDetail
                  allCategories={allCategories}
                  allProducts={allProducts}
                />
              ),
            },
            {
              path: 'products/:id/edit',
              element: (
                <ProductDetail
                  allCategories={allCategories}
                  allProducts={allProducts}
                />
              ),
            },
            {
              path: 'products/new',
              element: (
                <NewProduct
                  allCategories={allCategories}
                  allProducts={allProducts}
                />
              ),
            },
            {
              path: 'products/',
              element: <ListProducts allProducts={allProducts} />,
            },
          ],
        },
        {
          path: '/forgot',
          element: <ForgotPassword />,
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

  if (loading) {
    return <LoadingScreen />;
  }

  return <RouterProvider router={router} />;
}

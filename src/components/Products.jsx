import { useEffect, useState } from 'react';
import { getAllCategories, getAllProducts } from '../util/database';

import HeroStatic from './HeroStatic';

import heroImage from '../assets/images/products.jpg';

export default function Products() {
  const [categories, setCategories] = useState([]);
  const [categoryTitle, setCategoryTitle] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const populateCategories = () => {
    if (categories.length) {
      // we have some categories
      return (
        <div className="categories card">
          <h2>Categories</h2>
          <ul>
            <li>
              <button type="button">All products</button>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <button type="button">{category.name}</button>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    // no categories means no products
    return <div className="card">No products available. Check back soon!</div>;
  };

  const populateProducts = () => {
    // card products-list
    if (products.length) {
      return (
        <div className="card products-list">
          <h2>{categoryTitle || 'All Products'}</h2>
          <div className="products-list-contents">
            {products.map((product) => (
              <div className="single-product" key={product.id}>
                <h3>{product.model}</h3>
                <img
                  alt={product.model}
                  className="product-image"
                  src={product.image}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }
    // no products
    return <div className="card">No products available. Check back soon!</div>;
  };

  useEffect(() => {
    const queryDatabase = async () => {
      setLoading(true);
      try {
        const categoriesQuery = await getAllCategories();
        setCategories(categoriesQuery);
        const productsQuery = await getAllProducts();
        setProducts(productsQuery);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err);
      }
    };
    queryDatabase();
  }, []);

  return (
    <div className="products">
      <HeroStatic image={heroImage} />
      <div className="info products-page">
        {error ? <div className="card">{error}</div> : null}

        {loading ? (
          <div className="card">Loading...</div>
        ) : (
          populateCategories()
        )}

        {loading ? <div className="card">Loading...</div> : populateProducts()}
      </div>
    </div>
  );
}

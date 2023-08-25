import { useEffect, useState } from 'react';
import getAllCategories from '../util/database';

import HeroStatic from './HeroStatic';

import heroImage from '../assets/images/products.jpg';

import '../styles/products.css';

export default function Products() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const populateCategories = () => {
    if (categories.length) {
      // we have some categories
      return (
        <div className="categories card">
          <h1>Categories</h1>
          <ul>
            <li>
              <button type="button">All products</button>
            </li>
            {categories.map((category) => (
              <li>
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

  useEffect(() => {
    const queryCategories = async () => {
      setLoading(true);
      try {
        const queryResult = await getAllCategories();
        setCategories(queryResult);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err);
      }
    };
    queryCategories();
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
        <div className="card products-list">
          <p>got some stuff here</p>
        </div>
      </div>
    </div>
  );
}

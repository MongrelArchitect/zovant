import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../util/database';

export default function ListProducts() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const listAllProducts = () => {
    if (products.length) {
      return products.map((product) => (
        <li key={product.id}>
          <Link to={`/dashboard/products/${product.id}`}>
            {product.model}
          </Link>
        </li>
      ));
    }
    return <li>No products found</li>;
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await getAllProducts();
        setProducts(allProducts);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
      setLoading(false);
    };
    loadProducts();
  }, []);

  return (
    <>
      <h2>Choose Product to View &amp; Edit</h2>
      {loading ? <div>Loading...</div> : null}
      <ul>{listAllProducts()}</ul>
      {error ? <div className="error">{error}</div> : null}
    </>
  );
}

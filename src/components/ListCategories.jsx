import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllCategories } from '../util/database';

export default function ListCategories() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const listAllCategories = () => {
    if (categories.length) {
      return categories.map((category) => (
        <li key={category.id}>
          <Link to={`/dashboard/categories/detail/${category.id}`}>
            {category.name}
          </Link>
        </li>
      ));
    }
    return <li>No categories found</li>;
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const allCategories = await getAllCategories();
        setCategories(allCategories);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
      setLoading(false);
    };
    loadCategories();
  }, []);

  return (
    <>
      <h2>Choose Category to View &amp; Edit</h2>
      {loading ? <div>Loading...</div> : null}
      <ul>{listAllCategories()}</ul>
      {error ? <div className="error">{error}</div> : null}
    </>
  );
}

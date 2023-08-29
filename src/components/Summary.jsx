import { useEffect, useState } from 'react';
import { getSummaryCounts } from '../util/database';

export default function Summary() {
  const [counts, setCounts] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const displaySummary = () => {
    const keys = Object.keys(counts);
    if (keys.length) {
      return (
        <>
          <li>
            {`${counts.categories} ${
              counts.categories > 1 ? 'categories' : 'category'
            }`}
          </li>
          <li>
            {`${counts.products} ${
              counts.products > 1 ? 'products' : 'product'
            }`}
          </li>
        </>
      );
    }
    return <li>No products or categories</li>;
  };

  useEffect(() => {
    const getCounts = async () => {
      setLoading(true);
      try {
        const summary = await getSummaryCounts();
        setCounts(summary);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
      setLoading(false);
    };
    getCounts();
  }, []);

  return (
    <>
      <h2>Summary</h2>
      {loading ? <div>Loading...</div> : <ul>{displaySummary()}</ul>}
      {error ? <div className="error">{error}</div> : null}
    </>
  );
}

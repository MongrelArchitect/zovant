import { useEffect, useState } from 'react';

export default function Summary({ allCategories, allProducts }) {
  const [counts, setCounts] = useState({});

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
    const summary = {
      categories: Object.keys(allCategories).length,
      products: Object.keys(allProducts).length,
    };
    setCounts(summary);
  }, []);

  return (
    <>
      <h2>Summary</h2>
      <ul className="product-detail">{displaySummary()}</ul>
    </>
  );
}

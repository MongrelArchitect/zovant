import { useLoaderData, useParams } from 'react-router-dom';
import ProductSummary from './ProductSummary';

export default function Products({ allProducts }) {
  const title = useLoaderData();

  const products = { ...allProducts };
  const { categoryid } = useParams();

  // only need certain products if we've got a category id in the url
  const getCategoryKeys = (keys) => {
    if (categoryid) {
      return keys
        .filter((key) => allProducts[key].categories.includes(categoryid));
    }
    return keys;
  };

  const productKeys = getCategoryKeys(Object.keys(allProducts));
  if (productKeys.length) {
    productKeys.sort((a, b) => {
      const nameA = allProducts[a].model.toLowerCase();
      const nameB = allProducts[b].model.toLowerCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }

  if (!productKeys.length) {
    return (
      <div className="dashboard-detail">
        <h2>Empty</h2>
        <div>No products found</div>
      </div>
    );
  }

  return (
    <div className="dashboard-detail">
      <h2>{title || 'All Products'}</h2>
      <div className="catalog-products">
        {productKeys.map((key) => (
          <ProductSummary key={key} product={products[key]} />
        ))}
      </div>
    </div>
  );
}

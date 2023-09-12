import { useLoaderData, useParams } from 'react-router-dom';
import ProductSummary from './ProductSummary';

export default function Products({ allProducts }) {
  const categoryData = useLoaderData();

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
        <h2>{categoryData ? categoryData.title : 'Empty'}</h2>
        <div>This category has no products</div>
        <div className="catalog-products">
          <ProductSummary />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-detail">
      <h2>{categoryData ? categoryData.title : 'All Products'}</h2>
      <div>
        {categoryData
          ? categoryData.description
          : 'Explore our entire catalog.'}
      </div>
      <div className="catalog-products">
        {productKeys.map((key) => (
          <ProductSummary key={key} product={products[key]} />
        ))}
      </div>
    </div>
  );
}

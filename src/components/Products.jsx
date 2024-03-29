import { useEffect, useState } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';
import ProductSummary from './ProductSummary';

export default function Products({ allProducts }) {
  const categoryData = useLoaderData();
  const { categoryid } = useParams();

  const [filters, setFilters] = useState([]);
  const [productIds, setProductIds] = useState([]);

  const filterProducts = (event) => {
    const { checked } = event.target;
    const featureId = event.target.value;
    const filtersCopy = [...filters];
    if (checked) {
      filtersCopy.push(featureId);
    } else {
      filtersCopy.splice(filtersCopy.indexOf(featureId), 1);
    }
    setFilters(filtersCopy);
  };

  const displayFeatures = () => {
    if (categoryData && Object.keys(categoryData.features).length) {
      // we're looking at a category that has features/filters, so show 'em
      const featureIds = Object.keys(categoryData.features);
      featureIds.sort((a, b) => {
        const featureA = categoryData.features[a];
        const featureB = categoryData.features[b];
        return featureA.localeCompare(featureB, 'en-us', { numeric: true });
      });
      return (
        <form>
          <fieldset>
            <legend>Filters</legend>
            <div className="feature-inputs">
              {featureIds.map((featureId) => (
                <div className="feature-choice" key={featureId}>
                  <input
                    id={featureId}
                    onChange={filterProducts}
                    type="checkbox"
                    value={featureId}
                  />
                  <label htmlFor={featureId}>
                    {categoryData.features[featureId]}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
        </form>
      );
    }
    return null;
  };

  const getCategoryKeys = (keys) => {
    // only need certain products if we've got a category id in the url
    if (categoryid) {
      return keys.filter((key) => allProducts[key].category === categoryid);
    }
    return keys;
  };

  useEffect(() => {
    setFilters([]);
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
    setProductIds(productKeys);
  }, [categoryid]);

  useEffect(() => {
    let productKeys = getCategoryKeys(Object.keys(allProducts));
    if (filters.length) {
      filters.forEach((filter) => {
        productKeys = productKeys
          .filter((prodId) => allProducts[prodId].features.includes(filter));
      });
    }
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
    setProductIds(productKeys);
  }, [filters]);

  const displayProducts = () => {
    if (productIds.length) {
      return productIds.map((key) => (
        <ProductSummary key={key} product={allProducts[key]} />
      ));
    }
    if (filters.length) {
      return (<div>No products found that match the selected filters.</div>);
    }
    return (<div>No products found in this category</div>);
  };

  return (
    <div className="dashboard-detail">
      <h2>{categoryData ? categoryData.title : 'All Products'}</h2>
      <div>
        {categoryData
          ? categoryData.description
          : 'Explore our entire catalog.'}
      </div>
      {displayFeatures()}
      <div className="catalog-products">
        {displayProducts()}
      </div>
    </div>
  );
}

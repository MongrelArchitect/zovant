import { useEffect, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';

import ndaaIcon from '../assets/images/ndaa.png';

export default function CatalogProductDetail({
  allCategories,
  allProducts,
  user,
}) {
  const { product } = useLoaderData();

  const [placeholder, setPlaceholder] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const displayAccessories = () => {
    if (product.accessories.length) {
      return (
        <div>
          <h4>Accessories / Related Products:</h4>
          <ul>
            {product.accessories.map((accessory) => (
              <li key={accessory}>
                <Link to={`/catalog/products/${accessory}`}>
                  {allProducts[accessory].model}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  const displayFeatures = () => {
    const productCategory = allCategories[product.category];
    const categoryFeatures = productCategory.features;
    if (product.features.length) {
      return (
        <ul className="product-features">
          {product.features.map((key) => (
            <li key={key}>
              {categoryFeatures[key]}
              {product.features.indexOf(key) === product.features.length - 1
                ? null
                : ', '}
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  return (
    <div id="catalog-detail" className="product-detail">
      <div className="detail-heading">
        <div>
          <h3>{product.model}</h3>
          <Link to={`/catalog/categories/${product.category}`}>
            {allCategories[product.category].name}
          </Link>
          {displayFeatures()}
          {user ? (
            <Link
              className="edit-button"
              to={`/dashboard/products/${product.id}/`}
            >
              View in dashboard
            </Link>
          ) : null}
        </div>
        {product.ndaa ? (
          <img alt="NDAA Compliant" className="ndaa-icon" src={ndaaIcon} />
        ) : null}
      </div>

      <div hidden={!placeholder} className="image-placeholder" />
      <img
        alt={product.model}
        className="catalog-detail-image product-image"
        hidden={placeholder}
        onLoad={() => {
          setPlaceholder(false);
        }}
        src={product.image}
      />

      <div>
        <h4>Description:</h4>
        <pre>{product.description}</pre>
      </div>

      <div>
        <h4>Specifications:</h4>
        <pre>{product.specs}</pre>
      </div>

      {displayAccessories()}
    </div>
  );
}

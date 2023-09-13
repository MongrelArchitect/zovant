import { useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';

export default function CatalogProductDetail({
  allCategories,
  allProducts,
  user,
}) {
  const { product } = useLoaderData();

  const [placeholder, setPlaceholder] = useState(true);

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

  const displayCategories = () => (
    <ul className="details-categories">
      {product.categories.map((category) => (
        <li key={category}>
          <Link to={`/catalog/categories/${category}`}>
            {allCategories[category].name}
          </Link>
          {product.categories.indexOf(category)
          === product.categories.length - 1
            ? null
            : ','}
        </li>
      ))}
    </ul>
  );

  const displayFeatures = () => {
    if (Object.keys(product.features).length) {
      return (
        <div>
          <h4>Features:</h4>
          <ul>
            {Object.keys(product.features).map((key) => (
              <li key={key}>{product.features[key]}</li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="product-detail">
      <div>
        <h3>{product.model}</h3>
        {displayCategories()}
      </div>
      {user ? (
        <Link
          className="edit-button"
          to={`/dashboard/products/${product.id}/`}
        >
          View in dashboard
        </Link>
      ) : null}
      <div className={product.inStock ? 'in-stock' : 'out-of-stock'}>
        {product.inStock ? '✓ In stock' : '⚠ Out of stock'}
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
      <div>{product.description}</div>
      {displayFeatures()}
      {displayAccessories()}
    </div>
  );
}

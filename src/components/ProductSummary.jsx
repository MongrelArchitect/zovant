import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProductSummary({ product }) {
  const [placeholder, setPlaceholder] = useState(true);

  if (!product) {
    return null;
  }

  return (
    <div className="product-detail">
      <h3>{product.model}</h3>
      <div className={product.inStock ? 'in-stock' : 'out-of-stock'}>
        {product.inStock ? '✓ In stock' : '⚠ Out of stock'}
      </div>
      <div hidden={!placeholder} className="image-placeholder" />
      <img
        alt={product.model}
        className="product-image"
        hidden={placeholder}
        onLoad={() => {
          setPlaceholder(false);
        }}
        src={product.image}
      />
      <Link className="detail-link" to={`/catalog/products/${product.id}`}>
        View Details
      </Link>
    </div>
  );
}

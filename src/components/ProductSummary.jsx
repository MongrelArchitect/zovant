import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ProductSummary({ product }) {
  const navigate = useNavigate();

  const [placeholder, setPlaceholder] = useState(true);

  const goToDetail = () => {
    navigate(`/catalog/products/${product.id}`);
  };

  if (!product) {
    return null;
  }

  return (
    // eslint-disable-next-line
    <div onClick={goToDetail} className="product-detail">
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

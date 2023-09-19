import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import ndaaIcon from '../assets/images/ndaa.png';

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
      {product.ndaa ? (
        <img alt="NDAA Complaint" className="ndaa-icon" src={ndaaIcon} />
      ) : null}
      <pre>{product.description}</pre>
      <Link className="detail-link" to={`/catalog/products/${product.id}`}>
        View Details
      </Link>
    </div>
  );
}

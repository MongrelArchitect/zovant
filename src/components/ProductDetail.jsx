import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  getAllProductAccessories,
  getAllProductCategories,
  getSingleProduct,
} from '../util/database';

export default function ProductDetail({ editing }) {
  const { id } = useParams();

  const [error, setError] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const displayAccessories = () => {
    if (productDetails.accessories.length) {
      return (
        <div>
          <h3>Accessories / Related Products:</h3>
          <ul>
            {productDetails.accessories.map((accessory) => (
              <li key={accessory.id}>{accessory.model}</li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  const displayCategories = () => {
    if (productDetails.categories.length) {
      return (
        <div>
          <h3>Categories:</h3>
          <ul>
            {productDetails.categories.map((category) => (
              <li key={category.id}>{category.name}</li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  const displayFeatures = () => {
    const keys = Object.keys(productDetails.features);
    if (keys.length) {
      return (
        <div>
          <h3>Features:</h3>
          <ul>
            {keys.map((key) => (
              <li key={key}>{productDetails.features[key]}</li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  const displayDetails = () => {
    if (loading) {
      return <div>Loading...</div>;
    }
    if (productDetails) {
      return (
        <>
          <div>{productDetails.model}</div>
          <div>{productDetails.inStock ? 'In stock' : 'Out of stock'}</div>
          <img
            alt={productDetails.model}
            className="product-image"
            src={productDetails.image}
          />
          <div>{productDetails.description}</div>
          {displayFeatures()}
          {displayCategories()}
          {displayAccessories()}
          <Link to={`/dashboard/products/${id}/edit`}>Edit</Link>
          <Link to="/dashboard/products/">Back to products list</Link>
        </>
      );
    }
    return null;
  };

  const displayForm = () => {};

  useEffect(() => {
    const getDetails = async () => {
      setLoading(true);
      try {
        const details = await getSingleProduct(id);
        details.categories = await getAllProductCategories(details.categories);
        details.accessories = await getAllProductAccessories(
          details.accessories,
        );
        setProductDetails(details);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
      setLoading(false);
    };
    getDetails();
  }, [editing]);

  return (
    <>
      <h2>{editing ? 'Edit Product' : 'Product Detail'}</h2>
      {editing ? displayForm() : displayDetails()}
      {error ? <div className="error">{error}</div> : null}
    </>
  );
}

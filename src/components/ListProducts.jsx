import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ListProducts({ allProducts }) {
  const navigate = useNavigate();

  const [placeholder, setPlaceholder] = useState(true);

  const productIds = Object.keys(allProducts);
  productIds.sort((a, b) => {
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

  const viewDetails = (event) => {
    navigate(`/dashboard/products/${event.target.dataset.id}`);
  };

  const listAllProducts = () => {
    if (productIds.length) {
      return productIds.map((id) => (
        <li key={id}>
          <button
            className={
              productIds.indexOf(id) % 2 === 0
                ? 'product-list-item even'
                : 'product-list-item'
            }
            onClick={viewDetails}
            data-id={id}
            type="button"
          >
            {allProducts[id].model}
            <div hidden={!placeholder} className="image-placeholder small" />
            <img
              alt={allProducts[id].model}
              className="product-image-small"
              data-id={id}
              hidden={placeholder}
              onLoad={() => {
                setPlaceholder(false);
              }}
              src={allProducts[id].image}
            />
          </button>
        </li>
      ));
    }
    return <li>No products found</li>;
  };

  return (
    <>
      <h2>Choose Product to View &amp; Edit</h2>
      <ul className="product-detail list">{listAllProducts()}</ul>
    </>
  );
}

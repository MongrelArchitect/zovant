import { Link } from 'react-router-dom';

export default function ListProducts({ allProducts }) {
  const productIds = Object.keys(allProducts);

  const listAllProducts = () => {
    if (productIds.length) {
      return productIds.map((id) => (
        <li key={id}>
          <Link to={`/dashboard/products/${id}`}>
            {allProducts[id].model}
          </Link>
        </li>
      ));
    }
    return <li>No products found</li>;
  };

  return (
    <>
      <h2>Choose Product to View &amp; Edit</h2>
      <ul className="product-detail">{listAllProducts()}</ul>
    </>
  );
}

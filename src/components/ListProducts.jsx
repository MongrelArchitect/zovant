import { Link } from 'react-router-dom';

export default function ListProducts({ allProducts }) {
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

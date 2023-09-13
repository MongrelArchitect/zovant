import { Link } from 'react-router-dom';

export default function ListCategories({ allCategories, allProducts }) {
  const categoryIds = Object.keys(allCategories);
  categoryIds.sort((a, b) => {
    const nameA = allCategories[a].name.toLowerCase();
    const nameB = allCategories[b].name.toLowerCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

  const countProducts = (id) => {
    const productIds = Object.keys(allProducts);
    const count = productIds.reduce((acc, curr) => {
      if (allProducts[curr].categories.includes(id)) {
        return acc + 1;
      }
      return acc;
    }, 0);
    return count;
  };

  const listAllCategories = () => {
    if (categoryIds.length) {
      return categoryIds.map((id) => {
        const count = countProducts(id);
        return (
          <li key={id}>
            <Link to={`/dashboard/categories/${id}`}>
              {allCategories[id].name}
            </Link>
            <div className="product-count">
              {` (${count} product${count === 1 ? '' : 's'})`}
            </div>
          </li>
        );
      });
    }
    return <li>No categories found</li>;
  };

  return (
    <>
      <h2>Choose Category to View &amp; Edit</h2>
      <ul className="product-detail">{listAllCategories()}</ul>
    </>
  );
}

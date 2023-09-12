import { Link } from 'react-router-dom';

export default function ListCategories({ allCategories }) {
  const categoryIds = Object.keys(allCategories);

  const listAllCategories = () => {
    if (categoryIds.length) {
      return categoryIds.map((id) => (
        <li key={id}>
          <Link to={`/dashboard/categories/${id}`}>
            {allCategories[id].name}
          </Link>
        </li>
      ));
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

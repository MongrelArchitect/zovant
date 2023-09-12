import { Link, Outlet } from 'react-router-dom';

import HeroStatic from './HeroStatic';

import heroImage from '../assets/images/products.jpg';

export default function Catalog({ allCategories }) {
  const categoryIds = allCategories ? Object.keys(allCategories) : [];
  if (categoryIds.length) {
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
  }

  const displayCategories = () => {
    if (!categoryIds.length) {
      return (
        <div className="dashboard-control">
          <h2>Categories</h2>
          <div>No categories found</div>
        </div>
      );
    }

    return (
      <div className="dashboard-control">
        <h2>Categories</h2>
        <ul>
          <li>
            <Link to="/catalog">
              All Products
            </Link>
          </li>
          {categoryIds.map((id) => (
            <li key={id}>
              <Link to={`/catalog/categories/${id}`}>
                {allCategories[id].name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="products">
      <HeroStatic image={heroImage} />
      <div className="dashboard info">
        <div className="card">
          <h1>Catalog</h1>
          <div className="catalog dashboard-content">
            {displayCategories()}
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

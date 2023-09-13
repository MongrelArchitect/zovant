import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

import triangleIcon from '../assets/images/triangle-down.svg';

export default function Catalog({ allCategories }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);

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

    const toggleDropdown = () => {
      setDropdownVisible(!dropdownVisible);
    };

    const closeDropdown = () => {
      window.scrollTo(0, 0);
      setDropdownVisible(false);
    };

    return (
      <div className="dashboard-control catalog-dashboard">
        <div className="catalog-control">
          <h2>Categories</h2>
          <button
            className="catalog-menu-button"
            onClick={toggleDropdown}
            type="button"
          >
            <img
              alt=""
              className={dropdownVisible ? 'show' : ''}
              src={triangleIcon}
            />
          </button>
        </div>
        <ul
          className={
            dropdownVisible ? 'catalog-categories show' : 'catalog-categories'
          }
        >
          <li>
            <Link onClick={closeDropdown} to="/catalog">All Products</Link>
          </li>
          {categoryIds.map((id) => (
            <li key={id}>
              <Link onClick={closeDropdown} to={`/catalog/categories/${id}`}>
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

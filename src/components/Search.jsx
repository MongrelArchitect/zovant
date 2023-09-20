import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Search({ allCategories, allProducts }) {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryResults, setCategoryResults] = useState({});
  const [placeholder, setPlaceholder] = useState(true);
  const [productResults, setProductResults] = useState({});

  const changeQuery = (event) => {
    setSearchQuery(event.target.value.toLowerCase().trim());
  };

  const viewCategory = (event) => {
    const { categoryid } = event.target.dataset;
    navigate(`/catalog/categories/${categoryid}`);
  };

  const viewProduct = (event) => {
    const { productid } = event.target.dataset;
    navigate(`/catalog/products/${productid}`);
  };

  const displayCategoryResults = () => {
    if (categoryResults.length) {
      return (
        <figure>
          <figcaption>Categories</figcaption>
          <ul>
            {categoryResults.map((catId) => (
              <li key={catId}>
                <button
                  className={
                    categoryResults.indexOf(catId) % 2 === 0
                      ? 'product-list-item even'
                      : 'product-list-item'
                  }
                  onClick={viewCategory}
                  data-categoryid={catId}
                  type="button"
                >
                  {allCategories[catId].name}
                </button>
              </li>
            ))}
          </ul>
        </figure>
      );
    }
    return null;
  };

  const displayProductResults = () => {
    if (productResults.length) {
      return (
        <figure>
          <figcaption>Products</figcaption>
          <ul>
            {productResults.map((prodId) => (
              <li key={prodId}>
                <button
                  className={
                      productResults.indexOf(prodId) % 2 === 0
                        ? 'product-list-item even'
                        : 'product-list-item'
                    }
                  onClick={viewProduct}
                  data-productid={prodId}
                  type="button"
                >
                  {allProducts[prodId].model}
                  <div
                    hidden={!placeholder}
                    className="image-placeholder small"
                  />
                  <img
                    alt={allProducts[prodId].model}
                    className="product-image-small"
                    data-productid={prodId}
                    hidden={placeholder}
                    onLoad={() => {
                      setPlaceholder(false);
                    }}
                    src={allProducts[prodId].image}
                  />
                </button>
              </li>
            ))}
          </ul>
        </figure>
      );
    }
    return null;
  };

  const displayResults = () => {
    if (categoryResults.length || productResults.length) {
      return (
        <div className="search-results">
          <div>
            Search returned
            {' '}
            {categoryResults.length + productResults.length}
            {' '}
            results:
          </div>
          {displayCategoryResults()}
          {displayProductResults()}
        </div>
      );
    }
    return <div className="search-results">Search returned 0 results.</div>;
  };

  const search = (event) => {
    // don't refresh page on submit
    event.preventDefault();

    if (searchQuery) {
      // get ids of categories with matched query in name or description
      const categoryIds = Object.keys(allCategories);
      const categorySearch = categoryIds.filter((catId) => {
        const nameResult = allCategories[catId].name
          .toLowerCase()
          .includes(searchQuery);
        const descResult = allCategories[catId].description
          .toLowerCase()
          .includes(searchQuery);
        return nameResult || descResult;
      });
      setCategoryResults(categorySearch);

      // get ids of products with matched query in model, description or specs
      const productIds = Object.keys(allProducts);
      const productSearch = productIds.filter((prodId) => {
        const modelResult = allProducts[prodId].model
          .toLowerCase()
          .includes(searchQuery);
        const descResult = allProducts[prodId].description
          .toLowerCase()
          .includes(searchQuery);
        const specResult = allProducts[prodId].specs
          .toLowerCase()
          .includes(searchQuery);
        return modelResult || descResult || specResult;
      });
      setProductResults(productSearch);
    } else {
      setCategoryResults([]);
      setProductResults([]);
    }

    // don't refresh page on submit
    return false;
  };

  return (
    <form className="search-form" onSubmit={search}>
      <input onChange={changeQuery} placeholder="search" type="text" />
      {displayResults()}
    </form>
  );
}

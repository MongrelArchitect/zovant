import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Search({
  allCategories,
  allProducts,
  setVisible,
  visible,
}) {
  const navigate = useNavigate();

  const [categoryResults, setCategoryResults] = useState({});
  const [placeholder, setPlaceholder] = useState(true);
  const [productResults, setProductResults] = useState({});
  const [hidden, setHidden] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const closeSearch = () => {
    setSearchQuery('');
    setHidden(true);
    if (setVisible) {
      setVisible(false);
    }
    setCategoryResults([]);
    setProductResults([]);
  };

  const viewCategory = (event) => {
    closeSearch();
    const { categoryid } = event.target.dataset;
    navigate(`/catalog/categories/${categoryid}`);
  };

  const viewProduct = (event) => {
    closeSearch();
    const { productid } = event.target.dataset;
    navigate(`/catalog/products/${productid}`);
  };

  const displayCategoryResults = () => {
    if (categoryResults.length) {
      return (
        <figure>
          <figcaption className="p8">Categories</figcaption>
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
                  role="link"
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
          <figcaption className="p8">Products</figcaption>
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
                  role="link"
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
    const resultCount = categoryResults.length + productResults.length;
    if (resultCount) {
      return (
        <div className={hidden ? 'search-results hidden' : 'search-results'}>
          <div className="p8">
            Search returned
            {' '}
            {resultCount}
            {' '}
            result
            {resultCount === 1 ? ':' : 's:'}
          </div>
          {displayCategoryResults()}
          {displayProductResults()}
        </div>
      );
    }
    return (
      <div className={hidden ? 'search-results hidden' : 'p8 search-results'}>
        Search returned 0 results.
      </div>
    );
  };

  const search = (query) => {
    if (query) {
      setHidden(false);
      // get ids of categories with matched query in name or description
      const categoryIds = Object.keys(allCategories);
      const categorySearch = categoryIds.filter((catId) => {
        const nameResult = allCategories[catId].name
          .toLowerCase()
          .includes(query);
        const descResult = allCategories[catId].description
          .toLowerCase()
          .includes(query);
        return nameResult || descResult;
      });
      setCategoryResults(categorySearch);

      // get ids of products with matched query in model, description or specs
      const productIds = Object.keys(allProducts);
      const productSearch = productIds.filter((prodId) => {
        const modelResult = allProducts[prodId].model
          .toLowerCase()
          .includes(query);
        const descResult = allProducts[prodId].description
          .toLowerCase()
          .includes(query);
        const specResult = allProducts[prodId].specs
          .toLowerCase()
          .includes(query);
        return modelResult || descResult || specResult;
      });
      setProductResults(productSearch);
    } else {
      closeSearch();
    }
  };

  const changeQuery = (event) => {
    const query = event.target.value.toLowerCase().trim();
    setSearchQuery(query);
    search(query);
  };

  return (
    <form
      className={visible ? 'search-form visible' : 'search-form'}
      onSubmit={(e) => {
        e.preventDefault();
        search();
        return false;
      }}
    >
      <input
        className="searchbar"
        onChange={changeQuery}
        placeholder="search"
        type="text"
        value={searchQuery || ''}
      />
      {displayResults()}
      <div
        className={hidden ? 'overlay hidden' : 'overlay'}
        onClick={closeSearch}
      />
    </form>
  );
}

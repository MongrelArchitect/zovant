import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteSingleCategory, updateCategory } from '../util/database';

export default function CategoryDetail({
  allCategories,
  allProducts,
}) {
  const { id } = useParams();

  const navigate = useNavigate();

  const [categoryDetails, setCategoryDetails] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [validName, setValidName] = useState(true);
  const [validDescription, setValidDescription] = useState(true);

  const changeName = (event) => {
    const newDetails = { ...categoryDetails, name: event.target.value };
    setError(null);
    setValidName(event.target.validity.valid);
    setCategoryDetails(newDetails);
  };

  const changeDescription = (event) => {
    const newDetails = { ...categoryDetails, description: event.target.value };
    setError(null);
    setValidDescription(event.target.validity.valid);
    setCategoryDetails(newDetails);
  };

  const toggleDelete = () => {
    setConfirmingDelete(!confirmingDelete);
  };

  const deleteCategory = async () => {
    setLoading(true);
    try {
      await deleteSingleCategory(id);
      navigate(`/dashboard/categories/${id}/deleted`);
      setEditing(false);
      setDeleted(true);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
    setLoading(false);
  };

  const deleteSection = () => {
    if (!confirmingDelete) {
      return (
        <button onClick={toggleDelete} type="button">
          Delete Category
        </button>
      );
    }
    if (products.length) {
      return (
        <>
          <div className="error">
            {`Cannot delete ${categoryDetails.name}: `}
            {`contains ${products.length} product${
              products.length > 1 ? 's' : ''
            }.`}
          </div>
          <div>
            Please remove the following products from this category (or delete
            them):
            <ul>
              {products.map((product) => (
                <li key={product.id}>
                  <Link to={`/dashboard/products/${product.id}`}>
                    {product.model}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <button onClick={toggleDelete} type="button">
            Cancel
          </button>
        </>
      );
    }
    return (
      <>
        <div className="error">
          Are you sure you want to delete
          {' '}
          {categoryDetails.name}
          ? This cannot be
          undone!
        </div>
        <button onClick={toggleDelete} type="button">
          Cancel
        </button>
        <button className="error" onClick={deleteCategory} type="button">
          Confirm Delete
        </button>
      </>
    );
  };

  const displayDetails = () => {
    if (loading) {
      return <div>Loading...</div>;
    }
    if (categoryDetails) {
      return (
        <div className="product-detail">
          <h3>{categoryDetails.name}</h3>
          <div>{categoryDetails.description}</div>
          <Link
            className="edit-button"
            onClick={() => {
              setEditing(true);
            }}
            to={`/dashboard/categories/${id}/edit`}
          >
            Edit
          </Link>
          <Link to="/dashboard/categories/">Back to category list</Link>
          <ul>
            <span>
              {products.length
                ? `${products.length} ${
                  products.length > 1 ? 'products:' : 'product:'
                }`
                : 'No products found'}
            </span>
            {products.length
              ? products.map((product) => (
                <li key={product.id}>
                  <Link to={`/dashboard/products/${product.id}`}>
                    {product.model}
                  </Link>
                </li>
              ))
              : null}
          </ul>
        </div>
      );
    }
    return null;
  };

  const submitEdit = async () => {
    try {
      setLoading(true);
      if (validName && validDescription) {
        await updateCategory(
          id,
          categoryDetails.name,
          categoryDetails.description,
        );
        navigate(`/dashboard/categories/${id}`);
        setEditing(false);
        setLoading(false);
      } else {
        setLoading(false);
        setError('Name and description required');
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const displayForm = () => {
    if (loading) {
      return <div>Loading...</div>;
    }
    if (categoryDetails) {
      return (
        <form className="product-detail">
          <label htmlFor="name">
            Name
            <input
              id="name"
              onChange={changeName}
              required
              type="text"
              value={categoryDetails.name || ''}
            />
          </label>
          <label htmlFor="description">
            Description
            <textarea
              id="description"
              onChange={changeDescription}
              required
              rows="5"
              value={categoryDetails.description || ''}
            />
          </label>
          <button className="submit" onClick={submitEdit} type="button">
            Submit
          </button>
          {deleteSection()}
          <Link
            onClick={() => {
              setEditing(false);
            }}
            to={`/dashboard/categories/${id}`}
          >
            Cancel edit
          </Link>
        </form>
      );
    }
    return null;
  };

  const getAllCategoryProducts = () => {
    const productIds = Object.keys(allProducts);
    const categoryProducts = productIds
      .filter((prodId) => allProducts[prodId].categories.includes(id))
      .map((prodId) => allProducts[prodId]);
    return categoryProducts;
  };

  useEffect(() => {
    if (!deleted) {
      const details = allCategories[id];
      setCategoryDetails(details);
    }
  }, [editing]);

  useEffect(() => {
    if (!deleted) {
      const categoryProducts = getAllCategoryProducts();
      setProducts(categoryProducts);
    }
  }, []);

  if (deleted) {
    return (
      <>
        <h2>Category Deleted</h2>
        <div>Delete successful.</div>
        <Link to="/dashboard/categories">Return to categories list</Link>
      </>
    );
  }

  return (
    <>
      <h2>{editing ? 'Edit Category' : 'Category Detail'}</h2>
      {editing ? displayForm() : displayDetails()}
      {error ? <div className="error">{error}</div> : null}
    </>
  );
}

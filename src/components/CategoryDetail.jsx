import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  getAllCategoryProducts,
  getSingleCategory,
  updateCategory,
} from '../util/database';

export default function CategoryDetail({ editing }) {
  const { id } = useParams();

  const navigate = useNavigate();

  const [categoryDetails, setCategoryDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const displayDetails = () => {
    if (categoryDetails) {
      return (
        <>
          <div>{categoryDetails.name}</div>
          <div>{categoryDetails.description}</div>
          <Link to={`/dashboard/categories/${id}/edit`}>Edit</Link>
          <Link to="/dashboard/categories/">Back to category list</Link>
          <ul>
            <span>
              {products.length
                ? `${products.length} ${
                  products.length > 1 ? 'products' : 'product'
                }`
                : 'Category has no products'}
            </span>
            {products.length
              ? products.map((product) => (
                <li key={product.id}>{product.model}</li>
              ))
              : null}
          </ul>
        </>
      );
    }
    return null;
  };

  const submitEdit = async () => {
    try {
      if (validName && validDescription) {
        await updateCategory(
          id,
          categoryDetails.name,
          categoryDetails.description,
        );
        navigate(`/dashboard/categories/${id}`);
      } else {
        setError('Name and description required');
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const displayForm = () => {
    if (categoryDetails) {
      return (
        <form>
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
          <button onClick={submitEdit} type="button">
            Submit
          </button>
          <Link to={`/dashboard/categories/${id}`}>Cancel edit</Link>
        </form>
      );
    }
    return null;
  };

  useEffect(() => {
    const getDetails = async () => {
      setLoading(true);
      try {
        const details = await getSingleCategory(id);
        setCategoryDetails(details);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
      setLoading(false);
    };
    getDetails();
  }, [editing]);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const categoryProducts = await getAllCategoryProducts(id);
        setProducts(categoryProducts);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };
    getProducts();
  }, []);

  return (
    <>
      <h2>{editing ? 'Edit Category' : 'Category Detail'}</h2>
      {loading ? <div>Loading...</div> : null}
      {editing ? displayForm() : displayDetails()}
      {error ? <div className="error">{error}</div> : null}
    </>
  );
}

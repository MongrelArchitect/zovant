import { useState } from 'react';
import { Link } from 'react-router-dom';
import { addNewCategory } from '../util/database';

export default function NewCategory({ allCategories }) {
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [successId, setSuccessId] = useState('');
  const [validDescription, setValidDescription] = useState(false);
  const [validName, setValidName] = useState(false);

  const changeName = (event) => {
    setName(event.target.value);
    setError('');
    setValidName(event.target.validity.valid);
  };

  const changeDescription = (event) => {
    setDescription(event.target.value);
    setError('');
    setValidDescription(event.target.validity.valid);
  };

  const checkCategoryExists = (checkName) => Object.values(allCategories).some(
    (category) => category.name === checkName,
  );

  const submit = async () => {
    setLoading(true);
    try {
      if (validDescription && validName) {
        const categoryExists = checkCategoryExists(name);
        if (!categoryExists) {
          const newCategory = await addNewCategory(name, description);
          setSuccessId(newCategory.id);
        } else {
          setError(`Category "${name}" already exists`);
        }
      } else {
        setError('Name and description required');
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      setError('Error submitting to database');
    }
    setLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (successId) {
    return (
      <>
        <h2>Category Created</h2>
        <div className="product-detail">
          <div>
            {name}
            {' '}
            created successfully.
          </div>
          <Link to={`/dashboard/categories/${successId}`}>View details</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <h2>New Category</h2>
      <form className="product-detail">
        <label htmlFor="name">
          Name
          <input
            id="name"
            onChange={changeName}
            placeholder="Enter category name"
            required
            type="text"
            value={name || ''}
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            id="description"
            onChange={changeDescription}
            placeholder="Provide a brief description of the category"
            required
            rows="5"
            value={description || ''}
          />
        </label>
        {error ? <span className="error">{error}</span> : null}
        <button className="submit" onClick={submit} type="button">
          Submit
        </button>
      </form>
    </>
  );
}

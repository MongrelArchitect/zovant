import { useState } from 'react';
import { addNewCategory, checkCategoryExists } from '../util/database';

export default function NewCategory() {
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [name, setName] = useState('');
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

  const submit = async () => {
    try {
      if (validDescription && validName) {
        const categoryExists = await checkCategoryExists(name);
        if (!categoryExists) {
          await addNewCategory(name, description);
        } else {
          setError(`Category "${name}" already exists`);
        }
      } else {
        setError('Name and description required');
      }
    } catch (err) {
      console.error(err);
      setError('Error submitting to database');
    }
  };

  return (
    <>
      <h2>New Category</h2>
      <form>
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

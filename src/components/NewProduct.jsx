import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { getAllCategories } from '../util/database';

export default function NewProduct() {
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState('');
  const [validDescription, setValidDescription] = useState(false);
  const [validModel, setValidModel] = useState(false);

  const changeCategories = (event) => {
    const { index } = event.target.dataset;
    const newCategories = [...categories];
    newCategories[index].include = event.target.checked;
    setCategories(newCategories);
  };

  const changeDescription = (event) => {
    setError(null);
    setDescription(event.target.value);
    setValidDescription(event.target.validity.valid);
  };

  const changeModel = (event) => {
    setError(null);
    setModel(event.target.value);
    setValidModel(event.target.validity.valid);
  };

  const displayCategories = () => {
    if (categories.length) {
      return categories.map((category) => (
        <div className="category-choice" key={category.id}>
          <input
            data-index={categories.indexOf(category)}
            id={`category${category.id}`}
            onChange={changeCategories}
            type="checkbox"
          />
          <label htmlFor={`category${category.id}`}>{category.name}</label>
        </div>
      ));
    }
    return (
      <div>
        No categories found. Please
        {' '}
        <Link to="/dashboard/categories/new">create a new category</Link>
      </div>
    );
  };

  const displayFeatures = () => {
    if (features.length) {
      return features.map((feature) => (
        <div key={feature.id}>
          <input type="text" />
          <button type="button">X</button>
        </div>
      ));
    }
    return null;
  };

  const newFeature = () => {
    const newFeatures = [...features];
    newFeatures.push({
      id: uuid(),
      text: '',
    });
    setFeatures(newFeatures);
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const allCategories = await getAllCategories();
        allCategories.forEach((category) => {
          // eslint-disable-next-line
          category.include = false;
        });
        setCategories(allCategories);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
      setLoading(false);
    };
    loadCategories();
  }, []);

  return (
    <>
      <h2>New Product</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <form>
          <label htmlFor="model">
            Model
            <input
              id="model"
              onChange={changeModel}
              placeholder="Model number / name"
              required
              type="text"
              value={model || ''}
            />
          </label>

          <label htmlFor="description">
            Description
            <textarea
              id="description"
              onChange={changeDescription}
              placeholder="Provide a brief description of the product"
              rows="5"
              value={description || ''}
            />
          </label>

          <fieldset>
            <legend>Features</legend>
            {displayFeatures()}
            <button onClick={newFeature} type="button">+ add feature</button>
          </fieldset>

          <fieldset>
            <legend>Select all categories for this product</legend>
            {displayCategories()}
          </fieldset>

        </form>
      )}
      {error ? <div className="error">{error}</div> : null}
    </>
  );
}

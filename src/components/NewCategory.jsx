import { useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import { addNewCategory } from '../util/database';

export default function NewCategory({ allCategories }) {
  const [attempted, setAttempted] = useState(false);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [features, setFeatures] = useState({});
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [successId, setSuccessId] = useState('');
  const [validFeatures, setValidFeatures] = useState(true);
  const [validName, setValidName] = useState(false);

  const changeName = (event) => {
    setName(event.target.value);
    setError('');
    setValidName(event.target.validity.valid);
  };

  const changeDescription = (event) => {
    setDescription(event.target.value);
    setError('');
  };

  const checkValidFeatures = (copy) => {
    setError(null);
    const keys = Object.keys(copy);
    let valid = true;
    if (!keys.length) {
      // no features = valid, since they're optional
      return valid;
    }
    for (let i = 0; i < keys.length; i += 1) {
      if (!copy[keys[i]]) {
        valid = false;
        break;
      }
    }
    return valid;
  };

  const changeFeature = (event) => {
    const feature = event.target.value;
    const { featureid } = event.target.dataset;
    const newFeatures = { ...features };
    newFeatures[featureid] = feature;
    setFeatures(newFeatures);
    setValidFeatures(checkValidFeatures(newFeatures));
  };

  const checkCategoryExists = (checkName) => Object.values(allCategories).some(
    (category) => category.name === checkName,
  );

  const deleteFeature = (event) => {
    const { featureid } = event.target.dataset;
    const newFeatures = { ...features };
    delete newFeatures[featureid];
    setFeatures(newFeatures);
    setValidFeatures(checkValidFeatures(newFeatures));
  };

  const displayFeatures = () => {
    const keys = Object.keys(features);
    if (keys.length) {
      return (
        <div className="feature-inputs">
          {keys.map((featureId) => (
            <div key={featureId}>
              <input
                data-featureid={featureId}
                onChange={changeFeature}
                type="text"
                value={features[featureId] || ''}
              />
              <button
                className="error"
                data-featureid={featureId}
                onClick={deleteFeature}
                type="button"
              >
                X
              </button>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const newFeature = () => {
    setValidFeatures(false);
    const newFeatures = { ...features };
    const featureId = uuid();
    newFeatures[featureId] = '';
    setFeatures(newFeatures);
  };

  const submit = async () => {
    setAttempted(true);
    setLoading(true);
    try {
      if (validName && validFeatures) {
        const categoryExists = checkCategoryExists(name);
        if (!categoryExists) {
          const newCategory = await addNewCategory(name, description, features);
          setSuccessId(newCategory.id);
        } else {
          setValidName(false);
          setError(`Category "${name}" already exists`);
        }
      } else {
        setError('Something went wrong - check each input');
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError('Error submitting to database');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex g16 align-center">
        Loading...
        <div className="loading-animation" />
      </div>
    );
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
          Name (required)
          <input
            id="name"
            onChange={changeName}
            placeholder="Enter category name"
            required
            type="text"
            value={name || ''}
          />
          {attempted && !validName ? (
            <div className="error">Name required</div>
          ) : null}
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

        <fieldset>
          <legend>Features / Filters</legend>
          {displayFeatures()}
          <button onClick={newFeature} type="button">
            + add feature / filter
          </button>
          {attempted && !validFeatures ? (
            <div className="error">No empty features / filters</div>
          ) : null}
        </fieldset>

        {error ? <span className="error">{error}</span> : null}
        <button className="submit" onClick={submit} type="button">
          Submit
        </button>
      </form>
    </>
  );
}

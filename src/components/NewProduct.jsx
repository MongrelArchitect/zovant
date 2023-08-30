import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { getAllCategories } from '../util/database';

export default function NewProduct() {
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [features, setFeatures] = useState({});
  const [image, setImage] = useState(null);
  const [inStock, setInStock] = useState(true);
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState('');
  const [validCategories, setValidCategories] = useState(false);
  const [validDescription, setValidDescription] = useState(false);
  const [validFeatures, setValidFeatures] = useState(true);
  const [validImage, setValidImage] = useState(false);
  const [validModel, setValidModel] = useState(false);

  const changeCategories = (event) => {
    const { index } = event.target.dataset;
    const newCategories = [...categories];
    newCategories[index].include = event.target.checked;
    let valid = false;
    for (let i = 0; i < newCategories.length; i += 1) {
      if (newCategories[i].include) {
        valid = true;
        break;
      }
    }
    setValidCategories(valid);
    setCategories(newCategories);
  };

  const changeDescription = (event) => {
    setError(null);
    setDescription(event.target.value);
    setValidDescription(event.target.validity.valid);
  };

  const changeFeature = (event) => {
    if (event.target.value.trim()) {
      setValidFeatures(true);
    } else {
      setValidFeatures(false);
    }
    const { featureid } = event.target.dataset;
    const newFeatures = { ...features };
    newFeatures[featureid] = event.target.value;
    setFeatures(newFeatures);
  };

  const changeImage = (event) => {
    const file = event.target.files[0];
    if (!file || file.type.split('/')[0] !== 'image' || file.size > 5000000) {
      setValidImage(false);
    } else {
      setValidImage(true);
    }
    setImage(file);
  };

  const changeInStock = (event) => {
    setInStock(event.target.checked);
  };

  const changeModel = (event) => {
    setError(null);
    setModel(event.target.value);
    setValidModel(event.target.validity.valid);
  };

  const deleteFeature = (event) => {
    const { featureid } = event.target.dataset;
    const newFeatures = { ...features };
    delete newFeatures[featureid];
    setFeatures(newFeatures);
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
    const keys = Object.keys(features);
    if (keys.length) {
      return keys.map((featureId) => (
        <div key={featureId}>
          <input
            data-featureid={featureId}
            onChange={changeFeature}
            type="text"
            value={features[featureId] || ''}
          />
          <button
            data-featureid={featureId}
            onClick={deleteFeature}
            type="button"
          >
            X
          </button>
        </div>
      ));
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

          <div className="category-choice">
            <input
              checked={inStock}
              id="inStock"
              onChange={changeInStock}
              type="checkbox"
            />
            {/* eslint-disable-next-line */}
            <label htmlFor="inStock">In Stock</label>
          </div>

          <fieldset>
            <legend>Features</legend>
            {displayFeatures()}
            <button onClick={newFeature} type="button">
              + add feature
            </button>
          </fieldset>

          <label htmlFor="image">
            Image (5MB max)
            {image ? (
              <img
                alt=""
                className="image-preview"
                src={URL.createObjectURL(image)}
              />
            ) : null}
            <input
              accept="image/*"
              id="image"
              onChange={changeImage}
              type="file"
            />
          </label>

          <fieldset>
            <legend>Select all categories for this product</legend>
            {displayCategories()}
          </fieldset>

          <button type="button">Submit</button>
        </form>
      )}
      {error ? <div className="error">{error}</div> : null}
    </>
  );
}

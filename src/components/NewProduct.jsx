import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import {
  addNewProduct,
  addProductImage,
  updateProductAccessories,
} from '../util/database';

export default function NewProduct({ allCategories, allProducts }) {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const [accessories, setAccessories] = useState([]);
  const [addingAccessories, setAddingAccessories] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [features, setFeatures] = useState({});
  const [image, setImage] = useState(null);
  const [inStock, setInStock] = useState(true);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('');
  const [productCategories, setProductCategories] = useState([]);
  const [validCategories, setValidCategories] = useState(false);
  const [validDescription, setValidDescription] = useState(false);
  const [validFeatures, setValidFeatures] = useState(true);
  const [validImage, setValidImage] = useState(false);
  const [validModel, setValidModel] = useState(false);

  const changeAccessories = (event) => {
    const newAccessories = [...accessories];
    const { checked } = event.target;
    const productId = event.target.dataset.id;
    if (checked) {
      newAccessories.push(productId);
      setAccessories(newAccessories);
    } else {
      const index = newAccessories.indexOf(productId);
      newAccessories.splice(index, 1);
      setAccessories(newAccessories);
    }
  };

  const changeCategories = (event) => {
    const { categoryid } = event.target.dataset;
    const { checked } = event.target;

    const newProductCategories = [...productCategories];
    if (checked) {
      newProductCategories.push(categoryid);
    } else {
      const index = newProductCategories.indexOf(categoryid);
      newProductCategories.splice(index, 1);
    }

    setValidCategories(newProductCategories.length);
    setProductCategories(newProductCategories);
  };

  const changeDescription = (event) => {
    setError(null);
    setDescription(event.target.value);
    setValidDescription(event.target.validity.valid);
  };

  const checkValidFeatures = (copy) => {
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

  const checkProductExists = (checkModel) => Object.values(checkModel).some(
    (product) => product.model === checkModel,
  );

  const deleteFeature = (event) => {
    const { featureid } = event.target.dataset;
    const newFeatures = { ...features };
    delete newFeatures[featureid];
    setFeatures(newFeatures);
    setValidFeatures(checkValidFeatures(newFeatures));
  };

  const displayAccessories = () => {
    const productIds = Object.keys(allProducts);

    if (addingAccessories && productIds.length) {
      return productIds.map((id) => (
        <div className="category-choice" key={id}>
          <input
            data-id={id}
            id={`product${id}`}
            onChange={changeAccessories}
            type="checkbox"
          />
          <label htmlFor={`product${id}`}>{allProducts[id].model}</label>
        </div>
      ));
    }
    return null;
  };

  const displayCategories = () => {
    const categoryIds = Object.keys(allCategories);

    if (categoryIds.length) {
      return categoryIds.map((id) => (
        <div className="category-choice" key={id}>
          <input
            data-categoryid={id}
            id={`category${id}`}
            onChange={changeCategories}
            type="checkbox"
          />
          <label htmlFor={`category${id}`}>{allCategories[id].name}</label>
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
    if (
      validCategories
      && validDescription
      && validFeatures
      && validImage
      && validModel
    ) {
      if (checkProductExists(model)) {
        setError(`Product model ${model} already in database`);
      } else {
        setLoading(true);
        try {
          const newProduct = {
            accessories,
            categories: productCategories,
            description,
            features,
            inStock,
            model,
          };
          // upload new product to database
          const product = await addNewProduct(newProduct);
          // upload image to storage and update product accordingly
          await addProductImage(product.id, image);
          // add product to "accessories" arrays of its own accessories
          await updateProductAccessories(product.id);
          // navigate to product detail after success
          navigate(`/dashboard/products/${product.id}`);
        } catch (err) {
          setLoading(false);
          console.error(err);
          setError(err.message);
        }
      }
    } else {
      setError('Something went wrong - check each input');
    }
  };

  return (
    <>
      <h2>New Product</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <form className="product-detail">
          <label htmlFor="model">
            Model (required)
            <input
              id="model"
              onChange={changeModel}
              placeholder="Model number / name"
              required
              type="text"
              value={model || ''}
            />
            {attempted && !validModel ? (
              <div className="error">Model required</div>
            ) : null}
          </label>

          <label htmlFor="description">
            Description (required)
            <textarea
              id="description"
              onChange={changeDescription}
              placeholder="Provide a brief description of the product"
              required
              rows="5"
              value={description || ''}
            />
            {attempted && !validDescription ? (
              <div className="error">Description required</div>
            ) : null}
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
            {attempted && !validFeatures ? (
              <div className="error">No empty features</div>
            ) : null}
          </fieldset>

          <label htmlFor="image">
            Image (required)
            {image ? (
              <img
                alt=""
                className="image-preview"
                src={URL.createObjectURL(image)}
              />
            ) : null}
            <div>{image ? image.name : 'no file chosen'}</div>
            <input
              accept="image/*"
              hidden
              id="image"
              onChange={changeImage}
              ref={fileInputRef}
              type="file"
            />
            <button
              onClick={() => {
                fileInputRef.current.click();
              }}
              type="button"
            >
              Upload Image
            </button>
            {attempted && !validImage ? (
              <div className="error">Image required (5MB limit)</div>
            ) : null}
          </label>

          <fieldset>
            <legend>Select categories (at least 1 required)</legend>
            {displayCategories()}
            {attempted && !validCategories ? (
              <div className="error">At least 1 category required</div>
            ) : null}
          </fieldset>

          <fieldset>
            <legend>Accessories / related products</legend>
            {displayAccessories()}
            {!addingAccessories ? (
              <button
                onClick={() => {
                  setAddingAccessories(true);
                }}
                type="button"
              >
                + add accessories
              </button>
            ) : null}
          </fieldset>
          <button className="submit" onClick={submit} type="button">
            Submit
          </button>
        </form>
      )}
      {error ? <div className="error">{error}</div> : null}
    </>
  );
}

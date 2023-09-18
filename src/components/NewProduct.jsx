import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  addNewProduct,
  addProductImage,
  updateProductAccessories,
} from '../util/database';

import dropIcon from '../assets/images/drop-file.svg';

export default function NewProduct({ allCategories, allProducts }) {
  const fileInputRef = useRef(null);

  const [accessories, setAccessories] = useState([]);
  const [addingAccessories, setAddingAccessories] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [category, setCategory] = useState(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [features, setFeatures] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('');
  const [ndaa, setNdaa] = useState(true);
  const [specs, setSpecs] = useState('');
  const [successId, setSuccessId] = useState('');
  const [validCategory, setValidCategory] = useState(false);
  const [validDescription, setValidDescription] = useState(false);
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

  const changeCategory = (event) => {
    setError(null);
    setCategory(event.target.value);
    if (Object.keys(allCategories).includes(event.target.value)) {
      setValidCategory(true);
    } else {
      setValidCategory(false);
    }
  };

  const changeDescription = (event) => {
    setError(null);
    setDescription(event.target.value);
    setValidDescription(event.target.validity.valid);
  };

  const changeFeatures = (event) => {
    const { featureid } = event.target.dataset;
    const featuresCopy = [...features];
    if (!featuresCopy.includes(featureid)) {
      featuresCopy.push(featureid);
    } else {
      featuresCopy.splice(featuresCopy.indexOf(featureid), 1);
    }
    setFeatures(featuresCopy);
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

  const changeNdaa = (event) => {
    setNdaa(event.target.checked);
  };

  const changeModel = (event) => {
    setError(null);
    setModel(event.target.value);
    setValidModel(event.target.validity.valid);
  };

  const changeSpecs = (event) => {
    setError(null);
    setSpecs(event.target.value);
  };

  const checkProductExists = (checkModel) => {
    const check = Object.values(checkModel);
    return check.some((product) => product.model === checkModel);
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
    if (addingAccessories && productIds.length <= 1) {
      return (
        <div className="error">No other products in catalog. Add some!</div>
      );
    }
    return null;
  };

  const displayCategories = () => {
    const categoryIds = Object.keys(allCategories);

    if (categoryIds.length) {
      return (
        <label htmlFor="categories">
          Category (required)
          <select
            defaultValue="DEFAULT"
            id="categories"
            name="categories"
            onChange={changeCategory}
          >
            <option value="DEFAULT" disabled>
              CHOOSE A CATEGORY
            </option>
            {categoryIds.map((categoryId) => (
              <option key={categoryId} value={categoryId}>
                {allCategories[categoryId].name}
              </option>
            ))}
          </select>
        </label>
      );
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
    if (category) {
      const categoryFeatures = allCategories[category].features;
      const featureIds = Object.keys(categoryFeatures)
        .sort((a, b) => {
          const featureA = categoryFeatures[a];
          const featureB = categoryFeatures[b];
          return featureA.localeCompare(featureB, 'en-us', { numeric: true });
        });

      if (featureIds.length) {
        return (
          <div className="feature-inputs">
            {featureIds.map((featureId) => (
              <div className="feature-choice" key={featureId}>
                <input
                  data-featureid={featureId}
                  id={featureId}
                  onChange={changeFeatures}
                  type="checkbox"
                  value={categoryFeatures[featureId]}
                />
                <label htmlFor={featureId}>
                  {categoryFeatures[featureId]}
                </label>
              </div>
            ))}
          </div>
        );
      }
      return <div>This category has no features / filters</div>;
    }
    return <div>Please choose a category to view its features / filters</div>;
  };

  const dropFile = (event) => {
    setError(null);
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file || file.type.split('/')[0] !== 'image' || file.size > 5000000) {
      setValidImage(false);
    } else {
      setValidImage(true);
    }
    setImage(file);
  };

  const submit = async () => {
    setLoading(true);
    setAttempted(true);
    if (validCategory && validDescription && validImage && validModel) {
      if (checkProductExists(model)) {
        setError(`Product model ${model} already in database`);
      } else {
        try {
          const newProduct = {
            accessories,
            category,
            description,
            features,
            model,
            ndaa,
            specs,
          };
          // upload new product to database
          const product = await addNewProduct(newProduct);
          // upload image to storage and update product accordingly
          await addProductImage(product.id, image);
          // add product to "accessories" arrays of its own accessories
          await updateProductAccessories(product.id);
          // show success message with link to product detail
          setSuccessId(product.id);
        } catch (err) {
          setLoading(false);
          console.error(err);
          setError(err.message);
        }
      }
    } else {
      setError('Something went wrong - check each input');
    }
    setLoading(false);
  };

  if (successId) {
    return (
      <>
        <h2>Product Created</h2>
        <div className="product-detail">
          <div>
            {model}
            {' '}
            created successfully.
          </div>
          <Link to={`/dashboard/products/${successId}`}>View details</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <h2>New Product</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <form className="product-detail">
          <div>
            {displayCategories()}
            {attempted && !validCategory ? (
              <div className="error">Category required</div>
            ) : null}
          </div>

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

          <label htmlFor="specs">
            Specifications
            <textarea
              id="specs"
              onChange={changeSpecs}
              placeholder="Enter the product specifications"
              rows="5"
              value={specs || ''}
            />
          </label>

          <div className="category-choice">
            <input
              checked={ndaa}
              id="ndaa"
              onChange={changeNdaa}
              type="checkbox"
            />
            {/* eslint-disable-next-line */}
            <label htmlFor="ndaa">NDAA Compliant</label>
          </div>

          <fieldset>
            <legend>Features / Filters</legend>
            {displayFeatures()}
          </fieldset>

          <label className="image-label" htmlFor="image">
            Image (required)
            <div
              className={image ? 'drop-file' : 'drop-file empty'}
              onDragOver={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              onDrop={dropFile}
            >
              {image ? (
                <img
                  alt=""
                  className="image-preview"
                  src={URL.createObjectURL(image)}
                />
              ) : (
                <>
                  <img alt="" className="drop-image" src={dropIcon} />
                  <div>Drop file here</div>
                </>
              )}
            </div>
            {image ? image.name : 'no file chosen'}
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
          {error ? <div className="error">{error}</div> : null}
        </form>
      )}
    </>
  );
}

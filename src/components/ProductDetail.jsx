import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  addProductImage,
  deleteOldImage,
  deleteSingleProduct,
  removeProductFromAccessories,
  updateProduct,
  updateProductAccessories,
} from '../util/database';

import ndaaIcon from '../assets/images/ndaa.png';

export default function ProductDetail({ allCategories, allProducts }) {
  const fileInputRef = useRef(null);

  const { id } = useParams();

  const navigate = useNavigate();

  const [attempted, setAttempted] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [originalAccessories, setOriginalAccessories] = useState([]);
  const [placeholder, setPlaceholder] = useState(true);
  const [productDetails, setProductDetails] = useState(null);
  const [validCategory, setValidCategory] = useState(true);
  const [validDescription, setValidDescription] = useState(true);
  const [validImage, setValidImage] = useState(true);
  const [validModel, setValidModel] = useState(true);

  const changeAccessories = (event) => {
    const prodId = event.target.value;
    const { checked } = event.target;
    const accessoriesCopy = [...productDetails.accessories];
    if (checked) {
      accessoriesCopy.push(prodId);
    } else {
      accessoriesCopy.splice(accessoriesCopy.indexOf(prodId), 1);
    }
    setProductDetails({ ...productDetails, accessories: accessoriesCopy });
  };

  const changeDescription = (event) => {
    setError(null);
    setProductDetails({ ...productDetails, description: event.target.value });
    setValidDescription(event.target.validity.valid);
  };

  const changeImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.split('/')[0] !== 'image' || file.size > 5000000) {
        setValidImage(false);
      } else {
        setValidImage(true);
      }
    } else {
      setValidImage(true);
    }
    setNewImage(file);
  };

  const determineImageError = () => {
    if (newImage) {
      if (newImage.type.split('/')[0] !== 'image') {
        return 'Wrong format - images only (jpg, png, gif, etc.)';
      }
      if (newImage.size > 5000000) {
        return 'Image too large - 5MB maximum file size';
      }
    }
    return null;
  };

  const changeModel = (event) => {
    setError(null);
    setProductDetails({ ...productDetails, model: event.target.value });
    setValidModel(event.target.validity.valid);
  };

  const displayAccessories = () => {
    if (editing) {
      const productIds = Object.keys(allProducts);

      if (productIds.length && productIds.length > 1) {
        return productIds.map((prodId) => {
          if (prodId !== id) {
            return (
              <div className="category-choice" key={prodId}>
                <input
                  checked={productDetails.accessories.some(
                    (accessory) => accessory === prodId,
                  )}
                  id={`product${prodId}`}
                  onChange={changeAccessories}
                  type="checkbox"
                  value={prodId}
                />
                <label htmlFor={`product${prodId}`}>
                  {allProducts[prodId].model}
                </label>
              </div>
            );
          }
          return null;
        });
      }
      if (productIds.length <= 1) {
        return (
          <div className="error">No other products in catalog. Add some!</div>
        );
      }
      return null;
    }
    if (productDetails.accessories.length) {
      return (
        <div>
          <h4>Accessories / Related Products:</h4>
          <ul>
            {productDetails.accessories.map((accessory) => (
              <li key={accessory}>
                <Link to={`/dashboard/products/${accessory}`}>
                  {allProducts[accessory].model}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  const changeCategory = (event) => {
    setError(null);
    const categoryId = event.target.value;
    if (Object.keys(allCategories).includes(categoryId)) {
      setValidCategory(true);
    } else {
      setValidCategory(false);
    }
    setProductDetails({
      ...productDetails,
      category: categoryId,
      // need to reset features too
      features: [],
    });
  };

  const displayCategories = () => {
    if (editing) {
      const categoryIds = Object.keys(allCategories);

      if (categoryIds.length) {
        return (
          <label htmlFor="categories">
            Category (required)
            <select
              defaultValue={productDetails.category}
              id="categories"
              name="categories"
              onChange={changeCategory}
            >
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
    }
    return (
      <div>
        <Link to={`/dashboard/categories/${productDetails.category}`}>
          {allCategories[productDetails.category].name}
        </Link>
      </div>
    );
  };

  const changeFeatures = (event) => {
    const { checked } = event.target;
    const { featureid } = event.target.dataset;
    const productFeatures = [...productDetails.features];
    if (checked && !productFeatures.includes(featureid)) {
      productFeatures.push(featureid);
    } else if (productFeatures.includes(featureid)) {
      productFeatures.splice(productFeatures.indexOf(featureid), 1);
    }
    setProductDetails({ ...productDetails, features: productFeatures });
  };

  const displayFeatures = () => {
    const categoryId = productDetails.category;
    if (editing) {
      const featureIds = Object.keys(
        allCategories[productDetails.category].features,
      );
      featureIds.sort((a, b) => {
        const featureA = allCategories[productDetails.category].features[a];
        const featureB = allCategories[productDetails.category].features[b];
        return featureA.localeCompare(featureB, 'en-us', { numeric: true });
      });
      return (
        <div className="feature-inputs">
          {featureIds.map((featureId) => (
            <div className="feature-choice" key={featureId}>
              <input
                checked={productDetails.features.includes(featureId)}
                data-featureid={featureId}
                id={featureId}
                onChange={changeFeatures}
                type="checkbox"
                value={featureId}
              />
              <label htmlFor={featureId}>
                {allCategories[productDetails.category].features[featureId]}
              </label>
            </div>
          ))}
        </div>
      );
    }
    if (productDetails.features.length) {
      return (
        <div>
          <h4>Features / Filters:</h4>
          <ul className="product-features">
            {productDetails.features.map((key) => (
              <li key={key}>{allCategories[categoryId].features[key]}</li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  const displayDetails = () => {
    if (loading) {
      return <div>Loading...</div>;
    }
    if (productDetails) {
      return (
        <div className="product-detail">
          <div className="detail-heading">
            <div>
              <h3>{productDetails.model}</h3>
              {displayCategories()}
            </div>
            {productDetails.ndaa ? (
              <img alt="NDAA Compliant" className="ndaa-icon" src={ndaaIcon} />
            ) : null}
          </div>

          <div hidden={!placeholder} className="image-placeholder" />
          <img
            alt={productDetails.model}
            className="product-image"
            hidden={placeholder}
            onLoad={() => {
              setPlaceholder(false);
            }}
            src={productDetails.image}
          />

          {displayFeatures()}

          <div>
            <h4>Description:</h4>
            <pre>{productDetails.description}</pre>
          </div>

          <div>
            <h4>Specifications:</h4>
            <pre>{productDetails.specs}</pre>
          </div>

          {productDetails.accessories.length ? displayAccessories() : null}

          <Link
            className="edit-button"
            onClick={() => {
              setEditing(true);
            }}
            to={`/dashboard/products/${id}/edit`}
          >
            Edit
          </Link>

          <Link to="/dashboard/products/">Back to products list</Link>
        </div>
      );
    }
    return null;
  };

  const submit = async () => {
    setAttempted(true);
    setLoading(true);
    if (validDescription && validCategory && validImage && validModel) {
      try {
        const updatedProduct = {
          accessories: productDetails.accessories,
          category: productDetails.category,
          description: productDetails.description,
          features: productDetails.features,
          ndaa: productDetails.ndaa,
          model: productDetails.model,
          specs: productDetails.specs,
        };

        // first update the image (if there's a new one)
        if (newImage) {
          await deleteOldImage(productDetails.imageRef);
          await addProductImage(id, newImage);
        }

        // then update the rest of the product info
        await updateProduct(id, updatedProduct);

        // add the product to any new accessories
        await updateProductAccessories(id);

        // remove the product from any accessories that we've removed
        const noMoreAccessory = [];
        originalAccessories.forEach((accessory) => {
          if (!updatedProduct.accessories.includes(accessory)) {
            noMoreAccessory.push(accessory);
          }
        });
        await removeProductFromAccessories(id, noMoreAccessory);

        // finally redirect to the new product details page
        navigate(`/dashboard/products/${id}`);
        setEditing(false);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error(err);
        setError(err.message);
      }
    } else {
      setError('Something went wrong - check each input');
    }
    setLoading(false);
  };

  const toggleDelete = () => {
    setConfirmingDelete(!confirmingDelete);
  };

  const deleteProduct = async () => {
    setLoading(true);
    try {
      await deleteSingleProduct(
        id,
        productDetails.imageRef,
        productDetails.accessories,
      );
      navigate(`/dashboard/products/${id}/deleted`);
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
          Delete Product
        </button>
      );
    }
    return (
      <>
        <div className="error">
          Are you sure you want to delete
          {' '}
          {productDetails.model}
          ? This cannot be
          undone!
        </div>
        <button onClick={toggleDelete} type="button">
          Cancel
        </button>
        <button className="error" onClick={deleteProduct} type="button">
          Confirm Delete
        </button>
      </>
    );
  };

  const dropFile = (event) => {
    setError(null);
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      if (file.type.split('/')[0] !== 'image' || file.size > 5000000) {
        setValidImage(false);
      } else {
        setValidImage(true);
      }
    } else {
      setValidImage(true);
    }
    setNewImage(file);
  };

  const changeSpecs = (event) => {
    setError(null);
    setProductDetails({ ...productDetails, specs: event.target.value });
  };

  const changeNDAA = (event) => {
    setProductDetails({ ...productDetails, ndaa: event.target.checked });
  };

  const displayForm = () => {
    if (loading) {
      return <div>Loading...</div>;
    }
    if (productDetails) {
      return (
        <form className="product-detail">
          <div>{displayCategories()}</div>

          <label htmlFor="name">
            Model (required)
            <input
              id="name"
              onChange={changeModel}
              required
              placeholder="Model number / name"
              type="text"
              value={productDetails.model || ''}
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
              value={productDetails.description || ''}
            />
            {attempted && !validDescription ? (
              <div className="error">Description required</div>
            ) : null}
          </label>

          <label htmlFor="description">
            Specifications
            <textarea
              id="specs"
              onChange={changeSpecs}
              placeholder="Enter the product specifications"
              required
              rows="5"
              value={productDetails.specs || ''}
            />
          </label>

          <div className="category-choice">
            <input
              checked={productDetails.ndaa}
              id="ndaa"
              onChange={changeNDAA}
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
              className="drop-file"
              onDragOver={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              onDrop={dropFile}
            >
              <img
                alt={productDetails.model}
                className="image-preview"
                src={
                  newImage
                    ? URL.createObjectURL(newImage)
                    : productDetails.image
                }
              />
            </div>
            <div>{newImage ? newImage.name : 'using original image'}</div>
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
              Change Image
            </button>
            <button
              onClick={() => {
                setNewImage(null);
                setValidImage(true);
              }}
              type="button"
            >
              Use Original Image
            </button>
            {attempted && !validImage ? (
              <div className="error">{determineImageError()}</div>
            ) : null}
          </label>

          <fieldset>
            <legend>Accessories / related products</legend>
            {displayAccessories()}
          </fieldset>

          <button className="submit" onClick={submit} type="button">
            Submit
          </button>
          {error ? <div className="error">{error}</div> : null}
          {deleteSection()}
          <Link
            onClick={() => {
              setEditing(false);
            }}
            to={`/dashboard/products/${id}`}
          >
            Cancel edit
          </Link>
        </form>
      );
    }
    return null;
  };

  useEffect(() => {
    if (!deleted) {
      const details = { ...allProducts[id] };
      if (editing) {
        // keep track of the product's pre-edit accessories, so we can remove
        // any reference to this product for any removed accessories
        setOriginalAccessories([...details.accessories]);
      }
      setProductDetails(details);
    }
  }, [editing, id]);

  if (deleted) {
    return (
      <>
        <h2>Product Deleted</h2>
        <div className="product-detail">
          <div>Delete successful.</div>
          <Link to="/dashboard/products">Return to products list</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <h2>{editing ? 'Edit Product' : 'Product Detail'}</h2>
      {editing ? displayForm() : displayDetails()}
    </>
  );
}

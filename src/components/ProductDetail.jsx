import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import {
  addProductImage,
  deleteOldImage,
  deleteSingleProduct,
  getAllCategories,
  getAllProductAccessories,
  getAllProductCategories,
  getAllProducts,
  getSingleProduct,
  removeProductFromAccessories,
  updateProduct,
  updateProductAccessories,
} from '../util/database';

export default function ProductDetail({ deleted, editing }) {
  const fileInputRef = useRef(null);

  const { id } = useParams();

  const navigate = useNavigate();

  const [attempted, setAttempted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newImage, setNewImage] = useState(null);
  const [originalAccessories, setOriginalAccessories] = useState([]);
  const [placeholder, setPlaceholder] = useState(true);
  const [productDetails, setProductDetails] = useState(null);
  const [products, setProducts] = useState([]);
  const [validCategories, setValidCategories] = useState(true);
  const [validDescription, setValidDescription] = useState(true);
  const [validFeatures, setValidFeatures] = useState(true);
  const [validImage, setValidImage] = useState(true);
  const [validModel, setValidModel] = useState(true);

  const addNewFeature = () => {
    const featuresCopy = { ...productDetails.features };
    const newId = uuid();
    featuresCopy[newId] = '';
    setProductDetails({ ...productDetails, features: featuresCopy });
    setValidFeatures(false);
  };

  const changeAccessories = (event) => {
    const { productid } = event.target.dataset;
    const { checked } = event.target;
    const newProducts = [...products];
    const product = newProducts.find((item) => item.id === productid);
    const newProductAccessories = [...productDetails.accessories];
    if (checked) {
      product.include = true;
      newProductAccessories.push({ id: productid });
    } else {
      product.include = false;
      newProductAccessories.splice(newProductAccessories.indexOf(product), 1);
    }
    setProductDetails({
      ...productDetails,
      accessories: newProductAccessories,
    });
    setProducts(newProducts);
  };

  const changeCategories = (event) => {
    const { categoryid } = event.target.dataset;
    const { checked } = event.target;
    const newCategories = [...categories];
    const category = newCategories.find((item) => item.id === categoryid);
    const newProductCategories = [...productDetails.categories];
    if (checked) {
      category.include = true;
      newProductCategories.push({ id: categoryid });
    } else {
      category.include = false;
      newProductCategories.splice(newProductCategories.indexOf(category), 1);
    }
    setProductDetails({ ...productDetails, categories: newProductCategories });
    setCategories(newCategories);
    setValidCategories(newProductCategories.length);
  };

  const changeDescription = (event) => {
    setError(null);
    setProductDetails({ ...productDetails, description: event.target.value });
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
    setError(null);
    const featuresCopy = { ...productDetails.features };
    featuresCopy[event.target.dataset.featureid] = event.target.value;
    setProductDetails({ ...productDetails, features: featuresCopy });
    setValidFeatures(checkValidFeatures(featuresCopy));
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

  const changeInStock = (event) => {
    setProductDetails({ ...productDetails, inStock: event.target.checked });
  };

  const changeModel = (event) => {
    setError(null);
    setProductDetails({ ...productDetails, model: event.target.value });
    setValidModel(event.target.validity.valid);
  };

  const deleteFeature = (event) => {
    setError(null);
    const featuresCopy = { ...productDetails.features };
    delete featuresCopy[event.target.dataset.featureid];
    setProductDetails({ ...productDetails, features: featuresCopy });
    setValidFeatures(checkValidFeatures(featuresCopy));
  };

  const displayAccessories = () => {
    if (editing) {
      return products.map((product) => {
        if (product.id !== id) {
          return (
            <div className="category-choice" key={product.id}>
              <input
                checked={product.include}
                data-productid={product.id}
                id={`product${product.id}`}
                onChange={changeAccessories}
                type="checkbox"
              />
              <label htmlFor={`product${product.id}`}>{product.model}</label>
            </div>
          );
        }
        return null;
      });
    }
    return (
      <div>
        <h4>Accessories / Related Products:</h4>
        <ul>
          {productDetails.accessories.map((accessory) => (
            <li key={accessory.id}>
              <Link to={`/dashboard/products/${accessory.id}`}>
                {accessory.model}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const displayCategories = () => {
    if (editing) {
      return categories.map((category) => (
        <div className="category-choice" key={category.id}>
          <input
            checked={category.include}
            data-categoryid={category.id}
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
        <h4>Categories:</h4>
        <ul>
          {productDetails.categories.map((category) => (
            <li key={category.id}>
              <Link to={`/dashboard/categories/${category.id}`}>
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const displayFeatures = () => {
    const keys = Object.keys(productDetails.features);
    if (keys.length) {
      if (editing) {
        return (
          <div className="feature-inputs">
            {keys.map((featureId) => (
              <div key={featureId}>
                <input
                  data-featureid={featureId}
                  onChange={changeFeature}
                  type="text"
                  value={productDetails.features[featureId] || ''}
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
      return (
        <div>
          <h4>Features:</h4>
          <ul>
            {keys.map((key) => (
              <li key={key}>{productDetails.features[key]}</li>
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
          <h3>{productDetails.model}</h3>
          <div className={productDetails.inStock ? 'in-stock' : 'out-of-stock'}>
            {productDetails.inStock ? '✓ In stock' : '⚠ Out of stock'}
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
          <div>{productDetails.description}</div>
          {displayFeatures()}
          {displayCategories()}
          {displayAccessories()}
          <Link className="edit-button" to={`/dashboard/products/${id}/edit`}>
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
    if (
      validCategories
      && validDescription
      && validFeatures
      && validImage
      && validModel
    ) {
      setLoading(true);
      try {
        // just need the ids
        const cleanedAccessories = [];
        productDetails.accessories.forEach((accessory) => {
          cleanedAccessories.push(accessory.id);
        });

        // just need the ids
        const cleanedCategories = [];
        productDetails.categories.forEach((category) => {
          cleanedCategories.push(category.id);
        });

        const updatedProduct = {
          accessories: cleanedAccessories,
          categories: cleanedCategories,
          description: productDetails.description,
          features: productDetails.features,
          inStock: productDetails.inStock,
          model: productDetails.model,
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
      } catch (err) {
        setLoading(false);
        console.error(err);
        setError(err.message);
      }
    } else {
      setError('Something went wrong - check each input');
    }
  };

  const toggleDelete = () => {
    setConfirmingDelete(!confirmingDelete);
  };

  const deleteProduct = async () => {
    setLoading(true);
    try {
      const cleanedAccessories = [];
      productDetails.accessories.forEach((accessory) => {
        cleanedAccessories.push(accessory.id);
      });
      await deleteSingleProduct(
        id,
        productDetails.imageRef,
        cleanedAccessories,
      );
      navigate(`/dashboard/products/${id}/deleted`);
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

  const displayForm = () => {
    if (loading) {
      return <div>Loading...</div>;
    }
    if (productDetails) {
      return (
        <form className="product-detail">
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

          <div className="category-choice">
            <input
              checked={productDetails.inStock}
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
            <button onClick={addNewFeature} type="button">
              + add feature
            </button>
            {attempted && !validFeatures ? (
              <div className="error">No empty features</div>
            ) : null}
          </fieldset>

          <label htmlFor="image">
            Image (required)
            <img
              alt={productDetails.model}
              className="image-preview"
              src={
                newImage ? URL.createObjectURL(newImage) : productDetails.image
              }
            />
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
            <legend>Select categories (at least 1 required)</legend>
            {displayCategories()}
            {attempted && !validCategories ? (
              <div className="error">At least 1 category required</div>
            ) : null}
          </fieldset>

          <fieldset>
            <legend>Accessories / related products</legend>
            {displayAccessories()}
          </fieldset>

          <button className="submit" onClick={submit} type="button">
            Submit
          </button>
          {error ? <div className="error">{error}</div> : null}
          {deleteSection()}
          <Link to={`/dashboard/products/${id}`}>Back to details</Link>
        </form>
      );
    }
    return null;
  };

  useEffect(() => {
    const getDetails = async () => {
      setLoading(true);
      try {
        const details = await getSingleProduct(id);
        details.categories = await getAllProductCategories(details.categories);
        details.accessories = await getAllProductAccessories(
          details.accessories,
        );
        if (editing) {
          // keep track of the product's pre-edit accessories, so we can remove
          // any reference to this product for any removed accessories
          const originalIds = [];
          details.accessories.forEach((accessory) => {
            originalIds.push(accessory.id);
          });
          setOriginalAccessories(originalIds);
          // add "include" to those categories that the product belongs to
          const allCategories = await getAllCategories();
          allCategories.forEach((category) => {
            if (details.categories.some((item) => item.id === category.id)) {
              // eslint-disable-next-line
              category.include = true;
            } else {
              // eslint-disable-next-line
              category.include = false;
            }
          });
          setCategories(allCategories);
          // get all products so we can add / remove accessories
          const allProducts = await getAllProducts();
          allProducts.forEach((product) => {
            if (details.accessories.some((item) => item.id === product.id)) {
              // eslint-disable-next-line
              product.include = true;
            } else {
              // eslint-disable-next-line
              product.include = false;
            }
          });
          setProducts(allProducts);
        }
        setProductDetails(details);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
      setLoading(false);
    };
    if (!deleted) {
      getDetails();
    }
  }, [editing, id]);

  if (deleted) {
    return (
      <>
        <h2>Product Deleted</h2>
        <div>Delete successful.</div>
        <Link to="/dashboard/products">Return to products list</Link>
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

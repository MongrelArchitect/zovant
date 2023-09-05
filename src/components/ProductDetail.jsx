import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import {
  addProductImage,
  getAllCategories,
  getAllProductAccessories,
  getAllProductCategories,
  getAllProducts,
  getSingleProduct,
  removeProductFromAccessories,
  updateProduct,
} from '../util/database';

export default function ProductDetail({ editing }) {
  const fileInputRef = useRef(null);

  const { id } = useParams();

  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [originalAccessories, setOriginalAccessories] = useState([]);
  const [productDetails, setProductDetails] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const addNewFeature = () => {
    const featuresCopy = { ...productDetails.features };
    const newId = uuid();
    featuresCopy[newId] = '';
    setProductDetails({ ...productDetails, features: featuresCopy });
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
  };

  const changeDescription = (event) => {
    setProductDetails({ ...productDetails, description: event.target.value });
  };

  const changeFeature = (event) => {
    const featuresCopy = { ...productDetails.features };
    featuresCopy[event.target.dataset.featureid] = event.target.value;
    setProductDetails({ ...productDetails, features: featuresCopy });
  };

  const changeImage = (event) => {
    const file = event.target.files[0];
    setNewImage(file);
  };

  const changeInStock = (event) => {
    setProductDetails({ ...productDetails, inStock: event.target.checked });
  };

  const changeModel = (event) => {
    setProductDetails({ ...productDetails, model: event.target.value });
  };

  const deleteFeature = (event) => {
    const featuresCopy = { ...productDetails.features };
    delete featuresCopy[event.target.dataset.featureid];
    setProductDetails({ ...productDetails, features: featuresCopy });
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
        <h3>Accessories / Related Products:</h3>
        <ul>
          {productDetails.accessories.map((accessory) => (
            <li key={accessory.id}>{accessory.model}</li>
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
        <h3>Categories:</h3>
        <ul>
          {productDetails.categories.map((category) => (
            <li key={category.id}>{category.name}</li>
          ))}
        </ul>
      </div>
    );
  };

  const displayFeatures = () => {
    const keys = Object.keys(productDetails.features);
    if (keys.length) {
      if (editing) {
        return keys.map((featureId) => (
          <div key={featureId}>
            <input
              data-featureid={featureId}
              onChange={changeFeature}
              type="text"
              value={productDetails.features[featureId] || ''}
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
      return (
        <div>
          <h3>Features:</h3>
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
        <>
          <div>{productDetails.model}</div>
          <div>{productDetails.inStock ? 'In stock' : 'Out of stock'}</div>
          <img
            alt={productDetails.model}
            className="product-image"
            src={productDetails.image}
          />
          <div>{productDetails.description}</div>
          {displayFeatures()}
          {displayCategories()}
          {displayAccessories()}
          <Link to={`/dashboard/products/${id}/edit`}>Edit</Link>
          <Link to="/dashboard/products/">Back to products list</Link>
        </>
      );
    }
    return null;
  };

  const submit = async () => {
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
        await addProductImage(id, newImage);
      }

      // then update the rest of the product info
      await updateProduct(id, updatedProduct);

      // now we need to remove any reference to this product from any other
      // products that have it in their 'accessories' array
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
  };

  const displayForm = () => {
    if (loading) {
      return <div>Loading...</div>;
    }
    if (productDetails) {
      return (
        <form>
          <label htmlFor="name">
            Model (required)
            <input
              id="name"
              onChange={changeModel}
              placeholder="Model number / name"
              type="text"
              value={productDetails.model || ''}
            />
          </label>

          <label htmlFor="description">
            Description (required)
            <textarea
              id="description"
              onChange={changeDescription}
              placeholder="Provide a brief description of the product"
              rows="5"
              value={productDetails.description || ''}
            />
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
              }}
              type="button"
            >
              Use Original Image
            </button>
          </label>

          <fieldset>
            <legend>Select categories (at least 1 required)</legend>
            {displayCategories()}
          </fieldset>

          <fieldset>
            <legend>Accessories / related products</legend>
            {displayAccessories()}
          </fieldset>

          <button onClick={submit} type="button">
            Submit
          </button>
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
    getDetails();
  }, [editing]);

  return (
    <>
      <h2>{editing ? 'Edit Product' : 'Product Detail'}</h2>
      {editing ? displayForm() : displayDetails()}
      {error ? <div className="error">{error}</div> : null}
    </>
  );
}

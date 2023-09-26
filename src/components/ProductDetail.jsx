import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import {
  addProductDownloads,
  addProductImage,
  deleteDownloadsFromStorage,
  deleteOldImage,
  deleteSingleProduct,
  removeDownloadsFromProduct,
  removeProductFromAccessories,
  updateDownloadDescriptions,
  updateProduct,
  updateProductAccessories,
} from '../util/database';

import ndaaIcon from '../assets/images/ndaa.png';
import dropFileIcon from '../assets/images/drop-file.svg';
import fileIcon from '../assets/images/file-added.svg';

export default function ProductDetail({ allCategories, allProducts }) {
  const fileInputRef = useRef(null);

  const { id } = useParams();

  const navigate = useNavigate();

  const [attempted, setAttempted] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [downloadsToDelete, setDownloadsToDelete] = useState([]);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [originalAccessories, setOriginalAccessories] = useState([]);
  const [placeholder, setPlaceholder] = useState(true);
  const [productDetails, setProductDetails] = useState(null);
  const [validCategory, setValidCategory] = useState(true);
  const [validDescription, setValidDescription] = useState(true);
  const [validDownloads, setValidDownloads] = useState(true);
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
      productIds.sort((a, b) => {
        const modelA = allProducts[a].model;
        const modelB = allProducts[b].model;

        if (modelA < modelB) {
          return -1;
        }
        if (modelA > modelB) {
          return 1;
        }
        return 0;
      });

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

  const formatSize = (size) => {
    let suffix = 'bytes';
    let newSize = size;
    if (size >= 1000 && size < 1000000) {
      suffix = 'KB';
      newSize = Math.floor(size / 1000);
    }
    if (size >= 1000000 && size < 1000000000) {
      suffix = 'MB';
      newSize = Math.floor(size / 1000000);
    }
    if (size >= 1000000000) {
      newSize = 'WAY';
      suffix = 'TOO BIG!';
    }
    return `${newSize} ${suffix}`;
  };

  const checkValidDownloads = (downloadsCopy) => {
    // XXX
    // FIXME
    const downloadIds = Object.keys(downloadsCopy);
    // no downloads, so we're valid
    if (!downloadIds.length) {
      return true;
    }
    const valid = !downloadIds.some((downloadId) => {
      if (downloadsCopy[downloadId].file) {
        if (downloadsCopy[downloadId].file.size <= 5000000) {
          // we have a file and it's no more than 5MB, so we're good
          return false;
        }
        // the file we have is too big (5MB max)
        return true;
      }
      if (downloadsCopy[downloadId].fileName) {
        // will only have "fileName" w/o "file" if it's from original downloads
        return false;
      }
      // no file (new one) or fileName (old one), so we're invalid
      return true;
    });
    return valid;
  };

  const changeDownloadDescription = (event) => {
    const { downloadid } = event.target.dataset;
    const downloadsCopy = { ...productDetails.downloads };
    downloadsCopy[downloadid].description = event.target.value;
    if (downloadsCopy[downloadid].original) {
      // we're modifying one of our original downloads - keep track of it
      downloadsCopy[downloadid].modified = 'description';
    }
    setProductDetails({ ...productDetails, downloads: downloadsCopy });
  };

  const changeDownloads = (event) => {
    const { downloadid } = event.target.dataset;
    const downloadsCopy = { ...productDetails.downloads };
    const newFile = event.target.files[0];
    if (downloadsCopy[downloadid].original) {
      // we're modifying one of our original downloads - keep track of it
      downloadsCopy[downloadid].modified = 'file';
      // we'll also need to delete the original file from cloud storage
      const deleteCopy = [...downloadsToDelete];
      deleteCopy.push(downloadid);
      setDownloadsToDelete(deleteCopy);
    }
    if (newFile) {
      downloadsCopy[downloadid].file = newFile;
      downloadsCopy[downloadid].fileName = newFile.name;
      downloadsCopy[downloadid].size = newFile.size;
    } else {
      downloadsCopy[downloadid].file = null;
      downloadsCopy[downloadid].fileName = null;
      downloadsCopy[downloadid].size = null;
    }
    setValidDownloads(checkValidDownloads(downloadsCopy));
    setProductDetails({ ...productDetails, downloads: downloadsCopy });
  };

  const deleteDownload = (event) => {
    const { downloadid } = event.target.dataset;
    const downloadsCopy = { ...productDetails.downloads };
    if (downloadsCopy[downloadid].original) {
      // track the ones we've removed for eventual delete from storage
      const deleteCopy = [...downloadsToDelete];
      deleteCopy.push(downloadid);
      setDownloadsToDelete(deleteCopy);
    }
    delete downloadsCopy[downloadid];
    setValidDownloads(checkValidDownloads(downloadsCopy));
    setProductDetails({ ...productDetails, downloads: downloadsCopy });
  };

  const displayDownloadInfo = (download) => (
    <span>
      {`${download.description ? download.description : download.fileName}: `}
      <a download href={download.downloadURL} title={download.fileName}>
        {`${download.fileName} (${formatSize(download.size)})`}
      </a>
    </span>
  );

  const dropDownloadFile = (event) => {
    event.preventDefault();
    const { downloadid } = event.target.dataset;
    const downloadsCopy = { ...productDetails.downloads };
    const file = event.dataTransfer.files[0];
    if (downloadsCopy[downloadid].original) {
      // we're modifying one of our original downloads - keep track of it
      downloadsCopy[downloadid].modified = 'file';
      // we'll also need to delete the original file from cloud storage
      const deleteCopy = [...downloadsToDelete];
      deleteCopy.push(downloadid);
      setDownloadsToDelete(deleteCopy);
    }
    if (file) {
      downloadsCopy[downloadid].file = file;
      downloadsCopy[downloadid].fileName = file.name;
      downloadsCopy[downloadid].size = file.size;
    } else {
      downloadsCopy[downloadid].file = null;
      downloadsCopy[downloadid].fileName = null;
      downloadsCopy[downloadid].size = null;
    }
    setValidDownloads(checkValidDownloads(downloadsCopy));
    setProductDetails({ ...productDetails, downloads: downloadsCopy });
  };

  const newDownload = () => {
    setValidDownloads(false);
    const downloadsCopy = { ...productDetails.downloads };
    const downloadId = uuid();
    downloadsCopy[downloadId] = { file: null, description: '' };
    setValidDownloads(checkValidDownloads(downloadsCopy));
    setProductDetails({ ...productDetails, downloads: downloadsCopy });
  };

  const displayDownloads = () => {
    const productDownloads = productDetails.downloads;
    const downloadIds = Object.keys(productDownloads);
    if (editing) {
      if (downloadIds.length) {
        return (
          <div className="feature-inputs">
            {downloadIds.map((downloadId) => (
              <label
                className="image-label"
                htmlFor={downloadId}
                key={downloadId}
              >
                File
                <div
                  className={
                    productDownloads[downloadId].fileName
                      ? 'drop-file download-added'
                      : 'drop-file empty'
                  }
                  data-downloadid={downloadId}
                  onDragOver={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onDrop={dropDownloadFile}
                >
                  {productDownloads[downloadId].fileName ? (
                    <>
                      <img
                        alt=""
                        className="file-added"
                        data-downloadid={downloadId}
                        src={fileIcon}
                      />
                      <div data-downloadid={downloadId}>
                        {productDownloads[downloadId].fileName}
                      </div>
                      <div data-downloadid={downloadId}>
                        {formatSize(productDownloads[downloadId].size)}
                      </div>
                    </>
                  ) : (
                    <>
                      <img
                        alt=""
                        className="drop-image"
                        data-downloadid={downloadId}
                        src={dropFileIcon}
                      />
                      <div data-downloadid={downloadId}>Drop file here</div>
                    </>
                  )}
                </div>
                <input
                  accept="*/*"
                  data-downloadid={downloadId}
                  hidden
                  id={downloadId}
                  onChange={changeDownloads}
                  type="file"
                />
                <div>
                  <span className="edit-button">Upload File</span>
                  <button
                    className="error"
                    data-downloadid={downloadId}
                    onClick={deleteDownload}
                    type="button"
                  >
                    X
                  </button>
                </div>
                <label htmlFor={`desc-${downloadId}`}>
                  File Description
                  <input
                    data-downloadid={downloadId}
                    id={`desc-${downloadId}`}
                    onChange={changeDownloadDescription}
                    placeholder="Manual, software, etc."
                    type="text"
                    value={productDownloads[downloadId].description || ''}
                  />
                </label>
              </label>
            ))}
          </div>
        );
      }
      return null;
    }
    return (
      <fieldset>
        <legend>
          <h4>Downloads</h4>
        </legend>
        <ul>
          {downloadIds.map((downloadId) => (
            <li key={downloadId}>
              {displayDownloadInfo(productDownloads[downloadId])}
            </li>
          ))}
        </ul>
      </fieldset>
    );
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

          {Object.keys(productDetails.downloads).length
            ? displayDownloads()
            : null}

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

  const getNewDownloads = () => {
    // new files to upload (either new downloads or modified originals)
    const downloadIds = Object.keys(productDetails.downloads);
    const newDownloads = {};
    downloadIds.forEach((downloadId) => {
      if (productDetails.downloads[downloadId].file) {
        newDownloads[downloadId] = {
          description: productDetails.downloads[downloadId].description,
          file: productDetails.downloads[downloadId].file,
        };
      }
    });
    return newDownloads;
  };

  const getModifiedDescriptions = () => {
    // original downloads whose descriptions have been modified
    const downloadIds = Object.keys(productDetails.downloads);
    const modifiedDescriptions = {};
    downloadIds.forEach((downloadId) => {
      const currentDownload = productDetails.downloads[downloadId];
      if (
        currentDownload.original
        && currentDownload.modified
        && currentDownload.modified === 'description'
      ) {
        modifiedDescriptions[downloadId] = currentDownload;
      }
    });
    return modifiedDescriptions;
  };

  const submit = async () => {
    setAttempted(true);
    setLoading(true);
    if (
      validDescription
      && validDownloads
      && validCategory
      && validImage
      && validModel
    ) {
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

        // delete any removed download files & update product accordingly
        if (downloadsToDelete.length) {
          const deleteThese = {};
          downloadsToDelete.forEach((downloadId) => {
            deleteThese[downloadId] = allProducts[id].downloads[downloadId].fileRef;
          });
          await removeDownloadsFromProduct(id, deleteThese);
          await deleteDownloadsFromStorage(deleteThese);
        }

        // upload any new download files
        const newDownloads = getNewDownloads();
        if (Object.keys(newDownloads).length) {
          await addProductDownloads(id, newDownloads);
        }

        // update any original downloads whose descriptions have changed
        const modifiedDescriptions = getModifiedDescriptions();
        if (Object.keys(modifiedDescriptions).length) {
          await updateDownloadDescriptions(id, modifiedDescriptions);
        }

        // finally redirect to the new product details page
        setEditing(false);
        setLoading(false);
        navigate(`/dashboard/products/${id}`);
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
      const productDownloads = Object.keys(productDetails.downloads);
      if (productDownloads.length) {
        const deleteThese = {};
        productDownloads.forEach((downloadId) => {
          deleteThese[downloadId] = productDetails
            .downloads[downloadId].fileRef;
        });
        await deleteDownloadsFromStorage(deleteThese);
      }
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
          {`Are you sure you want to delete ${productDetails.model}? `}
          {Object.keys(productDetails.downloads).length
            ? 'All download files will also be deleted. '
            : null}
          This cannot be undone!
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

          <fieldset>
            <legend>Downloads (documents, firmware, etc)</legend>
            {displayDownloads()}
            {attempted && !validDownloads ? (
              <div className="error">
                Check all downloads - each one needs a file (5MB max)
              </div>
            ) : null}
            <button onClick={newDownload} type="button">
              + add download
            </button>
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
    setError(null);
    setAttempted(false);
    setDownloadsToDelete([]);
    setOriginalAccessories([]);
    if (!deleted) {
      const details = { ...allProducts[id] };
      if (editing) {
        // keep track of the product's pre-edit accessories, so we can remove
        // any reference to this product for any removed accessories
        setOriginalAccessories([...details.accessories]);
        // also need to keep track of original "downloads" so if files are
        // changed we can delete the old ones
        Object.keys(details.downloads).forEach((downloadId) => {
          details.downloads[downloadId].original = true;
        });
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

import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import readXlsxFile from 'read-excel-file';
import { v4 as uuid } from 'uuid';

import {
  addNewProduct,
  addProductDownloads,
  addProductImage,
  updateProductAccessories,
} from '../util/database';

import generateTable from '../util/specs';

import dropFileIcon from '../assets/images/drop-file.svg';
import dropImageIcon from '../assets/images/add-image.svg';
import fileIcon from '../assets/images/file-added.svg';

export default function NewProduct({ allCategories, allProducts }) {
  const fileInputRef = useRef(null);

  const [accessories, setAccessories] = useState([]);
  const [addingAccessories, setAddingAccessories] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [category, setCategory] = useState(null);
  const [description, setDescription] = useState('');
  const [downloads, setDownloads] = useState({});
  const [error, setError] = useState(null);
  const [excelFileName, setExcelFileName] = useState(null);
  const [features, setFeatures] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('');
  const [ndaa, setNdaa] = useState(true);
  const [specs, setSpecs] = useState('');
  const [specsExcel, setSpecsExcel] = useState(null);
  const [successId, setSuccessId] = useState('');
  const [validCategory, setValidCategory] = useState(false);
  const [validDescription, setValidDescription] = useState(false);
  const [validExcel, setValidExcel] = useState(true);
  const [validDownloads, setValidDownloads] = useState(true);
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
    setSpecsExcel(null);
    setValidExcel(true);
    setError(null);
    setSpecs(event.target.value);
  };

  const checkProductExists = (checkModel) => {
    const check = Object.values(checkModel);
    return check.some((product) => product.model === checkModel);
  };

  const displayAccessories = () => {
    const productIds = Object.keys(allProducts);
    if (productIds.length) {
      productIds.sort((a, b) => {
        const modelA = allProducts[a].model.toLowerCase();
        const modelB = allProducts[b].model.toLowerCase();
        if (modelA < modelB) {
          return -1;
        }
        if (modelA > modelB) {
          return 1;
        }
        return 0;
      });
    }

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

  const checkValidDownloads = (downloadsCopy) => {
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
      // no file, so we're invalid
      return true;
    });
    return valid;
  };

  const changeDownloads = (event) => {
    const { downloadid } = event.target.dataset;
    const downloadsCopy = { ...downloads };
    const newFile = event.target.files[0];
    if (newFile) {
      downloadsCopy[downloadid].file = newFile;
    } else {
      downloadsCopy[downloadid].file = null;
    }
    setValidDownloads(checkValidDownloads(downloadsCopy));
    setDownloads(downloadsCopy);
  };

  const changeDownloadDescription = (event) => {
    const { downloadid } = event.target.dataset;
    const downloadsCopy = { ...downloads };
    downloadsCopy[downloadid].description = event.target.value;
    setDownloads(downloadsCopy);
  };

  const deleteDownload = (event) => {
    const { downloadid } = event.target.dataset;
    const downloadsCopy = { ...downloads };
    delete downloadsCopy[downloadid];
    setValidDownloads(checkValidDownloads(downloadsCopy));
    setDownloads(downloadsCopy);
  };

  const dropDownloadFile = (event) => {
    event.preventDefault();
    const { downloadid } = event.target.dataset;
    const downloadsCopy = { ...downloads };
    const file = event.dataTransfer.files[0];
    if (file) {
      downloadsCopy[downloadid].file = file;
    } else {
      downloadsCopy[downloadid].file = null;
    }
    setValidDownloads(checkValidDownloads(downloadsCopy));
    setDownloads(downloadsCopy);
  };

  const newDownload = () => {
    setValidDownloads(false);
    const downloadsCopy = { ...downloads };
    const downloadId = uuid();
    downloadsCopy[downloadId] = { file: null, description: '' };
    setDownloads(downloadsCopy);
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

  const displayDownloads = () => {
    const downloadIds = Object.keys(downloads);
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
                  downloads[downloadId].file
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
                {downloads[downloadId].file ? (
                  <>
                    <img
                      alt=""
                      className="file-added"
                      data-downloadid={downloadId}
                      src={fileIcon}
                    />
                    <div data-downloadid={downloadId}>
                      {downloads[downloadId].file.name}
                    </div>
                    <div data-downloadid={downloadId}>
                      {formatSize(downloads[downloadId].file.size)}
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
                />
              </label>
            </label>
          ))}
        </div>
      );
    }
    return null;
  };

  const displayFeatures = () => {
    if (category) {
      const categoryFeatures = allCategories[category].features;
      const featureIds = Object.keys(categoryFeatures).sort((a, b) => {
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
                <label htmlFor={featureId}>{categoryFeatures[featureId]}</label>
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
    if (
      validCategory
      && validDescription
      && validDownloads
      && validExcel
      && validImage
      && validModel
    ) {
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
            // firebase won't accept nested arrays, so stringify it
            specsExcel: specsExcel ? JSON.stringify(specsExcel) : null,
          };
          // upload new product to database
          const product = await addNewProduct(newProduct);
          // upload image to storage and update product accordingly
          await addProductImage(product.id, image);
          // add product to "accessories" arrays of its own accessories
          await updateProductAccessories(product.id);
          // add any downloads (if we have them)
          if (Object.keys(downloads).length) {
            await addProductDownloads(product.id, downloads);
          } else {
            await addProductDownloads(product.id, {});
          }
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

  const changeSpecsExcel = async (event) => {
    setSpecs('');
    const file = event.target.files[0];
    if (file) {
      setExcelFileName(file.name);
      const extension = file.name.slice(file.name.lastIndexOf('.'));
      if (extension === '.xlsx' || extension === '.xls') {
        const rows = await readXlsxFile(file);
        setSpecsExcel(rows);
        setValidExcel(true);
      } else {
        // not an xlsx file, so can't use it
        setSpecsExcel(null);
        setValidExcel(false);
      }
    } else {
      // no file provided
      setSpecsExcel(null);
      setValidExcel(true);
      setExcelFileName(null);
    }
  };

  const dropExcel = async (event) => {
    event.preventDefault();
    setSpecs('');
    const file = event.dataTransfer.files[0];
    if (file) {
      setExcelFileName(file.name);
      const extension = file.name.slice(file.name.lastIndexOf('.'));
      if (extension === '.xlsx' || extension === '.xls') {
        const rows = await readXlsxFile(file);
        setSpecsExcel(rows);
        setValidExcel(true);
      } else {
        // not an xlsx file, so can't use it
        setSpecsExcel(null);
        setValidExcel(false);
      }
    } else {
      // no file provided
      setSpecsExcel(null);
      setValidExcel(true);
      setExcelFileName(null);
    }
  };

  const removeExcelFile = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setSpecsExcel(null);
    setValidExcel(true);
    setExcelFileName(null);
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

          {specsExcel ? (
            <>
              <div>Specifications</div>
              {generateTable(specsExcel)}
            </>
          ) : (
            <label htmlFor="specs">
              Specifications
              <textarea
                id="specs"
                onChange={changeSpecs}
                placeholder="Enter product specs manually here..."
                rows="5"
                value={specs || ''}
              />
            </label>
          )}

          <label className="image-label" htmlFor="specs-excel">
            {specsExcel
              ? 'Specs using excel file:'
              : '...or use an excel file (*.xls, *.xlsx)'}
            <div
              className={
                specsExcel ? 'drop-file download-added' : 'drop-file empty'
              }
              onDragOver={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              onDrop={dropExcel}
            >
              {specsExcel ? (
                <>
                  <img alt="" className="file-added" src={fileIcon} />
                  <div>{excelFileName}</div>
                </>
              ) : (
                <>
                  <img alt="" className="drop-image" src={dropFileIcon} />
                  <div>Drop excel file here</div>
                </>
              )}
            </div>
            <input
              hidden
              id="specs-excel"
              onChange={changeSpecsExcel}
              type="file"
            />
            <div>
              {!validExcel ? (
                <div className="error">
                  Wrong file type - excel only (*.xls or *.xlsx)
                </div>
              ) : null}
              {specsExcel ? (
                <span className="edit-button">Choose Excel File</span>
              ) : (
                <div className="edit-button">Choose Excel File</div>
              )}
              {specsExcel ? (
                <button
                  className="error"
                  onClick={removeExcelFile}
                  type="button"
                >
                  X
                </button>
              ) : null}
            </div>
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
                  <img alt="" className="drop-image" src={dropImageIcon} />
                  <div>Drop image here</div>
                </>
              )}
            </div>
            {image ? image.name : 'no image chosen'}
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
        </form>
      )}
    </>
  );
}

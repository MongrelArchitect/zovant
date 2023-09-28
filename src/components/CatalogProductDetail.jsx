import { useEffect, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';

import generateTable from '../util/specs';

import ndaaIcon from '../assets/images/ndaa.png';

export default function CatalogProductDetail({
  allCategories,
  allProducts,
  user,
}) {
  const { product } = useLoaderData();

  const [placeholder, setPlaceholder] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const displayAccessories = () => {
    if (product.accessories.length) {
      return (
        <div>
          <h4>Accessories / Related Products:</h4>
          <ul>
            {product.accessories.map((accessory) => (
              <li key={accessory}>
                <Link to={`/catalog/products/${accessory}`}>
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

  const displayFeatures = () => {
    const productCategory = allCategories[product.category];
    const categoryFeatures = productCategory.features;
    if (product.features.length) {
      return (
        <ul className="product-features">
          {product.features.map((key) => (
            <li key={key}>
              {categoryFeatures[key]}
              {product.features.indexOf(key) === product.features.length - 1
                ? null
                : ', '}
            </li>
          ))}
        </ul>
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

  const displayDownloadInfo = (download) => (
    <span>
      {`${download.description ? download.description : download.fileName}: `}
      <a download href={download.downloadURL} title={download.fileName}>
        {`${download.fileName} (${formatSize(download.size)})`}
      </a>
    </span>
  );

  const displayDownloads = () => {
    const downloadIds = Object.keys(product.downloads);
    if (downloadIds.length) {
      return (
        <fieldset>
          <legend>
            <h4>Downloads</h4>
          </legend>
          <ul>
            {downloadIds.map((downloadId) => (
              <li key={downloadId}>
                {displayDownloadInfo(product.downloads[downloadId])}
              </li>
            ))}
          </ul>
        </fieldset>
      );
    }
    return null;
  };

  return (
    <div id="catalog-detail" className="product-detail">
      <div className="detail-heading">
        <div>
          <h3>{product.model}</h3>
          <Link to={`/catalog/categories/${product.category}`}>
            {allCategories[product.category].name}
          </Link>
          {displayFeatures()}
          {user ? (
            <Link
              className="edit-button"
              to={`/dashboard/products/${product.id}/`}
            >
              View in dashboard
            </Link>
          ) : null}
        </div>
        {product.ndaa ? (
          <img alt="NDAA Compliant" className="ndaa-icon" src={ndaaIcon} />
        ) : null}
      </div>

      <div hidden={!placeholder} className="image-placeholder" />
      <img
        alt={product.model}
        className="catalog-detail-image product-image"
        hidden={placeholder}
        onLoad={() => {
          setPlaceholder(false);
        }}
        src={product.image}
      />

      <div>
        <h4>Description:</h4>
        <pre>{product.description}</pre>
      </div>

      {product.specs ? (
        <div>
          <h4>Specifications:</h4>
          <pre>{product.specs}</pre>
        </div>
      ) : null}

      {product.specsExcel ? (
        <>
          {generateTable(product.specsExcel)}
        </>
      ) : (
        null
      )}

      {displayAccessories()}

      {displayDownloads()}
    </div>
  );
}

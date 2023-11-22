import { useEffect, useState } from 'react';

import Banner from './Banner';

import openIcon from '../assets/images/open-in-new.svg';

export default function Support({ allProducts }) {
  const [productDownloads, setProductDownloads] = useState({});

  useEffect(() => {
    const productIds = Object.keys(allProducts);
    if (productIds.length) {
      const productsWithDownloads = {};
      productIds.forEach((productId) => {
        const downloadIds = Object.keys(allProducts[productId].downloads);
        if (downloadIds.length) {
          productsWithDownloads[productId] = {
            ...allProducts[productId].downloads,
          };
        }
      });
      setProductDownloads(productsWithDownloads);
    }
  }, []);

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

  const displayDownloads = (downloads) => {
    const downloadIds = Object.keys(downloads).sort((a, b) => {
      if (downloads[a].description < downloads[b].description) {
        return -1;
      }
      if (downloads[a].description > downloads[b].description) {
        return 1;
      }
      return 0;
    });

    return downloadIds.map((downloadId) => {
      const download = downloads[downloadId];
      return (
        <li className="flex flex-col align-start p8 ml16" key={downloadId}>
          {download.description ? download.description : download.fileName}
          <a
            className="flex align-center g8"
            target="_blank"
            href={download.downloadURL}
            rel="noreferrer"
          >
            {`(${download.fileName}) - ${formatSize(download.size)}`}
            <img alt="open in new tab" src={openIcon} />
          </a>
        </li>
      );
    });
  };

  const displayProductDownloads = () => {
    const productIds = Object.keys(productDownloads).sort((a, b) => {
      if (allProducts[a].model < allProducts[b].model) {
        return -1;
      }
      if (allProducts[a].model > allProducts[b].model) {
        return 1;
      }
      return 0;
    });

    if (productIds.length) {
      return (
        <ul className="support-list">
          {productIds.map((productId) => {
            const product = allProducts[productId];
            return (
              <li key={productId}>
                <div className="flex align-center justify-between p8">
                  {product.model}
                  <img
                    alt={product.model}
                    className="product-image-small"
                    src={product.image}
                  />
                </div>
                <ul className="downloads-list">
                  {displayDownloads(product.downloads)}
                </ul>
              </li>
            );
          })}
        </ul>
      );
    }
    return <div>No product-specific downloads available.</div>;
  };

  return (
    <div className="support">
      <div className="info">
        <Banner content="Support Center" />

        <article className="card">
          <div className="flex flex-col card-contents">
            <h1>General Downloads</h1>
            <div className="card-text">Some text here</div>
          </div>
        </article>

        <article className="card">
          <div className="flex flex-col card-contents">
            <h1>Product Specific Downloads</h1>
            <div>{displayProductDownloads()}</div>
          </div>
        </article>
      </div>
    </div>
  );
}

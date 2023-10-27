import { useState } from 'react';
import { addInfoImage, addNewBanner } from '../util/database';

import dropImageIcon from '../assets/images/add-image.svg';

export default function InfoControl({ user }) {
  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(null);
  const [image, setImage] = useState(null);
  const [newBannerContent, setNewBannerContent] = useState('');
  const [validBannerContent, setValidBannerContent] = useState(false);
  const [validImage, setValidImage] = useState(false);
  const [visibleForm, setVisibleForm] = useState(false);

  const changeBannerContent = (event) => {
    setError(null);
    setNewBannerContent(event.target.value);
    if (event.target.value.trim()) {
      setValidBannerContent(true);
    } else {
      setValidBannerContent(false);
    }
  };

  const closeForm = () => {
    setError(null);
    setNewBannerContent('');
    setImage(null);
    setForm(null);
    setVisibleForm(false);
    setAttempted(false);
  };

  const submitBanner = () => {
    setAttempted(true);
    if (validBannerContent) {
      try {
        addNewBanner(newBannerContent);
      } catch (err) {
        setError(err.message);
      }
      closeForm();
    }
  };

  const changeImage = (event) => {
    setError(null);
    const file = event.target.files[0];
    if (!file || file.type.split('/')[0] !== 'image' || file.size > 5000000) {
      setValidImage(false);
    } else {
      setValidImage(true);
    }
    setImage(file);
  };

  const dropImage = (event) => {
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

  const deleteImage = () => {
    setError(null);
    setValidImage(false);
    setImage(null);
  };

  const submitImage = () => {
    setAttempted(true);
    if (validImage) {
      try {
        addInfoImage(image);
      } catch (err) {
        setError(err.message);
      }
      closeForm();
    }
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

  const displayForm = () => {
    if (form === 'banner') {
      return (
        <div className="dashboard-detail">
          <form className="product-detail">
            <h2 className="info-form-header">New Banner</h2>
            <fieldset className="detail-form-item">
              <legend>Content (required)</legend>
              <label htmlFor="new-banner-content">
                <input
                  id="new-banner-content"
                  onChange={changeBannerContent}
                  required
                  type="text"
                  value={newBannerContent || ''}
                />
              </label>
              {attempted && !validBannerContent ? (
                <div className="error">Content Required</div>
              ) : null}
            </fieldset>
            {attempted && error ? <div className="error">{error}</div> : null}
            <div className="flex g16">
              <button onClick={submitBanner} className="submit" type="button">
                Submit
              </button>
              <button onClick={closeForm} type="button">
                Cancel
              </button>
            </div>
          </form>
        </div>
      );
    }

    if (form === 'image') {
      return (
        <div className="info-form-container dashboard-detail">
          <form className="product-detail">
            <h2 className="info-form-header">New Image</h2>
            <fieldset className="detail-form-item">
              <legend>Image (required)</legend>
              <label className="image-label" htmlFor="new-image">
                <div
                  className={image ? 'drop-file' : 'drop-file empty'}
                  onDragOver={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onDrop={dropImage}
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
                <input
                  accept="image/*"
                  hidden
                  id="new-image"
                  onChange={changeImage}
                  type="file"
                />
                {image ? (
                  <div>{`${image.name} - ${formatSize(image.size)}`}</div>
                ) : <div>No file chosen</div>}
                <div>
                  <span className="edit-button">Choose File</span>
                  <button className="error" onClick={deleteImage} type="button">
                    X
                  </button>
                </div>
                {attempted && !validImage ? (
                  <div className="error">Image required (5MB maximum)</div>
                ) : null}
              </label>
            </fieldset>
            {attempted && error ? <div className="error">{error}</div> : null}
            <div className="flex g16">
              <button onClick={submitImage} className="submit" type="button">
                Submit
              </button>
              <button onClick={closeForm} type="button">
                Cancel
              </button>
            </div>
          </form>
        </div>
      );
    }
    return null;
  };

  const newBanner = () => {
    setForm('banner');
    setVisibleForm(true);
  };

  const newImage = () => {
    setForm('image');
    setVisibleForm(true);
  };

  if (!user) {
    return null;
  }
  return (
    <div className="flex g16">
      <div className={visibleForm ? 'grayout' : 'hidden'}>{displayForm()}</div>
      <button type="button">+ NEW CARD</button>
      <button onClick={newImage} type="button">
        + NEW IMAGE
      </button>
      <button onClick={newBanner} type="button">
        + NEW BANNER
      </button>
    </div>
  );
}

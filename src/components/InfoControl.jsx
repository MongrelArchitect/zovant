import { useState } from 'react';
import { addNewBanner } from '../util/database';

export default function InfoControl({ user }) {
  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(null);
  const [newBannerContent, setNewBannerContent] = useState('');
  const [validBannerContent, setValidBannerContent] = useState(false);
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

  const displayForm = () => {
    if (form === 'banner') {
      return (
        <div className="dashboard-detail">
          <form className="product-detail">
            <h2 className="info-form-header">New Banner</h2>
            <fieldset className="detail-form-item">
              <legend>Content</legend>
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
            {attempted && error ? (
              <div className="error">{error}</div>
            ) : null}
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
    return null;
  };

  const newBanner = () => {
    setForm('banner');
    setVisibleForm(true);
  };

  if (!user) {
    return null;
  }
  return (
    <div className="flex g16">
      <div className={visibleForm ? 'grayout' : 'hidden'}>{displayForm()}</div>
      <button type="button">+ NEW CARD</button>
      <button type="button">+ NEW IMAGE</button>
      <button onClick={newBanner} type="button">
        + NEW BANNER
      </button>
    </div>
  );
}

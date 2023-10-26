import { useEffect, useState } from 'react';
import { deleteInfoItem } from '../util/database';

import pencilIcon from '../assets/images/pencil.svg';
import trashIcon from '../assets/images/trash.svg';

export default function InfoEdit({ bannerId, infoId, imageId }) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState(null);
  const [id, setId] = useState(null);
  const [infoType, setInfoType] = useState(null);

  const deleteItem = async () => {
    try {
      await deleteInfoItem(infoType, id);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleConfirm = () => {
    setConfirming(!confirming);
    setError(null);
  };

  useEffect(() => {
    if (bannerId) {
      setInfoType('banners');
      setId(bannerId);
    }
    if (infoId) {
      setInfoType('cards');
      setId(infoId);
    }
    if (imageId) {
      setInfoType('images');
      setId(imageId);
    }
  }, []);

  if (confirming) {
    return (
      <div className="info-edit-controls confirming">
        <div className="error-text">Are you sure? This cannot be undone!</div>
        <div className="flex g8">
          <button
            onClick={deleteItem}
            className="confirm delete-button"
            type="button"
          >
            CONFIRM DELETE
          </button>
          <button className="confirm" onClick={toggleConfirm} type="button">
            CANCEL
          </button>
        </div>
        {error ? <div className="error">{error}</div> : null}
      </div>
    );
  }

  return (
    <div className="info-edit-controls">
      <button type="button">
        <img alt="edit" title="edit" src={pencilIcon} />
      </button>
      <button className="delete-button" onClick={toggleConfirm} type="button">
        <img alt="delete" title="delete" src={trashIcon} />
      </button>
    </div>
  );
}

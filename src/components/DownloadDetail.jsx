import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { deleteGeneralDownload, updateGeneralDownload } from '../util/database';

export default function DownloadDetail({ generalDownloads }) {
  const { downloadId } = useParams();

  const currentDownload = generalDownloads[downloadId];

  const [attempted, setAttempted] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [description, setDescription] = useState(
    currentDownload ? currentDownload.description : '',
  );
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validDescrption, setValidDescription] = useState(true);

  const changeDescription = (event) => {
    setError(false);
    setValidDescription(event.target.validity.valid);
    setDescription(event.target.value);
  };

  const deleteDownload = async () => {
    setAttempted(true);
    setLoading(true);
    try {
      await deleteGeneralDownload(downloadId, currentDownload);
      setDeleted(true);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError('Error deleting file');
    }
    setLoading(false);
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

  const submit = async () => {
    setAttempted(true);
    setLoading(true);
    try {
      if (validDescrption) {
        await updateGeneralDownload(downloadId, description);
        setSuccess(true);
      } else {
        setError('Something went wrong - check each input');
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError('Error submitting edit to database');
    }
    setLoading(false);
  };

  const toggleConfirming = () => {
    setConfirmingDelete(!confirmingDelete);
  };

  if (loading) {
    return (
      <div className="flex g16 align-center">
        Loading...
        <div className="loading-animation" />
      </div>
    );
  }

  if (deleted) {
    return (
      <>
        <h2>Download Deleted</h2>
        <div className="product-detail">
          <div>Delete successful.</div>
          <Link to="/dashboard/downloads">Return to downloads list</Link>
        </div>
      </>
    );
  }

  if (success) {
    return (
      <>
        <h2>Download Edited</h2>
        <div className="product-detail">
          <div>Download edited successfully.</div>
          <div>
            New description for
            {' '}
            {currentDownload.fileName}
            :
            {` "${description}"`}
          </div>
          <Link to="/dashboard/downloads/">Return to downloads list</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <h2>Edit General Download</h2>
      <form className="product-detail">
        <fieldset className="detail-form-item">
          <legend>Description (required)</legend>
          <label htmlFor="description">
            <input
              id="description"
              onChange={changeDescription}
              placeholder="Enter file description"
              required
              type="text"
              value={description || ''}
            />
            {attempted && !validDescrption ? (
              <div className="error">Description required</div>
            ) : null}
          </label>
        </fieldset>

        <fieldset className="detail-form-item">
          <legend>File Info</legend>
          <div className="flex flex-col g8">
            <span>{currentDownload.fileName}</span>
            <span>{formatSize(currentDownload.size)}</span>
          </div>
        </fieldset>

        {error ? <span className="error">{error}</span> : null}

        {confirmingDelete ? (
          <>
            <span className="error">
              Are you sure you want to delete? This cannot be undone!
            </span>
            <div className="flex align-center g16">
              <button className="error" onClick={deleteDownload} type="button">
                Confirm Delete
              </button>
              <button
                className="edit-button"
                onClick={toggleConfirming}
                type="button"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="flex align-center g16">
            <button className="submit" onClick={submit} type="button">
              Submit
            </button>
            <button
              className="edit-button"
              onClick={toggleConfirming}
              type="button"
            >
              Delete File
            </button>
            <Link to="/dashboard/downloads">Cancel Editing</Link>
          </div>
        )}
      </form>
    </>
  );
}

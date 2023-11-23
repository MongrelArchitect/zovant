import { useState } from 'react';
import { Link } from 'react-router-dom';

import dropFileIcon from '../assets/images/drop-file.svg';
import fileIcon from '../assets/images/file-added.svg';
import { addGeneralDownload } from '../util/database';

export default function NewDownload() {
  const [attempted, setAttempted] = useState(false);
  const [description, setDescription] = useState('');
  const [error, setError] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successId, setSuccessId] = useState(null);
  const [validDescrption, setValidDescription] = useState(false);
  const [validFile, setValidFile] = useState(false);

  const changeDescription = (event) => {
    setError(false);
    setValidDescription(event.target.validity.valid);
    setDescription(event.target.value);
  };

  const checkValidFile = (fileToCheck) => {
    if (fileToCheck && fileToCheck.size <= 20000000) {
      // we've got a file and it's 20MB or less, good to go!
      return true;
    }
    return false;
  };

  const changeFile = (event) => {
    setError(false);
    const newFile = event.target.files[0];
    if (newFile) {
      setFile(newFile);
      setValidFile(checkValidFile(newFile));
    } else {
      setFile(null);
      setValidFile(false);
    }
  };

  const dropFile = (event) => {
    setError(false);
    event.preventDefault();
    const newFile = event.dataTransfer.files[0];
    if (newFile) {
      setFile(newFile);
      setValidFile(checkValidFile(newFile));
    } else {
      setFile(null);
      setValidFile(false);
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

  const submit = async () => {
    setAttempted(true);
    setLoading(true);
    try {
      if (validDescrption && validFile) {
        const downloadId = await addGeneralDownload(file, description);
        setSuccessId(downloadId);
      } else {
        setError('Something went wrong - check each input');
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError('Error uploading file');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex g16 align-center">
        Loading...
        <div className="loading-animation" />
      </div>
    );
  }

  if (successId) {
    return (
      <>
        <h2>Category Created</h2>
        <div className="product-detail">
          <div>
            New download
            {` "${description}"`}
            {' '}
            created successfully.
          </div>
          <Link to={`/dashboard/downloads/${successId}`}>View details</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <h2>New General Download</h2>
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
          <legend>File (required - 20MB max)</legend>
          <label className="image-label" htmlFor="file">
            <div
              className={file ? 'drop-file' : 'drop-file empty'}
              onDragOver={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              onDrop={dropFile}
            >
              {file ? (
                <>
                  <img alt="" className="file-added" src={fileIcon} />
                  <div>{file.name}</div>
                  <div>{formatSize(file.size)}</div>
                </>
              ) : (
                <>
                  <img alt="" className="drop-image" src={dropFileIcon} />
                  <div>Drop file here</div>
                </>
              )}
            </div>
            {file ? file.name : 'no file chosen'}
            <input
              accept="*/*"
              hidden
              id="file"
              onChange={changeFile}
              type="file"
            />
            <span className="edit-button">Choose File</span>
            {attempted && !validFile ? (
              <div className="error">File required (20MB limit)</div>
            ) : null}
          </label>
        </fieldset>

        {error ? <span className="error">{error}</span> : null}
        <button className="submit" onClick={submit} type="button">
          Submit
        </button>
      </form>
    </>
  );
}

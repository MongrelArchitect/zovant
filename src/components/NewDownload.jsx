import { useState } from 'react';

import dropFileIcon from '../assets/images/drop-file.svg';
import fileIcon from '../assets/images/file-added.svg';

export default function NewDownload() {
  const [attempted, setAttempted] = useState(false);
  const [description, setDescription] = useState('');
  const [error, setError] = useState(false);
  const [file, setFile] = useState(null);
  const [validDescrption, setValidDescription] = useState(false);
  const [validFile, setValidFile] = useState(false);

  const changeFile = () => {};

  const dropFile = () => {};

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

  const handleChange = (event) => {
    console.log(event);
  };

  const submit = () => {};

  return (
    <>
      <h2>New General Download</h2>
      <form className="product-detail">
        <fieldset className="detail-form-item">
          <legend>Description (required)</legend>
          <label htmlFor="description">
            <input
              id="name"
              onChange={handleChange}
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
              <div className="error">Image required (5MB limit)</div>
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

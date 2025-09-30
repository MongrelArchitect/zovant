import { useNavigate } from 'react-router-dom';

export default function ListDownloads({ generalDownloads }) {
  const navigate = useNavigate();

  const downloadIds = Object.keys(generalDownloads).sort((a, b) => {
    if (generalDownloads[a].description < generalDownloads[b].description) {
      return -1;
    }
    if (generalDownloads[a].description > generalDownloads[b].description) {
      return 1;
    }
    return 0;
  });

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

  const viewDetails = (event) => {
    navigate(`/dashboard/downloads/${event.target.dataset.id}`);
  };

  const listAllDownloads = () => {
    if (downloadIds.length) {
      return downloadIds.map((id) => {
        const currentDownload = generalDownloads[id];
        return (
          <li key={id}>
            <button
              className={
                downloadIds.indexOf(id) % 2 === 0
                  ? 'product-list-item even'
                  : 'product-list-item'
              }
              onClick={viewDetails}
              data-id={id}
              type="button"
            >
              <div data-id={id} className="flex flex-col align-start">
                <span data-id={id}>{currentDownload.description}</span>
                <span data-id={id}>{`(${currentDownload.fileName})`}</span>
                <span data-id={id}>{formatSize(currentDownload.size)}</span>
              </div>
            </button>
          </li>
        );
      });
    }
    return <li>No downloads found</li>;
  };

  return (
    <>
      <h2>Choose General Download to View &amp; Edit</h2>
      <ul className="product-detail list">{listAllDownloads()}</ul>
    </>
  );
}

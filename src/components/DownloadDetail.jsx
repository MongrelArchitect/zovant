import { useParams } from 'react-router-dom';

export default function DownloadDetail() {
  const { downloadId } = useParams();

  return (
    <div>
      DETAIL FOR
      {downloadId}
    </div>
  );
}

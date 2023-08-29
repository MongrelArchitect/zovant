import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSingleCategory } from '../util/database';

export default function CategoryDetail() {
  const { id } = useParams();

  const [categoryDetails, setCategoryDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const displayDetails = () => {
    if (categoryDetails) {
      return (
        <>
          <div>{categoryDetails.name}</div>
          <div>{categoryDetails.description}</div>
        </>
      );
    }
    return null;
  };

  useEffect(() => {
    const getDetails = async () => {
      try {
        const details = await getSingleCategory(id);
        setCategoryDetails(details);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
      setLoading(false);
    };
    getDetails();
  }, []);

  return (
    <>
      <h2>Category Detail</h2>
      {loading ? <div>Loading...</div> : null}
      {displayDetails()}
      {error ? <div className="error">{error}</div> : null}
    </>
  );
}

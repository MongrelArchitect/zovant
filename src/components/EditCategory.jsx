import { useEffect, useState } from 'react';
import { getAllCategories, getSingleCategory } from '../util/database';

export default function EditCategory({ categoryToEdit, setCategoryToEdit }) {
  const [allCategories, setAllCategories] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const changeDescription = (event) => {
    setCategoryInfo({ ...categoryInfo, description: event.target.value });
  };

  const changeName = (event) => {
    setCategoryInfo({ ...categoryInfo, name: event.target.value });
  };

  const loadCategoryList = () => (
    <form>
      <h3>Choose a category to view / edit</h3>
      <ul>
        {allCategories.map((category) => (
          <li key={category.id}>
            <button type="button">{category.name}</button>
          </li>
        ))}
      </ul>
    </form>
  );

  const loadForm = () => {
    if (categoryInfo) {
      return (
        <form>
          <label htmlFor="name">
            Name
            <input
              id="name"
              onChange={changeName}
              type="text"
              value={categoryInfo.name || ''}
            />
          </label>
          <label htmlFor="description">
            Description
            <textarea
              id="description"
              onChange={changeDescription}
              rows="5"
              value={categoryInfo.description || ''}
            />
          </label>
          <button type="button">Submit</button>
          <button
            onClick={() => {
              setEditing(false);
            }}
            type="button"
          >
            Cancel
          </button>
        </form>
      );
    }
    return null;
  };

  const loadInfo = () => {
    if (categoryInfo) {
      return (
        <form>
          <h3>{categoryInfo.name}</h3>
          <p>{categoryInfo.description}</p>
          <button
            onClick={() => {
              setEditing(true);
            }}
            type="button"
          >
            {`Edit "${categoryInfo.name}" category`}
          </button>
          <button
            onClick={() => {
              setCategoryToEdit(null);
            }}
            type="button"
          >
            List all categories
          </button>
        </form>
      );
    }
    return null;
  };

  const loadContent = () => {
    if (categoryToEdit) {
      if (editing) {
        return loadForm();
      }
      return loadInfo();
    }
    return loadCategoryList();
  };

  useEffect(() => {
    const loadCategory = async () => {
      if (categoryToEdit) {
        setLoading(true);
        try {
          const category = await getSingleCategory(categoryToEdit);
          setCategoryInfo(category);
        } catch (err) {
          setError(err.message);
        }
        setLoading(false);
      }
    };
    loadCategory();
  }, [editing]);

  useEffect(() => {
    const loadAllCategories = async () => {
      setLoading(true);
      try {
        const categories = await getAllCategories();
        setAllCategories(categories);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };
    loadAllCategories();
  }, []);

  return (
    <>
      {editing ? <h2>Edit Category</h2> : <h2>Category Info</h2>}
      {loading ? <div>Loading...</div> : loadContent()}
      {error ? <span className="error">{error}</span> : null}
    </>
  );
}

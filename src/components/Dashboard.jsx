import { useState } from 'react';
import EditCategory from './EditCategory';
import NewCategory from './NewCategory';
import NewProduct from './NewProduct';
import Summary from './Summary';

export default function Dashboard() {
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [mode, setMode] = useState('summary');

  const addNewCategory = () => {
    setMode('newCategory');
  };

  const addNewProduct = () => {
    setMode('newProduct');
  };

  const editCategory = () => {
    setMode('editCategory');
  };

  const chooseMode = () => {
    switch (mode) {
      case 'newCategory':
        return (
          <NewCategory
            setCategoryToEdit={setCategoryToEdit}
            setMode={setMode}
          />
        );
      case 'newProduct':
        return <NewProduct />;
      case 'editCategory':
        return (
          <EditCategory
            categoryToEdit={categoryToEdit}
            setCategoryToEdit={setCategoryToEdit}
          />
        );
      default:
        return <Summary />;
    }
  };

  const showSummary = () => {
    setMode('summary');
  };

  return (
    <div className="dashboard info">
      <div className="card">
        <h1>Dashboard</h1>

        <div className="dashboard-content">
          <div className="dashboard-control">
            <h2>Options</h2>
            <ul>
              <li>
                <button onClick={showSummary} type="button">
                  Summary
                </button>
              </li>
              <li>
                <button onClick={addNewCategory} type="button">
                  New Category
                </button>
              </li>
              <li>
                <button onClick={editCategory} type="button">
                  Edit Category
                </button>
              </li>
              <li>
                <button onClick={addNewProduct} type="button">
                  New Product
                </button>
              </li>
            </ul>
          </div>

          <div className="dashboard-detail">{chooseMode()}</div>
        </div>
      </div>
    </div>
  );
}

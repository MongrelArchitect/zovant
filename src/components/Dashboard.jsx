import { Link, Outlet } from 'react-router-dom';
import Login from './Login';

export default function Dashboard({ user }) {
  if (user) {
    return (
      <div className="dashboard info">
        <div className="card">
          <h1>Dashboard</h1>

          <div className="dashboard-content">
            <div className="dashboard-control">
              <h2>Options</h2>
              <ul>
                <li>
                  <Link to="/dashboard">Summary</Link>
                </li>
                <li>
                  <Link to="/dashboard/categories/new">New Category</Link>
                </li>
                <li>
                  <Link to="/dashboard/categories/">Edit Category</Link>
                </li>
                <li>
                  <Link to="/dashboard/products/new">New Product</Link>
                </li>
                <li>
                  <Link to="/dashboard/products/">Edit Product</Link>
                </li>
              </ul>
            </div>

            <div className="dashboard-detail">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <Login />;
}

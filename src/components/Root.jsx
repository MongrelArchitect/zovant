import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Root() {
  return (
    <div className="container">
      <Header />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Root() {
  return (
    <div className="container">
      <Header />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

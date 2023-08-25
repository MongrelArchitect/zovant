import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';

export default function Root() {
  return (
    <div className="container">
      <Header />
      <main className="content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

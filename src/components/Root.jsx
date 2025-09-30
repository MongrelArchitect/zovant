import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';

export default function Root({ allCategories, allProducts, user }) {
  return (
    <div className="container">
      <Header
        allCategories={allCategories}
        allProducts={allProducts}
        user={user}
      />
      <main className="content">
        <Outlet />
      </main>
      <Footer user={user} />
    </div>
  );
}

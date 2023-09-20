import Nav from './Nav';
import Search from './Search';
import logoImage from '../assets/images/zovant-logo-vertical-transparent.png';

export default function Header({ allCategories, allProducts, user }) {
  return (
    <header className="header">
      <div className="header-content">
        <img alt="Zovant" src={logoImage} title="Zovant" />
        <Nav user={user} />
        <Search allCategories={allCategories} allProducts={allProducts} />
      </div>
      <div className="header-gradient" />
    </header>
  );
}

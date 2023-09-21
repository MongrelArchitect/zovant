import { useEffect, useState } from 'react';

import Nav from './Nav';
import Search from './Search';

import logoImage from '../assets/images/zovant-logo-vertical-transparent.png';
import menuIcon from '../assets/images/menu.svg';
import closeIcon from '../assets/images/close.svg';

export default function Header({ allCategories, allProducts, user }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const resizeListener = (event) => {
      if (event.target.innerWidth >= 1000) {
        setVisible(false);
      }
    };
    window.addEventListener('resize', resizeListener);
  }, []);

  const toggleCollapse = () => {
    setVisible(!visible);
  };

  const closeNavbar = () => {
    setVisible(false);
  };

  if (visible) {
    return (
      <header className="header">
        <div className="header-content">
          <div className="nav-sidebar">
            <div className="nav-sidebar-header">
              <img alt="Zovant" src={logoImage} title="Zovant" />
              <button
                aria-controls="navigation"
                aria-expanded={visible ? 'true' : 'false'}
                aria-label="Toggle navigation"
                className="toggle-collapse"
                onClick={toggleCollapse}
                type="button"
              >
                <img alt="" src={closeIcon} />
              </button>
            </div>
            <Search
              allCategories={allCategories}
              allProducts={allProducts}
              setVisible={setVisible}
              visible={visible}
            />
            <Nav
              user={user}
              visible={visible}
              toggleCollapse={closeNavbar}
            />
          </div>
        </div>
        <div className="header-gradient" />
      </header>
    );
  }

  return (
    <header className="header">
      <div className="header-content">
        <img alt="Zovant" src={logoImage} title="Zovant" />
        <Nav user={user} toggleCollapse={closeNavbar} />
        <Search allCategories={allCategories} allProducts={allProducts} />
        <button
          aria-controls="navigation"
          aria-expanded={visible ? 'true' : 'false'}
          aria-label="Toggle navigation"
          className="toggle-collapse"
          onClick={toggleCollapse}
          type="button"
        >
          <img alt="" src={menuIcon} />
        </button>
      </div>
      <div className="header-gradient" />
    </header>
  );
}

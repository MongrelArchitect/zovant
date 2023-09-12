import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../util/firebase';

import menuIcon from '../assets/images/menu.svg';
import closeIcon from '../assets/images/close.svg';

export default function Nav({ user }) {
  const [visible, setVisible] = useState(false);

  const toggleCollapse = () => {
    setVisible(!visible);
  };

  return (
    <>
      <nav className="nav">
        <ul className={visible ? 'nav-list show' : 'nav-list'} id="navigation">
          <li>
            <NavLink onClick={toggleCollapse} to="/">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink onClick={toggleCollapse} to="/catalog">
              Products
            </NavLink>
          </li>
          <li>
            <NavLink onClick={toggleCollapse} to="/about">
              About
            </NavLink>
          </li>
          <li>
            <NavLink onClick={toggleCollapse} to="/contact">
              Contact
            </NavLink>
          </li>
          {user ? (
            <>
              <li>
                <NavLink onClick={toggleCollapse} to="/dashboard">
                  Dashboard
                </NavLink>
              </li>
              <li>
                <button
                  className="sign-out"
                  onClick={() => {
                    signOut(auth);
                    toggleCollapse();
                  }}
                  type="button"
                >
                  Sign Out
                </button>
              </li>
            </>
          ) : null}
        </ul>
      </nav>
      <button
        aria-controls="navigation"
        aria-expanded={visible ? 'true' : 'false'}
        aria-label="Toggle navigation"
        className={visible ? 'toggle-collapse flex-start' : 'toggle-collapse'}
        onClick={toggleCollapse}
        type="button"
      >
        <img alt="" src={visible ? closeIcon : menuIcon} />
      </button>
    </>
  );
}

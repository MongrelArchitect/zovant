import { NavLink } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../util/firebase';

export default function Nav({ toggleCollapse, user, visible }) {
  return (
    <nav className={visible ? 'nav visible' : 'nav'}>
      <ul className="nav-list" id="navigation">
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
  );
}

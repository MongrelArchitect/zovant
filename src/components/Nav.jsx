import { NavLink } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../util/firebase';

export default function Nav({ user }) {
  return (
    <nav className="nav">
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/products">Products</NavLink>
        </li>
        <li>
          <NavLink to="/about">About</NavLink>
        </li>
        <li>
          <NavLink to="/contact">Contact</NavLink>
        </li>
        {user ? (
          <li>
            <button
              onClick={() => {
                signOut(auth);
              }}
              type="button"
            >
              Sign Out
            </button>
          </li>
        ) : null}
      </ul>
    </nav>
  );
}

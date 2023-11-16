import { Link } from 'react-router-dom';

import instagramIcon from '../assets/images/instagram-logo.svg';
import youtubeIcon from '../assets/images/youtube-logo.svg';
import logoIcon from '../assets/images/zovant-logo-horizontal-transparent.png';

export default function Footer({ user }) {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="brand">
          <img alt="Zovant" className="logo" src={logoIcon} />
          <ul className="socials">
            {/* XXX link to the brands socials */}
            <li>
              <a
                target="_blank"
                href="https://www.instagram.com/zovantcctv/"
                title="Instagram"
                rel="noreferrer"
              >
                <img
                  alt="Instagram"
                  className="social-logo"
                  src={instagramIcon}
                />
              </a>
            </li>
            <li>
              <a
                target="_blank"
                href="https://www.youtube.com/@ZOVANTCCTV"
                title="youtube"
                rel="noreferrer"
              >
                <img alt="Youtube" className="social-logo" src={youtubeIcon} />
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-links">
          <ul>
            <h3>Links</h3>
            <li>
              <Link to="/privacy">Privacy</Link>
            </li>
            <li>
              <Link to={user ? '/dashboard' : '/login'}>Admin</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="copyright">© Zovant - All rights reserved</div>
    </footer>
  );
}

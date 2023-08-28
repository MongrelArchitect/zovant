import { Link } from 'react-router-dom';

import facebookIcon from '../assets/images/facebook-logo.svg';
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
                href="https://facebook.com"
                title="Facebook"
                rel="noreferrer"
              >
                <img
                  alt="Facebook"
                  className="social-logo"
                  src={facebookIcon}
                />
              </a>
            </li>
            <li>
              <a
                target="_blank"
                href="https://instagram.com"
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
                href="https://youtube.com"
                title="youtube"
                rel="noreferrer"
              >
                <img
                  alt="Youtube"
                  className="social-logo"
                  src={youtubeIcon}
                />
              </a>
            </li>
          </ul>
          <Link to={user ? '/dashboard' : '/login'}>Admin</Link>
        </div>

        <div className="footer-links">
          <ul>
            <h3>Links</h3>
            <li>Something</li>
            <li>Something else</li>
            <li>Another link</li>
            <li>Again</li>
          </ul>
          <ul>
            <h3>Other</h3>
            <li>A thing here</li>
            <li>Maybe</li>
            <li>Here we go again</li>
          </ul>
        </div>

      </div>
      <div className="copyright">
        © Zovant - All rights reserved
      </div>
    </footer>
  );
}
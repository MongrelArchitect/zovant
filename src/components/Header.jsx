import Nav from './Nav';
import '../styles/header.css';
import logoImage from '../assets/images/zovant-logo-vertical-transparent.png';

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <img alt="Zovant" src={logoImage} title="Zovant" />
        <Nav />
      </div>
      <div className="header-gradient" />
    </header>
  );
}

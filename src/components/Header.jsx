import Nav from './Nav';
import logoImage from '../assets/images/zovant-logo-vertical-transparent.png';

export default function Header({ user }) {
  return (
    <header className="header">
      <div className="header-content">
        <img alt="Zovant" src={logoImage} title="Zovant" />
        <Nav user={user} />
      </div>
      <div className="header-gradient" />
    </header>
  );
}

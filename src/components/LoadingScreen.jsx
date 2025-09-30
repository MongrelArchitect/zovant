import logoImage from '../assets/images/zovant-logo-notext-transparent.png';

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-image">
        <img alt="" className="" src={logoImage} />
      </div>
    </div>
  );
}

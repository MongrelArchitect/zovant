import '../styles/info.css';
import logo from '../assets/images/zovant-logo-notext-transparent.png';

export default function Info({ content, heading, image }) {
  return (
    <article className="card">
      <div className="card-contents">
        <div className="card-text">
          <h1>{heading}</h1>
          <p className="card-text">{content}</p>
        </div>
        <img alt="" className="card-image" src={image || logo} />
      </div>
    </article>
  );
}

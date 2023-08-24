import '../styles/banner.css';

export default function Banner({ content }) {
  return (
    <div className="banner">
      <h2>{content}</h2>
    </div>
  );
}

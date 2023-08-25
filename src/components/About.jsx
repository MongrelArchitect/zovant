import '../styles/about.css';
import Info from './Info';

export default function About() {
  return (
    <div className="about">
      <div className="about-hero" />
      <div className="info">
        <Info
          heading="About Us"
          content="Adipisicing ducimus cupiditate ea non sed! Iure nemo totam dolor dolorem eum placeat, nesciunt quos iste sit Cumque laboriosam voluptates repellendus ad explicabo. A deleniti tempore ipsum suscipit nesciunt. Fuga."
        />
      </div>
    </div>
  );
}

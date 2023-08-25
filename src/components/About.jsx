import HeroStatic from './HeroStatic';
import Info from './Info';

import aboutImage from '../assets/images/about.jpg';

export default function About() {
  return (
    <div className="about">
      <HeroStatic image={aboutImage} />
      <div className="info">
        <Info
          heading="About Us"
          content="Adipisicing ducimus cupiditate ea non sed! Iure nemo totam dolor dolorem eum placeat, nesciunt quos iste sit Cumque laboriosam voluptates repellendus ad explicabo. A deleniti tempore ipsum suscipit nesciunt. Fuga."
        />
      </div>
    </div>
  );
}

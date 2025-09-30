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
          content="Zovant is a prominent CCTV manufacturer known for its innovative AI-powered products. With a focus on cutting-edge technology, Zovant has carved a niche for itself in the surveillance industry. Their AI-featured CCTV systems offer advanced capabilities, such as intelligent video analytics, facial recognition, and real-time object detection. As a leading player in the market, Zovant continually pushes the boundaries of what's possible in security solutions. Their AI-driven cameras not only provide enhanced monitoring and threat detection but also deliver valuable insights for businesses and organizations. Whether it's in retail, transportation, or residential security, Zovant's AI-integrated CCTV products have garnered praise for their reliability and effectiveness."
        />
      </div>
    </div>
  );
}

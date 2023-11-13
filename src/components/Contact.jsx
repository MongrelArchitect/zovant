import HeroStatic from './HeroStatic';
import Info from './Info';

import contactImage from '../assets/images/contact.jpg';

export default function Contact() {
  return (
    <div className="contact">
      <HeroStatic image={contactImage} />
      <div className="info">
        <Info
          heading="Contact"
          email="info@zovantcctv.com"
          content="For all inquiries, please email us at "
        />
      </div>
    </div>
  );
}

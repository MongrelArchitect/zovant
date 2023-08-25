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
          content="Consectetur delectus obcaecati soluta quod a Eum facere fugit quaerat optio eos Vitae debitis labore quas doloremque suscipit Explicabo delectus."
        />
      </div>
    </div>
  );
}

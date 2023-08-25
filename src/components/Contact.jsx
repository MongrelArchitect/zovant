import Info from './Info';

import '../styles/contact.css';

export default function Contact() {
  return (
    <div className="contact">
      <div className="contact-hero" />
      <div className="info">
        <Info
          heading="Contact"
          content="Consectetur delectus obcaecati soluta quod a Eum facere fugit quaerat optio eos Vitae debitis labore quas doloremque suscipit Explicabo delectus."
        />
      </div>
    </div>
  );
}

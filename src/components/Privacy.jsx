import HeroStatic from './HeroStatic';

import lock01 from '../assets/images/lock01.jpg';
import logo from '../assets/images/zovant-logo-notext-transparent.png';

export default function Privacy() {
  return (
    <div className="privacy">
      <HeroStatic image={lock01} />
      <div className="info">
        <article className="card">
          <div className="card-contents">
            <div className="card-text">
              <h1>Privacy Policy</h1>
              <p>
                Zovant (&quot;us,&quot; &quot;we,&quot; or &quot;our&quot;)
                operates ZovantCCTV (the &quot;App Store&quot;).
              </p>
              <p>
                This page informs you of our policies regarding the collection,
                use, and disclosure of personal data when you use our App Store
                and the choices you have associated with that data.
              </p>
              <p>
                We are committed to protecting your privacy and ensuring that
                your personal information is handled securely and responsibly.
                By using the App Store, you agree to the collection and use of
                information in accordance with this policy.
              </p>

              <h2>1. Information Collection and Use</h2>
              <p>
                We collect several different types of information for various
                purposes to provide and improve our App Store.
              </p>
              <h3>Types of Data Collected</h3>
              <p>
                <ul>
                  <li>
                    Personal Data: While using our App Store, we may ask you to
                    provide us with certain personally identifiable information
                    that can be used to contact or identify you (&quot;Personal
                    Data&quot;). Personally identifiable information may
                    include, but is not limited to:
                  </li>
                  <li className="no-style">
                    <ul>
                      <li>Email address</li>
                      <li>First name and last name</li>
                      <li>Phone number</li>
                      <li>Address, State, Province, ZIP/Postal code, City</li>
                      <li>Cookies and Usage Data</li>
                    </ul>
                  </li>
                  <li>
                    Usage Data: We may also collect information on how the App
                    Store is accessed and used (&quot;Usage Data&quot;). This
                    Usage Data may include information such as your
                    device&apos;s Internet Protocol address (e.g., IP address),
                    browser type, browser version, the pages of our App Store
                    that you visit, the time and date of your visit, the time
                    spent on those pages, unique device identifiers and other
                    diagnostic data.
                  </li>
                </ul>
              </p>

              <h2>2. Use of Data</h2>
              <p>We use the collected data for various purposes:</p>
              <p>
                <ul>
                  <li>To provide and maintain our App Store.</li>
                  <li>To notify you about changes to our App Store.</li>
                  <li>
                    To allow you to participate in interactive features of our
                    App Store when you choose to do so.
                  </li>
                  <li>To provide customer support and respond to inquiries.</li>
                  <li>
                    To gather analysis or valuable information so that we can
                    improve our App Store.
                  </li>
                  <li>To monitor the usage of our App Store.</li>
                  <li>To detect, prevent, and address technical issues.</li>
                </ul>
              </p>

              <h2>3. Transfer of Data</h2>
              <p>
                Your information, including Personal Data, may be transferred
                to—and maintained on—computers located outside of your state,
                province, country or other governmental jurisdiction where the
                data protection laws may differ than those from your
                jurisdiction.
              </p>

              <p>
                If you are located outside The United States of America and
                choose to provide information to us, please note that we
                transfer the data, including Personal Data, to The USA and
                process it there.
              </p>

              <p>
                Your consent to this Privacy Policy followed by your submission
                of such information represents your agreement to that transfer.
              </p>

              <p>
                We will take all steps reasonably necessary to ensure that your
                data is treated securely and in accordance with this Privacy
                Policy and no transfer of your Personal Data will take place to
                an organization or a country unless there are adequate controls
                in place including the security of your data and other personal
                information.
              </p>

              <h2>4. Disclosure of Data</h2>
              <h3>Business Transaction</h3>
              <p>
                If we are involved in a merger, acquisition or asset sale, your
                Personal Data may be transferred. We will provide notice before
                your Personal Data is transferred and becomes subject to a
                different Privacy Policy.
              </p>
              <h3>Disclosure for Law Enforcement</h3>
              <p>
                Under certain circumstances, we may be required to disclose your
                Personal Data if required to do so by law or in response to
                valid requests by public authorities (e.g., a court or a
                government agency).
              </p>
              <h3>Legal Requirements</h3>
              <p>
                We may disclose your Personal Data in the good faith belief that
                such action is necessary to:
                <ul>
                  <li>Comply with a legal obligation.</li>
                  <li>
                    Protect and defend the rights or property of Zovant.
                  </li>
                  <li>
                    Prevent or investigate possible wrongdoing in connection
                    with the App Store.
                  </li>
                  <li>
                    Protect the personal safety of users of the App Store or the
                    public.
                  </li>
                  <li>Protect against legal liability.</li>
                </ul>
              </p>

              <h2>5. Security of Data</h2>
              <p>
                The security of your data is important to us, but remember that
                no method of transmission over the Internet, or method of
                electronic storage, is perfectly secure.
              </p>
            </div>
            <img alt="" className="card-image" src={logo} />
          </div>
        </article>
      </div>
    </div>
  );
}

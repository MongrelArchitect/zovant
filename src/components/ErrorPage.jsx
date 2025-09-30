import { useRouteError } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function ErrorPage({ user }) {
  const error = useRouteError();
  console.error(useRouteError);

  return (
    <div className="container">
      <Header user={user} />
      <main className="content">
        <div className="info">
          <div className="card">
            <div className="error-page">
              <h1>Opps</h1>
              <p>Sorry, an error has occurred.</p>
              <p>
                <i className="error">{error.statusText || error.message}</i>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer user={user} />
    </div>
  );
}

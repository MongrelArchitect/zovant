import { useRouteError } from 'react-router-dom';
import Header from './Header';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(useRouteError);

  return (
    <div>
      <Header />
      <h1>Opps</h1>
      <p>Sorry, an error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}

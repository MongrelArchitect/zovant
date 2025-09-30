import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../util/firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');

  const changeEmail = (event) => {
    setError(null);
    setEmail(event.target.value);
  };

  const changePassword = (event) => {
    setError(null);
    setPassword(event.target.value);
  };

  const navigate = useNavigate();

  const submitLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Incorrect email or password');
    }
  };

  return (
    <div className="info">
      <div className="card">
        <form className="login-form">
          <h1>Admin Login</h1>
          <label htmlFor="email">
            Email
            <input
              id="email"
              name="email"
              onChange={changeEmail}
              type="email"
              value={email || ''}
            />
          </label>
          <label htmlFor="password">
            Password
            <input
              id="password"
              name="password"
              onChange={changePassword}
              type="password"
              value={password || ''}
            />
          </label>
          {error ? <div className="error">{error}</div> : null}
          <button onClick={submitLogin} type="button">
            Log in
          </button>
          <Link to="/forgot">Forgot password?</Link>
        </form>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../util/firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const changeEmail = (event) => {
    setEmail(event.target.value);
  };

  const changePassword = (event) => {
    setPassword(event.target.value);
  };

  const navigate = useNavigate();

  const submitLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      // XXX show some sort of error to user
      console.error(err);
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
          <button onClick={submitLogin} type="button">
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}

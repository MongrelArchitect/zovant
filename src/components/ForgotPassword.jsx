import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../util/firebase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const changeEmail = (event) => {
    setError(null);
    setSuccess(null);
    setEmail(event.target.value);
  };

  const submit = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Reset link set - check your email');
    } catch {
      setError('Invalid email');
    }
  };

  return (
    <div className="info">
      <div className="card">
        <form className="login-form">
          <h1>Password Reset</h1>
          <label htmlFor="email">
            Enter email to request a new password
            <input
              id="email"
              name="email"
              onChange={changeEmail}
              type="email"
              value={email || ''}
            />
          </label>
          {error ? <div className="error">{error}</div> : null}
          {success ? <div className="success">{success}</div> : null}
          <button onClick={submit} type="button">
            Submit
          </button>
          <Link to="/login">Back to login</Link>
        </form>
      </div>
    </div>
  );
}

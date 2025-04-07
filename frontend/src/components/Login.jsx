import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiContext } from '../api';

function Login({ setIsLoggedIn, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { api } = useContext(ApiContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Use the API context instead of direct fetch
      const data = await api.login(email, password);
      
      localStorage.setItem('token', data.token);
      setIsLoggedIn(true);
      setUser(data.user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
}

export default Login;

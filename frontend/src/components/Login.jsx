import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import '../styles/branding.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(email, password);
      if (response.success) {
        navigate('/dashboard');
      } else {
        setError(response.message || 'Login mislukt. Controleer uw gegevens.');
      }
    } catch (err) {
      setError('Er is een fout opgetreden. Probeer het later opnieuw.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo">
        <img src="/logo.png" alt="Kunstcollectie Logo" />
      </div>
      <h1 className="login-title">Inloggen</h1>
      
      {error && <div className="alert" style={{ color: '#d32f2f', marginBottom: '1rem' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">E-mailadres</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">Wachtwoord</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="btn-primary" 
          style={{ width: '100%', marginTop: '1.5rem' }}
          disabled={loading}
        >
          {loading ? 'Bezig met inloggen...' : 'Inloggen'}
        </button>
      </form>
    </div>
  );
};

export default Login;

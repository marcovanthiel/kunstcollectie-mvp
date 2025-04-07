import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiContext } from '../api';

function Login({ setIsLoggedIn, setUser }) {
  console.log('Login component initializing...');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Get API context with error handling
  const apiContext = useContext(ApiContext);
  console.log('ApiContext in Login:', apiContext ? 'Available' : 'Not available');
  
  // Handle case where API context is not available
  if (!apiContext || !apiContext.api) {
    console.error('API context not available in Login component');
    return (
      <div className="login-container error">
        <h2>Error</h2>
        <p>Er is een probleem met de API verbinding. Probeer de pagina te vernieuwen.</p>
        <button onClick={() => window.location.reload()}>Vernieuwen</button>
      </div>
    );
  }
  
  const { api } = apiContext;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      console.log(`Attempting login for email: ${email}`);
      // Use the API context instead of direct fetch
      const data = await api.login(email, password);
      
      console.log('Login successful, storing token and user data');
      localStorage.setItem('token', data.token);
      setIsLoggedIn(true);
      setUser(data.user);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Er is een fout opgetreden bij het inloggen');
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Bezig met inloggen...' : 'Login'}
        </button>
      </form>
      <p>
        Don't have an account? <a href="/register">Register</a>
      </p>
      
      {/* Default login credentials for testing */}
      <div className="default-credentials" style={{marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px'}}>
        <h3>Standaard inloggegevens:</h3>
        <p><strong>Email:</strong> admin@kunstcollectie.nl</p>
        <p><strong>Wachtwoord:</strong> admin123</p>
      </div>
    </div>
  );
}

export default Login;

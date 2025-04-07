import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { ApiContext } from '../api';

function Dashboard() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Get auth context
  const authContext = useContext(AuthContext);
  console.log('AuthContext in Dashboard:', authContext ? 'Available' : 'Not available');
  
  // Get API context
  const apiContext = useContext(ApiContext);
  console.log('ApiContext in Dashboard:', apiContext ? 'Available' : 'Not available');
  
  if (!authContext) {
    console.error('Auth context not available in Dashboard component');
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>Er is een probleem met de authenticatie context. Probeer de pagina te vernieuwen.</p>
        <button onClick={() => window.location.reload()}>Vernieuwen</button>
      </div>
    );
  }
  
  const { user, handleLogout } = authContext;
  
  // Handle case where API context is not available
  if (!apiContext || !apiContext.api) {
    console.error('API context not available in Dashboard component');
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>Er is een probleem met de API verbinding. Probeer de pagina te vernieuwen.</p>
        <button onClick={() => window.location.reload()}>Vernieuwen</button>
      </div>
    );
  }
  
  const { api } = apiContext;

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        console.log('Fetching artworks with simplified authentication...');
        const data = await api.getArtworks();
        console.log('Artworks fetched successfully:', data);
        setArtworks(data);
      } catch (err) {
        console.error('Error fetching artworks:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArtworks();
  }, [api]);

  const handleAddArtwork = () => {
    navigate('/artworks/new');
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <header>
        <h1>Kunstcollectie Dashboard</h1>
        <div className="user-info">
          <p>Welcome, {user?.name || 'User'}</p>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </header>
      
      <main>
        <section className="dashboard-actions">
          <button onClick={handleAddArtwork} className="add-artwork-button">Add New Artwork</button>
        </section>
        
        <section className="dashboard-summary">
          <div className="summary-card">
            <h3>Total Artworks</h3>
            <p className="summary-number">{artworks.length}</p>
          </div>
        </section>
        
        <section className="recent-artworks">
          <h2>Recent Artworks</h2>
          {error && <div className="error">{error}</div>}
          
          {artworks.length === 0 ? (
            <p>No artworks found. Add your first artwork!</p>
          ) : (
            <div className="artwork-grid">
              {artworks.slice(0, 4).map(artwork => (
                <div key={artwork.id} className="artwork-card" onClick={() => navigate(`/artworks/${artwork.id}`)}>
                  {artwork.imageUrl && <img src={artwork.imageUrl} alt={artwork.title} />}
                  <h3>{artwork.title}</h3>
                  <p>{artwork.artist?.name || 'Unknown Artist'}</p>
                </div>
              ))}
            </div>
          )}
          
          {artworks.length > 4 && (
            <button onClick={() => navigate('/artworks')}>View All Artworks</button>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard({ user }) {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/artworks', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch artworks');
        }
        
        const data = await response.json();
        setArtworks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArtworks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleAddArtwork = () => {
    navigate('/artworks/new');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <header>
        <h1>Kunstcollectie Dashboard</h1>
        <div className="user-info">
          <p>Welcome, {user?.name || 'User'}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>
      
      <main>
        <section className="dashboard-actions">
          <button onClick={handleAddArtwork}>Add New Artwork</button>
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

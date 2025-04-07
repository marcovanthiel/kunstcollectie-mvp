import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ArtworkList() {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="artwork-list-container">
      <h1>Kunstwerken</h1>
      <button onClick={() => navigate('/artworks/new')}>Nieuw kunstwerk toevoegen</button>
      
      {error && <div className="error">{error}</div>}
      
      {artworks.length === 0 ? (
        <p>Geen kunstwerken gevonden.</p>
      ) : (
        <div className="artwork-grid">
          {artworks.map(artwork => (
            <div key={artwork.id} className="artwork-card" onClick={() => navigate(`/artworks/${artwork.id}`)}>
              {artwork.imageUrl && <img src={artwork.imageUrl} alt={artwork.title} />}
              <h3>{artwork.title}</h3>
              <p>{artwork.artist?.name || 'Onbekende kunstenaar'}</p>
              <p>{artwork.creationDate ? new Date(artwork.creationDate).getFullYear() : 'Onbekend jaar'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ArtworkList;

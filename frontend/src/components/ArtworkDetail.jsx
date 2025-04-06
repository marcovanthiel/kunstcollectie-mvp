import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ArtworkDetail() {
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/artworks/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch artwork details');
        }
        
        const data = await response.json();
        setArtwork(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArtwork();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Weet u zeker dat u dit kunstwerk wilt verwijderen?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/artworks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete artwork');
      }
      
      navigate('/artworks');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!artwork) {
    return <div>Kunstwerk niet gevonden</div>;
  }

  return (
    <div className="artwork-detail">
      <div className="artwork-header">
        <h1>{artwork.title}</h1>
        <div className="artwork-actions">
          <button onClick={() => navigate(`/artworks/edit/${id}`)}>Bewerken</button>
          <button className="delete-button" onClick={handleDelete}>Verwijderen</button>
          <button onClick={() => navigate('/artworks')}>Terug naar overzicht</button>
        </div>
      </div>
      
      <div className="artwork-content">
        <div className="artwork-image">
          {artwork.imageUrl ? (
            <img src={artwork.imageUrl} alt={artwork.title} />
          ) : (
            <div className="no-image">Geen afbeelding beschikbaar</div>
          )}
        </div>
        
        <div className="artwork-info">
          <div className="info-group">
            <h3>Kunstenaar</h3>
            <p>{artwork.artist?.name || 'Onbekend'}</p>
          </div>
          
          <div className="info-group">
            <h3>Jaar van creatie</h3>
            <p>{artwork.creationDate ? new Date(artwork.creationDate).getFullYear() : 'Onbekend'}</p>
          </div>
          
          <div className="info-group">
            <h3>Beschrijving</h3>
            <p>{artwork.description || 'Geen beschrijving beschikbaar'}</p>
          </div>
          
          <div className="info-group">
            <h3>Locatie</h3>
            <p>{artwork.location?.name || 'Onbekend'}</p>
          </div>
          
          <div className="info-group">
            <h3>Type</h3>
            <p>{artwork.type?.name || 'Onbekend'}</p>
          </div>
          
          <div className="info-group">
            <h3>Waarde</h3>
            <p>{artwork.value ? `€${artwork.value.toLocaleString()}` : 'Onbekend'}</p>
          </div>
          
          <div className="info-group">
            <h3>Datum van verwerving</h3>
            <p>{artwork.acquisitionDate ? new Date(artwork.acquisitionDate).toLocaleDateString() : 'Onbekend'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtworkDetail;

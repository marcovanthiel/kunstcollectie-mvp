import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiContext } from '../api';
import { AuthContext } from '../App';

function Dashboard() {
  const navigate = useNavigate();
  const { api } = useContext(ApiContext);
  const { user, handleLogout } = useContext(AuthContext);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        console.log('Fetching artworks from Dashboard component');
        const response = await api.getArtworks();
        
        if (response && response.artworks) {
          console.log(`Fetched ${response.artworks.length} artworks`);
          setArtworks(response.artworks);
        } else {
          console.warn('No artworks returned from API');
          setArtworks([]);
        }
      } catch (err) {
        console.error('Error fetching artworks:', err);
        setError(err.message || 'Er is een fout opgetreden bij het ophalen van kunstwerken');
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [api]);

  const handleAddArtwork = () => {
    navigate('/artworks/new');
  };

  const handleViewArtwork = (id) => {
    navigate(`/artworks/${id}`);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <button onClick={handleLogout}>Uitloggen</button>
        </header>
        <div className="dashboard-content loading">
          <p>Kunstwerken laden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <button onClick={handleLogout}>Uitloggen</button>
        </header>
        <div className="dashboard-content error">
          <h2>Er is een fout opgetreden</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Probeer opnieuw</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="user-info">
          <span>Welkom, {user?.name || 'Gebruiker'}</span>
          <button onClick={handleLogout}>Uitloggen</button>
        </div>
      </header>
      
      <div className="dashboard-content">
        <div className="dashboard-actions">
          <h2>Mijn Kunstcollectie</h2>
          <button onClick={handleAddArtwork}>Nieuw kunstwerk toevoegen</button>
        </div>
        
        {artworks.length === 0 ? (
          <div className="no-artworks">
            <p>Je hebt nog geen kunstwerken in je collectie.</p>
            <button onClick={handleAddArtwork}>Voeg je eerste kunstwerk toe</button>
          </div>
        ) : (
          <div className="artwork-grid">
            {artworks.map((artwork) => (
              <div 
                key={artwork.id} 
                className="artwork-card"
                onClick={() => handleViewArtwork(artwork.id)}
              >
                <div className="artwork-image">
                  {artwork.imageUrl ? (
                    <img src={artwork.imageUrl} alt={artwork.title} />
                  ) : (
                    <div className="no-image">Geen afbeelding</div>
                  )}
                </div>
                <div className="artwork-info">
                  <h3>{artwork.title}</h3>
                  {artwork.artist && <p className="artist">{artwork.artist.name}</p>}
                  {artwork.year && <p className="year">{artwork.year}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiContext } from '../api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { api } = React.useContext(ApiContext);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await api.getArtworks();
        
        if (response.success) {
          setArtworks(response.artworks || []);
        } else {
          setError('Kon kunstwerken niet laden');
        }
      } catch (err) {
        console.error('Error fetching artworks:', err);
        setError('Er is een fout opgetreden bij het laden van de kunstwerken');
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [api]);

  const handleLogout = async () => {
    await api.logout();
    navigate('/login');
  };

  return (
    <div>
      <nav className="navbar">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/logo.png" alt="Kunstcollectie Logo" style={{ height: '40px', marginRight: '1rem' }} />
            <h2 style={{ margin: 0, color: 'white' }}>Kunstcollectie</h2>
          </div>
          <button onClick={handleLogout} className="btn-secondary">Uitloggen</button>
        </div>
      </nav>

      <div className="dashboard-header">
        <h1 className="dashboard-title">Kunstcollectie Dashboard</h1>
        <p className="dashboard-subtitle">Beheer uw kunstcollectie</p>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <p>Kunstwerken laden...</p>
        ) : error ? (
          <div className="card" style={{ backgroundColor: '#ffebee', color: '#d32f2f' }}>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h2>Kunstwerken</h2>
              <button className="btn-primary">Nieuw kunstwerk toevoegen</button>
            </div>

            {artworks.length === 0 ? (
              <div className="card">
                <p>Geen kunstwerken gevonden. Voeg uw eerste kunstwerk toe.</p>
              </div>
            ) : (
              <div className="artwork-grid">
                {artworks.map((artwork) => (
                  <div key={artwork.id} className="artwork-item">
                    <img 
                      src={artwork.imageUrl || 'https://via.placeholder.com/300x200?text=Geen+afbeelding'} 
                      alt={artwork.title} 
                      className="artwork-image" 
                    />
                    <div className="artwork-info">
                      <h3 className="artwork-title">{artwork.title}</h3>
                      <p className="artwork-artist">{artwork.artist}</p>
                      <p className="artwork-year">{artwork.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

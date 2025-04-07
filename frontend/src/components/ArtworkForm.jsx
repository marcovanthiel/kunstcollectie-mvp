import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ArtworkForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState('');
  const [artists, setArtists] = useState([]);
  const [locations, setLocations] = useState([]);
  const [types, setTypes] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    creationDate: '',
    acquisitionDate: '',
    value: '',
    imageUrl: '',
    artistId: '',
    locationId: '',
    typeId: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch artwork if editing
        if (id) {
          const artworkResponse = await fetch(`/api/artworks/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!artworkResponse.ok) {
            throw new Error('Failed to fetch artwork');
          }
          
          const artworkData = await artworkResponse.json();
          
          setFormData({
            title: artworkData.title || '',
            description: artworkData.description || '',
            creationDate: artworkData.creationDate ? new Date(artworkData.creationDate).toISOString().split('T')[0] : '',
            acquisitionDate: artworkData.acquisitionDate ? new Date(artworkData.acquisitionDate).toISOString().split('T')[0] : '',
            value: artworkData.value || '',
            imageUrl: artworkData.imageUrl || '',
            artistId: artworkData.artistId || '',
            locationId: artworkData.locationId || '',
            typeId: artworkData.typeId || ''
          });
        }
        
        // Fetch artists, locations, and types for dropdowns
        const [artistsResponse, locationsResponse, typesResponse] = await Promise.all([
          fetch('/api/artists', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/locations', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/artwork-types', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        
        if (!artistsResponse.ok || !locationsResponse.ok || !typesResponse.ok) {
          throw new Error('Failed to fetch reference data');
        }
        
        const [artistsData, locationsData, typesData] = await Promise.all([
          artistsResponse.json(),
          locationsResponse.json(),
          typesResponse.json()
        ]);
        
        setArtists(artistsData);
        setLocations(locationsData);
        setTypes(typesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const method = id ? 'PUT' : 'POST';
      const url = id ? `/api/artworks/${id}` : '/api/artworks';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save artwork');
      }
      
      const savedArtwork = await response.json();
      navigate(`/artworks/${savedArtwork.id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="artwork-form-container">
      <h1>{id ? 'Kunstwerk bewerken' : 'Nieuw kunstwerk toevoegen'}</h1>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Titel *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Beschrijving</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="artistId">Kunstenaar</label>
          <select
            id="artistId"
            name="artistId"
            value={formData.artistId}
            onChange={handleChange}
          >
            <option value="">-- Selecteer kunstenaar --</option>
            {artists.map(artist => (
              <option key={artist.id} value={artist.id}>{artist.name}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="creationDate">Jaar van creatie</label>
          <input
            type="date"
            id="creationDate"
            name="creationDate"
            value={formData.creationDate}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="typeId">Type</label>
          <select
            id="typeId"
            name="typeId"
            value={formData.typeId}
            onChange={handleChange}
          >
            <option value="">-- Selecteer type --</option>
            {types.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="locationId">Locatie</label>
          <select
            id="locationId"
            name="locationId"
            value={formData.locationId}
            onChange={handleChange}
          >
            <option value="">-- Selecteer locatie --</option>
            {locations.map(location => (
              <option key={location.id} value={location.id}>{location.name}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="acquisitionDate">Datum van verwerving</label>
          <input
            type="date"
            id="acquisitionDate"
            name="acquisitionDate"
            value={formData.acquisitionDate}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="value">Waarde (€)</label>
          <input
            type="number"
            id="value"
            name="value"
            value={formData.value}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="imageUrl">Afbeelding URL</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://voorbeeld.com/afbeelding.jpg"
          />
        </div>
        
        <div className="form-actions">
          <button type="submit">{id ? 'Opslaan' : 'Toevoegen'}</button>
          <button type="button" onClick={() => navigate(id ? `/artworks/${id}` : '/artworks')}>Annuleren</button>
        </div>
      </form>
    </div>
  );
}

export default ArtworkForm;

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  TextField, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  IconButton,
  Avatar,
  Tab,
  Tabs,
  FormHelperText
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PaletteIcon from '@mui/icons-material/Palette';

// Voorbeeld data voor een kunstenaar
const mockArtist = {
  id: 2,
  name: 'Jan Jansen',
  address: 'Kunststraat 123',
  city: 'Utrecht',
  country: 'Nederland',
  email: 'jan@janjansen.com',
  phone: '+31 6 12345678',
  website: 'www.janjansen.com',
  birthDate: '1968-07-22',
  deathDate: '',
  biography: 'Jan Jansen is een Nederlandse kunstenaar die bekend staat om zijn expressieve landschappen en abstracte composities. Hij studeerde aan de Rietveld Academie in Amsterdam en heeft sindsdien exposities gehad in verschillende galerieën in Nederland en België. Zijn werk wordt gekenmerkt door levendige kleuren en dynamische penseelstreken.',
  portraitImage: 'https://example.com/portrait.jpg',
  artworks: [
    { id: 1, title: 'Landschap met Bomen', year: 2018, type: 'Schilderij' },
    { id: 7, title: 'Abstracte Compositie #5', year: 2020, type: 'Schilderij' },
    { id: 12, title: 'Stadsgezicht Utrecht', year: 2019, type: 'Fotografie' }
  ]
};

function ArtistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewArtist = id === 'nieuw';
  const [tabValue, setTabValue] = useState(0);
  
  // State voor de kunstenaar
  const [artist, setArtist] = useState(isNewArtist ? {
    name: '',
    address: '',
    city: '',
    country: '',
    email: '',
    phone: '',
    website: '',
    birthDate: '',
    deathDate: '',
    biography: '',
    portraitImage: '',
    artworks: []
  } : mockArtist);

  // Formulier validatie
  const [errors, setErrors] = useState({});

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArtist(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Validatie
    const newErrors = {};
    if (!artist.name) newErrors.name = 'Naam is verplicht';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // In een echte applicatie zou hier een API call plaatsvinden
    alert(`Kunstenaar ${isNewArtist ? 'toegevoegd' : 'bijgewerkt'} (simulatie)`);
    navigate('/kunstenaars');
  };

  const handleDelete = () => {
    if (window.confirm('Weet u zeker dat u deze kunstenaar wilt verwijderen?')) {
      // In een echte applicatie zou hier een API call plaatsvinden
      alert(`Kunstenaar verwijderd (simulatie)`);
      navigate('/kunstenaars');
    }
  };

  const handleAddPortrait = () => {
    // In een echte applicatie zou hier een bestandsupload plaatsvinden
    alert('Portretfoto toevoegen (simulatie)');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate('/kunstenaars')} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            {isNewArtist ? 'Nieuwe Kunstenaar' : 'Kunstenaar Bewerken'}
          </Typography>
        </Box>
        <Box>
          {!isNewArtist && (
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              sx={{ mr: 2 }}
            >
              Verwijderen
            </Button>
          )}
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Opslaan
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Basisinformatie" />
          <Tab label="Biografie" />
          <Tab label="Kunstwerken" />
        </Tabs>
      </Paper>

      {/* Basisinformatie Tab */}
      {tabValue === 0 && (
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                {artist.portraitImage ? (
                  <Avatar 
                    src={artist.portraitImage} 
                    alt={artist.name}
                    sx={{ width: 150, height: 150, mb: 2 }}
                  />
                ) : (
                  <Avatar 
                    sx={{ width: 150, height: 150, mb: 2, fontSize: '3rem', bgcolor: 'secondary.main' }}
                  >
                    {artist.name ? artist.name.charAt(0).toUpperCase() : '?'}
                  </Avatar>
                )}
                <Button
                  variant="outlined"
                  startIcon={<AddPhotoAlternateIcon />}
                  onClick={handleAddPortrait}
                >
                  Portretfoto Toevoegen
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Naam"
                name="name"
                value={artist.name}
                onChange={handleInputChange}
                required
                error={!!errors.name}
                helperText={errors.name}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="E-mail"
                name="email"
                type="email"
                value={artist.email}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Telefoonnummer"
                name="phone"
                value={artist.phone}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Website"
                name="website"
                value={artist.website}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Adresgegevens
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                label="Adres"
                name="address"
                value={artist.address}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stad"
                name="city"
                value={artist.city}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Land"
                name="country"
                value={artist.country}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Geboorte- en overlijdensgegevens
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Geboortedatum"
                name="birthDate"
                type="date"
                value={artist.birthDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Overlijdensdatum"
                name="deathDate"
                type="date"
                value={artist.deathDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Biografie Tab */}
      {tabValue === 1 && (
        <Paper sx={{ p: 3 }}>
          <TextField
            fullWidth
            label="Biografie"
            name="biography"
            multiline
            rows={15}
            value={artist.biography}
            onChange={handleInputChange}
          />
        </Paper>
      )}

      {/* Kunstwerken Tab */}
      {tabValue === 2 && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Kunstwerken van deze kunstenaar
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              onClick={() => navigate('/kunstwerken/nieuw', { state: { artistId: artist.id } })}
              disabled={isNewArtist}
            >
              Nieuw Kunstwerk
            </Button>
          </Box>
          
          {!isNewArtist && artist.artworks && artist.artworks.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Titel</TableCell>
                    <TableCell>Jaar</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Acties</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {artist.artworks.map((artwork) => (
                    <TableRow key={artwork.id} hover>
                      <TableCell>{artwork.title}</TableCell>
                      <TableCell>{artwork.year}</TableCell>
                      <TableCell>
                        <Chip label={artwork.type} size="small" />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton 
                          color="primary" 
                          onClick={() => navigate(`/kunstwerken/${artwork.id}`)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
              <PaletteIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {isNewArtist 
                  ? 'Sla de kunstenaar eerst op voordat u kunstwerken kunt toevoegen.' 
                  : 'Geen kunstwerken gevonden voor deze kunstenaar.'}
              </Typography>
              {!isNewArtist && (
                <Button 
                  variant="outlined" 
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/kunstwerken/nieuw', { state: { artistId: artist.id } })}
                  sx={{ mt: 2 }}
                >
                  Kunstwerk Toevoegen
                </Button>
              )}
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
}

export default ArtistDetail;

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
  Tab,
  Tabs,
  FormHelperText
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaletteIcon from '@mui/icons-material/Palette';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Chip from '@mui/material/Chip';

// Voorbeeld data voor een locatie
const mockLocation = {
  id: 3,
  name: 'Hoofdkantoor',
  address: 'Zakenstraat 123',
  city: 'Rotterdam',
  postalCode: '3011 AB',
  country: 'Nederland',
  type: 'Kantoor',
  typeId: 2,
  notes: 'Hoofdkantoor van het bedrijf. De kunstwerken zijn verspreid over de verschillende verdiepingen en vergaderzalen.',
  artworks: [
    { id: 1, title: 'Landschap met Bomen', artist: 'Jan Jansen', year: 2018, type: 'Schilderij' },
    { id: 5, title: 'Zonder Titel #12', artist: 'Thomas Visser', year: 2021, type: 'Mixed Media' },
    { id: 8, title: 'Compositie in Blauw', artist: 'Maria Pietersen', year: 2019, type: 'Schilderij' }
  ]
};

// Voorbeeld data voor locatie types
const mockLocationTypes = [
  { id: 1, name: 'Galerie' },
  { id: 2, name: 'Kantoor' },
  { id: 3, name: 'Depot' },
  { id: 4, name: 'Museum' },
  { id: 5, name: 'Privé woning' }
];

function LocationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewLocation = id === 'nieuw';
  const [tabValue, setTabValue] = useState(0);
  
  // State voor de locatie
  const [location, setLocation] = useState(isNewLocation ? {
    name: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    typeId: '',
    notes: '',
    artworks: []
  } : mockLocation);

  // Formulier validatie
  const [errors, setErrors] = useState({});

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Validatie
    const newErrors = {};
    if (!location.name) newErrors.name = 'Naam is verplicht';
    if (!location.address) newErrors.address = 'Adres is verplicht';
    if (!location.city) newErrors.city = 'Stad is verplicht';
    if (!location.typeId) newErrors.typeId = 'Type is verplicht';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // In een echte applicatie zou hier een API call plaatsvinden
    alert(`Locatie ${isNewLocation ? 'toegevoegd' : 'bijgewerkt'} (simulatie)`);
    navigate('/locaties');
  };

  const handleDelete = () => {
    if (window.confirm('Weet u zeker dat u deze locatie wilt verwijderen?')) {
      // In een echte applicatie zou hier een API call plaatsvinden
      alert(`Locatie verwijderd (simulatie)`);
      navigate('/locaties');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate('/locaties')} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            {isNewLocation ? 'Nieuwe Locatie' : 'Locatie Bewerken'}
          </Typography>
        </Box>
        <Box>
          {!isNewLocation && (
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
          <Tab label="Locatiegegevens" />
          <Tab label="Kunstwerken" />
          <Tab label="Kaart" />
        </Tabs>
      </Paper>

      {/* Locatiegegevens Tab */}
      {tabValue === 0 && (
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Naam"
                name="name"
                value={location.name}
                onChange={handleInputChange}
                required
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.typeId}>
                <InputLabel>Type Locatie</InputLabel>
                <Select
                  name="typeId"
                  value={location.typeId}
                  onChange={handleInputChange}
                  label="Type Locatie"
                >
                  {mockLocationTypes.map(type => (
                    <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                  ))}
                </Select>
                {errors.typeId && <FormHelperText>{errors.typeId}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Adresgegevens
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adres"
                name="address"
                value={location.address}
                onChange={handleInputChange}
                required
                error={!!errors.address}
                helperText={errors.address}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Postcode"
                name="postalCode"
                value={location.postalCode}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stad"
                name="city"
                value={location.city}
                onChange={handleInputChange}
                required
                error={!!errors.city}
                helperText={errors.city}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Land"
                name="country"
                value={location.country}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Aanvullende informatie
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notities"
                name="notes"
                multiline
                rows={4}
                value={location.notes}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Kunstwerken Tab */}
      {tabValue === 1 && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Kunstwerken op deze locatie
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              onClick={() => navigate('/kunstwerken/nieuw', { state: { locationId: location.id } })}
              disabled={isNewLocation}
            >
              Nieuw Kunstwerk
            </Button>
          </Box>
          
          {!isNewLocation && location.artworks && location.artworks.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Titel</TableCell>
                    <TableCell>Kunstenaar</TableCell>
                    <TableCell>Jaar</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Acties</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {location.artworks.map((artwork) => (
                    <TableRow key={artwork.id} hover>
                      <TableCell>{artwork.title}</TableCell>
                      <TableCell>{artwork.artist}</TableCell>
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
                {isNewLocation 
                  ? 'Sla de locatie eerst op voordat u kunstwerken kunt toevoegen.' 
                  : 'Geen kunstwerken gevonden op deze locatie.'}
              </Typography>
              {!isNewLocation && (
                <Button 
                  variant="outlined" 
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/kunstwerken/nieuw', { state: { locationId: location.id } })}
                  sx={{ mt: 2 }}
                >
                  Kunstwerk Toevoegen
                </Button>
              )}
            </Box>
          )}
        </Paper>
      )}

      {/* Kaart Tab */}
      {tabValue === 2 && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
            <LocationOnIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            <Typography variant="body1" gutterBottom>
              Kaartweergave
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              In de uiteindelijke applicatie wordt hier een interactieve kaart weergegeven met de locatie.
              <br />
              Dit zou geïmplementeerd worden met Google Maps of een vergelijkbare kaartservice.
            </Typography>
            <Box 
              sx={{ 
                width: '100%', 
                height: 400, 
                bgcolor: 'grey.100', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                border: '1px dashed grey.400',
                borderRadius: 1
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Kaart Placeholder
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
}

export default LocationDetail;

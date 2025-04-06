import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  TextField, 
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  InputAdornment
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

function LocationForm({ location = null, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    postalCode: '',
    city: '',
    country: '',
    typeId: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState({});
  const [locationTypes, setLocationTypes] = useState([]);
  
  // Simuleer het laden van locatietypes van de API
  useEffect(() => {
    // In een echte applicatie zouden deze gegevens van de API komen
    const mockLocationTypes = [
      { id: 1, name: 'Kantoor' },
      { id: 2, name: 'Museum' },
      { id: 3, name: 'Galerie' },
      { id: 4, name: 'Opslag' },
      { id: 5, name: 'Uitgeleend' }
    ];
    
    setLocationTypes(mockLocationTypes);
  }, []);
  
  // Als er een bestaande locatie is, vul het formulier in
  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name || '',
        address: location.address || '',
        postalCode: location.postalCode || '',
        city: location.city || '',
        country: location.country || '',
        typeId: location.typeId || '',
        notes: location.notes || ''
      });
    }
  }, [location]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Verwijder eventuele foutmelding voor dit veld
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Verplichte velden
    if (!formData.name) newErrors.name = 'Naam is verplicht';
    if (!formData.address) newErrors.address = 'Adres is verplicht';
    if (!formData.city) newErrors.city = 'Stad is verplicht';
    if (!formData.typeId) newErrors.typeId = 'Type is verplicht';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Verwerk de data voor verzending
      const processedData = {
        ...formData,
        typeId: parseInt(formData.typeId)
      };
      
      onSave(processedData);
    }
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {location ? 'Locatie Bewerken' : 'Nieuwe Locatie Toevoegen'}
        </Typography>
        
        <Grid container spacing={3}>
          {/* Basisinformatie */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Basisinformatie
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Naam"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.typeId} required>
              <InputLabel>Type</InputLabel>
              <Select
                name="typeId"
                value={formData.typeId}
                onChange={handleChange}
                label="Type"
              >
                <MenuItem value="">
                  <em>Selecteer een type</em>
                </MenuItem>
                {locationTypes.map(type => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.typeId && (
                <Typography variant="caption" color="error">
                  {errors.typeId}
                </Typography>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>
          
          {/* Adresgegevens */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Adresgegevens
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Adres"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={!!errors.address}
              helperText={errors.address}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Postcode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Stad"
              name="city"
              value={formData.city}
              onChange={handleChange}
              error={!!errors.city}
              helperText={errors.city}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Land"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>
          
          {/* Notities */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Notities
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notities"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              multiline
              rows={4}
              placeholder="Voeg hier eventuele notities toe over deze locatie..."
            />
          </Grid>
        </Grid>
      </Paper>
      
      {/* Submit knop */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          startIcon={<SaveIcon />}
        >
          {location ? 'Wijzigingen Opslaan' : 'Locatie Toevoegen'}
        </Button>
      </Box>
    </Box>
  );
}

export default LocationForm;

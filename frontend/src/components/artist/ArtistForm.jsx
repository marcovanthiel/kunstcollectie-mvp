import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  TextField, 
  IconButton,
  Card,
  CardMedia,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function ArtistForm({ artist = null, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
    email: '',
    phone: '',
    website: '',
    birthDate: null,
    deathDate: null,
    biography: '',
    portraitUrl: ''
  });
  
  const [errors, setErrors] = useState({});
  const [portraitFile, setPortraitFile] = useState(null);
  const [portraitPreview, setPortraitPreview] = useState('');
  
  // Als er een bestaande kunstenaar is, vul het formulier in
  useEffect(() => {
    if (artist) {
      setFormData({
        name: artist.name || '',
        address: artist.address || '',
        city: artist.city || '',
        country: artist.country || '',
        email: artist.email || '',
        phone: artist.phone || '',
        website: artist.website || '',
        birthDate: artist.birthDate ? new Date(artist.birthDate) : null,
        deathDate: artist.deathDate ? new Date(artist.deathDate) : null,
        biography: artist.biography || '',
        portraitUrl: artist.portraitUrl || ''
      });
      
      if (artist.portraitUrl) {
        setPortraitPreview(artist.portraitUrl);
      }
    }
  }, [artist]);
  
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
  
  const handleDateChange = (date, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: date
    });
  };
  
  const handlePortraitChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPortraitFile(file);
      
      // Maak een preview URL
      const previewUrl = URL.createObjectURL(file);
      setPortraitPreview(previewUrl);
      
      // In een echte applicatie zou je hier de bestandsnaam opslaan
      // en later de afbeelding uploaden bij het opslaan van het formulier
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Verplichte velden
    if (!formData.name) newErrors.name = 'Naam is verplicht';
    
    // E-mail validatie
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ongeldig e-mailadres';
    }
    
    // Website validatie
    if (formData.website && !/^(http|https):\/\/[^ "]+$/.test(formData.website)) {
      newErrors.website = 'Ongeldige website URL (moet beginnen met http:// of https://)';
    }
    
    // Geboortedatum en overlijdensdatum validatie
    if (formData.birthDate && formData.deathDate && formData.birthDate > formData.deathDate) {
      newErrors.deathDate = 'Overlijdensdatum moet na geboortedatum liggen';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In een echte applicatie zou je hier de afbeelding uploaden
      // en de URL in de formData zetten
      
      onSave(formData);
    }
  };
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {artist ? 'Kunstenaar Bewerken' : 'Nieuwe Kunstenaar Toevoegen'}
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
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    width: 150, 
                    height: 150, 
                    border: '1px dashed #ccc',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    mb: 1,
                    position: 'relative'
                  }}
                >
                  {portraitPreview ? (
                    <Box 
                      component="img"
                      src={portraitPreview}
                      alt="Portret preview"
                      sx={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                  )}
                </Box>
                <Button
                  variant="outlined"
                  component="label"
                  size="small"
                >
                  Portret Uploaden
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handlePortraitChange}
                  />
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Geboortedatum"
                value={formData.birthDate}
                onChange={(date) => handleDateChange(date, 'birthDate')}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Overlijdensdatum"
                value={formData.deathDate}
                onChange={(date) => handleDateChange(date, 'deathDate')}
                renderInput={(params) => <TextField {...params} fullWidth error={!!errors.deathDate} helperText={errors.deathDate} />}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>
            
            {/* Contactgegevens */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Contactgegevens
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="E-mail"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telefoonnummer"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                error={!!errors.website}
                helperText={errors.website}
                placeholder="https://www.voorbeeld.nl"
              />
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
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stad"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
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
            
            {/* Biografie */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Biografie
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Biografie"
                name="biography"
                value={formData.biography}
                onChange={handleChange}
                multiline
                rows={6}
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
            {artist ? 'Wijzigingen Opslaan' : 'Kunstenaar Toevoegen'}
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}

export default ArtistForm;

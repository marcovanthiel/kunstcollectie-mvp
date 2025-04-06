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
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  FormControlLabel,
  Checkbox,
  InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import SaveIcon from '@mui/icons-material/Save';
import ImageUpload from './ImageUpload';

function ArtworkForm({ artwork = null, onSave, artists = [], artworkTypes = [], locations = [] }) {
  const [formData, setFormData] = useState({
    title: '',
    artistId: '',
    typeId: '',
    height: '',
    width: '',
    depth: '',
    weight: '',
    year: '',
    estimated: false,
    isEdition: false,
    editionDesc: '',
    isSigned: false,
    signatureDesc: '',
    description: '',
    locationId: '',
    purchaseDate: null,
    purchasePrice: '',
    supplier: '',
    marketValue: '',
    insuredValue: ''
  });
  
  const [errors, setErrors] = useState({});
  
  // Als er een bestaand kunstwerk is, vul het formulier in
  useEffect(() => {
    if (artwork) {
      setFormData({
        title: artwork.title || '',
        artistId: artwork.artistId || '',
        typeId: artwork.typeId || '',
        height: artwork.height || '',
        width: artwork.width || '',
        depth: artwork.depth || '',
        weight: artwork.weight || '',
        year: artwork.year || '',
        estimated: artwork.estimated || false,
        isEdition: artwork.isEdition || false,
        editionDesc: artwork.editionDesc || '',
        isSigned: artwork.isSigned || false,
        signatureDesc: artwork.signatureDesc || '',
        description: artwork.description || '',
        locationId: artwork.locationId || '',
        purchaseDate: artwork.purchaseDate ? new Date(artwork.purchaseDate) : null,
        purchasePrice: artwork.purchasePrice || '',
        supplier: artwork.supplier || '',
        marketValue: artwork.marketValue || '',
        insuredValue: artwork.insuredValue || ''
      });
    }
  }, [artwork]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
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
  
  const validateForm = () => {
    const newErrors = {};
    
    // Verplichte velden
    if (!formData.title) newErrors.title = 'Titel is verplicht';
    if (!formData.artistId) newErrors.artistId = 'Kunstenaar is verplicht';
    if (!formData.typeId) newErrors.typeId = 'Type is verplicht';
    
    // Numerieke velden
    if (formData.height && isNaN(parseFloat(formData.height))) {
      newErrors.height = 'Hoogte moet een getal zijn';
    }
    if (formData.width && isNaN(parseFloat(formData.width))) {
      newErrors.width = 'Breedte moet een getal zijn';
    }
    if (formData.depth && isNaN(parseFloat(formData.depth))) {
      newErrors.depth = 'Diepte moet een getal zijn';
    }
    if (formData.weight && isNaN(parseFloat(formData.weight))) {
      newErrors.weight = 'Gewicht moet een getal zijn';
    }
    if (formData.year && isNaN(parseInt(formData.year))) {
      newErrors.year = 'Jaar moet een geheel getal zijn';
    }
    if (formData.purchasePrice && isNaN(parseFloat(formData.purchasePrice))) {
      newErrors.purchasePrice = 'Aankoopprijs moet een getal zijn';
    }
    if (formData.marketValue && isNaN(parseFloat(formData.marketValue))) {
      newErrors.marketValue = 'Marktwaarde moet een getal zijn';
    }
    if (formData.insuredValue && isNaN(parseFloat(formData.insuredValue))) {
      newErrors.insuredValue = 'Verzekerde waarde moet een getal zijn';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Converteer numerieke waarden
      const processedData = {
        ...formData,
        height: formData.height ? parseFloat(formData.height) : null,
        width: formData.width ? parseFloat(formData.width) : null,
        depth: formData.depth ? parseFloat(formData.depth) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        year: formData.year ? parseInt(formData.year) : null,
        purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : null,
        marketValue: formData.marketValue ? parseFloat(formData.marketValue) : null,
        insuredValue: formData.insuredValue ? parseFloat(formData.insuredValue) : null,
        artistId: parseInt(formData.artistId),
        typeId: parseInt(formData.typeId),
        locationId: formData.locationId ? parseInt(formData.locationId) : null
      };
      
      onSave(processedData);
    }
  };
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {artwork ? 'Kunstwerk Bewerken' : 'Nieuw Kunstwerk Toevoegen'}
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
                label="Titel"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.artistId} required>
                <InputLabel>Kunstenaar</InputLabel>
                <Select
                  name="artistId"
                  value={formData.artistId}
                  onChange={handleChange}
                  label="Kunstenaar"
                >
                  <MenuItem value="">
                    <em>Selecteer een kunstenaar</em>
                  </MenuItem>
                  {artists.map(artist => (
                    <MenuItem key={artist.id} value={artist.id}>
                      {artist.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.artistId && (
                  <Typography variant="caption" color="error">
                    {errors.artistId}
                  </Typography>
                )}
              </FormControl>
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
                  {artworkTypes.map(type => (
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
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Jaar"
                name="year"
                value={formData.year}
                onChange={handleChange}
                error={!!errors.year}
                helperText={errors.year}
                InputProps={{
                  endAdornment: (
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="estimated"
                          checked={formData.estimated}
                          onChange={handleChange}
                          size="small"
                        />
                      }
                      label="Geschat"
                      sx={{ ml: 1 }}
                    />
                  )
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>
            
            {/* Afmetingen */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Afmetingen
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Hoogte"
                name="height"
                value={formData.height}
                onChange={handleChange}
                error={!!errors.height}
                helperText={errors.height}
                InputProps={{
                  endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Breedte"
                name="width"
                value={formData.width}
                onChange={handleChange}
                error={!!errors.width}
                helperText={errors.width}
                InputProps={{
                  endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Diepte"
                name="depth"
                value={formData.depth}
                onChange={handleChange}
                error={!!errors.depth}
                helperText={errors.depth}
                InputProps={{
                  endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Gewicht"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                error={!!errors.weight}
                helperText={errors.weight}
                InputProps={{
                  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>
            
            {/* Details */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Details
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="isEdition"
                    checked={formData.isEdition}
                    onChange={handleChange}
                  />
                }
                label="Editie"
              />
              {formData.isEdition && (
                <TextField
                  fullWidth
                  label="Editie details"
                  name="editionDesc"
                  value={formData.editionDesc}
                  onChange={handleChange}
                  placeholder="bijv. 3/10"
                  sx={{ mt: 1 }}
                />
              )}
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="isSigned"
                    checked={formData.isSigned}
                    onChange={handleChange}
                  />
                }
                label="Gesigneerd"
              />
              {formData.isSigned && (
                <TextField
                  fullWidth
                  label="Signatuur details"
                  name="signatureDesc"
                  value={formData.signatureDesc}
                  onChange={handleChange}
                  placeholder="bijv. rechtsonder gesigneerd"
                  sx={{ mt: 1 }}
                />
              )}
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Beschrijving"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>
            
            {/* Locatie en Waarde */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Locatie en Waarde
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Locatie</InputLabel>
                <Select
                  name="locationId"
                  value={formData.locationId}
                  onChange={handleChange}
                  label="Locatie"
                >
                  <MenuItem value="">
                    <em>Selecteer een locatie</em>
                  </MenuItem>
                  {locations.map(location => (
                    <MenuItem key={location.id} value={location.id}>
                      {location.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Aankoopdatum"
                value={formData.purchaseDate}
                onChange={(date) => handleDateChange(date, 'purchaseDate')}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Aankoopprijs"
                name="purchasePrice"
                value={formData.purchasePrice}
                onChange={handleChange}
                error={!!errors.purchasePrice}
                helperText={errors.purchasePrice}
                InputProps={{
                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Marktwaarde"
                name="marketValue"
                value={formData.marketValue}
                onChange={handleChange}
                error={!!errors.marketValue}
                helperText={errors.marketValue}
                InputProps={{
                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Verzekerde waarde"
                name="insuredValue"
                value={formData.insuredValue}
                onChange={handleChange}
                error={!!errors.insuredValue}
                helperText={errors.insuredValue}
                InputProps={{
                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Leverancier"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </Paper>
        
        {/* Afbeeldingen sectie */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <ImageUpload />
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
            {artwork ? 'Wijzigingen Opslaan' : 'Kunstwerk Toevoegen'}
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}

export default ArtworkForm;

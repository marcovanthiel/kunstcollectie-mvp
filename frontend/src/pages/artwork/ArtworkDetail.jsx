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
  Chip,
  FormControlLabel,
  Checkbox,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Tab,
  Tabs,
  FormHelperText
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AttachFileIcon from '@mui/icons-material/AttachFile';

// Voorbeeld data voor een kunstwerk
const mockArtwork = {
  id: 1,
  title: 'Landschap met Bomen',
  artist: 'Jan Jansen',
  artistId: 2,
  type: 'Schilderij',
  typeId: 1,
  dimensions: {
    height: 80,
    width: 120,
    depth: 0,
    unit: 'cm'
  },
  weight: 3.5,
  year: 2018,
  estimated: false,
  edition: {
    isEdition: true,
    description: 'Editie 3 van 10'
  },
  signed: {
    isSigned: true,
    location: 'Rechtsonder'
  },
  description: 'Een prachtig landschap met bomen in de stijl van de Hollandse meesters. Het werk toont een rustieke scène met een rivier en bomen in de avondzon.',
  location: 'Hoofdkantoor',
  locationId: 3,
  purchase: {
    date: '2019-05-15',
    price: 4500,
    supplier: 'Galerie Moderne'
  },
  marketValue: 5200,
  insuredValue: 5500,
  images: [
    {
      id: 1,
      url: 'https://example.com/image1.jpg',
      isPrimary: true
    },
    {
      id: 2,
      url: 'https://example.com/image2.jpg',
      isPrimary: false
    }
  ],
  attachments: [
    {
      id: 1,
      name: 'Certificaat van Echtheid.pdf',
      url: 'https://example.com/cert.pdf'
    }
  ]
};

// Voorbeeld data voor kunstenaars en locaties
const mockArtists = [
  { id: 1, name: 'Maria Pietersen' },
  { id: 2, name: 'Jan Jansen' },
  { id: 3, name: 'Pieter de Groot' },
  { id: 4, name: 'Anna Bakker' },
  { id: 5, name: 'Thomas Visser' }
];

const mockTypes = [
  { id: 1, name: 'Schilderij' },
  { id: 2, name: 'Sculptuur' },
  { id: 3, name: 'Fotografie' },
  { id: 4, name: 'Mixed Media' },
  { id: 5, name: 'Tekening' }
];

const mockLocations = [
  { id: 1, name: 'Expositieruimte' },
  { id: 2, name: 'Vergaderzaal' },
  { id: 3, name: 'Hoofdkantoor' },
  { id: 4, name: 'Entreehal' },
  { id: 5, name: 'Opslag' }
];

function ArtworkDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewArtwork = id === 'nieuw';
  const [tabValue, setTabValue] = useState(0);
  
  // State voor het kunstwerk
  const [artwork, setArtwork] = useState(isNewArtwork ? {
    title: '',
    artistId: '',
    typeId: '',
    dimensions: { height: '', width: '', depth: '', unit: 'cm' },
    weight: '',
    year: new Date().getFullYear(),
    estimated: false,
    edition: { isEdition: false, description: '' },
    signed: { isSigned: false, location: '' },
    description: '',
    locationId: '',
    purchase: { date: '', price: '', supplier: '' },
    marketValue: '',
    insuredValue: '',
    images: [],
    attachments: []
  } : mockArtwork);

  // Formulier validatie
  const [errors, setErrors] = useState({});

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArtwork(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setArtwork(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleCheckboxChange = (parent, field) => {
    setArtwork(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: !prev[parent][field]
      }
    }));
  };

  const handleSave = () => {
    // Validatie
    const newErrors = {};
    if (!artwork.title) newErrors.title = 'Titel is verplicht';
    if (!artwork.artistId) newErrors.artistId = 'Kunstenaar is verplicht';
    if (!artwork.typeId) newErrors.typeId = 'Type is verplicht';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // In een echte applicatie zou hier een API call plaatsvinden
    alert(`Kunstwerk ${isNewArtwork ? 'toegevoegd' : 'bijgewerkt'} (simulatie)`);
    navigate('/kunstwerken');
  };

  const handleDelete = () => {
    if (window.confirm('Weet u zeker dat u dit kunstwerk wilt verwijderen?')) {
      // In een echte applicatie zou hier een API call plaatsvinden
      alert(`Kunstwerk verwijderd (simulatie)`);
      navigate('/kunstwerken');
    }
  };

  const handleAddImage = () => {
    // In een echte applicatie zou hier een bestandsupload plaatsvinden
    alert('Afbeelding toevoegen (simulatie)');
  };

  const handleAddAttachment = () => {
    // In een echte applicatie zou hier een bestandsupload plaatsvinden
    alert('Bijlage toevoegen (simulatie)');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate('/kunstwerken')} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            {isNewArtwork ? 'Nieuw Kunstwerk' : 'Kunstwerk Bewerken'}
          </Typography>
        </Box>
        <Box>
          {!isNewArtwork && (
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
          <Tab label="Details" />
          <Tab label="Media" />
          <Tab label="Financieel" />
        </Tabs>
      </Paper>

      {/* Basisinformatie Tab */}
      {tabValue === 0 && (
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Titel"
                name="title"
                value={artwork.title}
                onChange={handleInputChange}
                required
                error={!!errors.title}
                helperText={errors.title}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.artistId}>
                <InputLabel>Kunstenaar</InputLabel>
                <Select
                  name="artistId"
                  value={artwork.artistId}
                  onChange={handleInputChange}
                  label="Kunstenaar"
                >
                  {mockArtists.map(artist => (
                    <MenuItem key={artist.id} value={artist.id}>{artist.name}</MenuItem>
                  ))}
                </Select>
                {errors.artistId && <FormHelperText>{errors.artistId}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.typeId}>
                <InputLabel>Type Kunstwerk</InputLabel>
                <Select
                  name="typeId"
                  value={artwork.typeId}
                  onChange={handleInputChange}
                  label="Type Kunstwerk"
                >
                  {mockTypes.map(type => (
                    <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                  ))}
                </Select>
                {errors.typeId && <FormHelperText>{errors.typeId}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Locatie</InputLabel>
                <Select
                  name="locationId"
                  value={artwork.locationId}
                  onChange={handleInputChange}
                  label="Locatie"
                >
                  {mockLocations.map(location => (
                    <MenuItem key={location.id} value={location.id}>{location.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Hoogte"
                type="number"
                value={artwork.dimensions.height}
                onChange={(e) => handleNestedInputChange('dimensions', 'height', e.target.value)}
                InputProps={{
                  endAdornment: <Typography variant="body2">cm</Typography>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Breedte"
                type="number"
                value={artwork.dimensions.width}
                onChange={(e) => handleNestedInputChange('dimensions', 'width', e.target.value)}
                InputProps={{
                  endAdornment: <Typography variant="body2">cm</Typography>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Diepte"
                type="number"
                value={artwork.dimensions.depth}
                onChange={(e) => handleNestedInputChange('dimensions', 'depth', e.target.value)}
                InputProps={{
                  endAdornment: <Typography variant="body2">cm</Typography>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Gewicht"
                type="number"
                value={artwork.weight}
                onChange={handleInputChange}
                name="weight"
                InputProps={{
                  endAdornment: <Typography variant="body2">kg</Typography>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Productiejaar"
                type="number"
                name="year"
                value={artwork.year}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={artwork.estimated} 
                    onChange={() => setArtwork(prev => ({...prev, estimated: !prev.estimated}))}
                  />
                }
                label="Geschatte datum"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Beschrijving"
                multiline
                rows={4}
                name="description"
                value={artwork.description}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Details Tab */}
      {tabValue === 1 && (
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={artwork.edition.isEdition} 
                    onChange={() => handleCheckboxChange('edition', 'isEdition')}
                  />
                }
                label="Editie"
              />
              {artwork.edition.isEdition && (
                <TextField
                  fullWidth
                  label="Editie omschrijving"
                  value={artwork.edition.description}
                  onChange={(e) => handleNestedInputChange('edition', 'description', e.target.value)}
                  sx={{ mt: 2 }}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={artwork.signed.isSigned} 
                    onChange={() => handleCheckboxChange('signed', 'isSigned')}
                  />
                }
                label="Gesigneerd"
              />
              {artwork.signed.isSigned && (
                <TextField
                  fullWidth
                  label="Locatie handtekening"
                  value={artwork.signed.location}
                  onChange={(e) => handleNestedInputChange('signed', 'location', e.target.value)}
                  sx={{ mt: 2 }}
                />
              )}
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Media Tab */}
      {tabValue === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Afbeeldingen
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<AddPhotoAlternateIcon />}
              onClick={handleAddImage}
            >
              Afbeelding Toevoegen
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              U kunt maximaal 15 afbeeldingen toevoegen. Selecteer één afbeelding als hoofdafbeelding.
            </Typography>
          </Box>
          
          {artwork.images && artwork.images.length > 0 ? (
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {artwork.images.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={image.id || index}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={image.url || 'https://via.placeholder.com/300x200?text=Voorbeeld+Afbeelding'}
                      alt={`Afbeelding ${index + 1}`}
                    />
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {image.isPrimary ? (
                        <Chip label="Hoofdafbeelding" color="primary" size="small" />
                      ) : (
                        <Button size="small" onClick={() => alert('Ingesteld als hoofdafbeelding (simulatie)')}>
                          Als hoofdafbeelding instellen
                        </Button>
                      )}
                      <IconButton color="error" size="small" onClick={() => alert(`Afbeelding ${index + 1} verwijderen (simulatie)`)}>
                        <DeleteIcon />
                      </IconButton>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Geen afbeeldingen toegevoegd
            </Typography>
          )}

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Bijlagen
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<AttachFileIcon />}
              onClick={handleAddAttachment}
            >
              Bijlage Toevoegen
            </Button>
          </Box>
          
          {artwork.attachments && artwork.attachments.length > 0 ? (
            <Grid container spacing={2}>
              {artwork.attachments.map((attachment, index) => (
                <Grid item xs={12} sm={6} key={attachment.id || index}>
                  <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1">
                      {attachment.name}
                    </Typography>
                    <Box>
                      <IconButton size="small" onClick={() => alert(`Bijlage ${index + 1} downloaden (simulatie)`)}>
                        <AttachFileIcon />
                      </IconButton>
                      <IconButton color="error" size="small" onClick={() => alert(`Bijlage ${index + 1} verwijderen (simulatie)`)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" color="text.secondary">
              Geen bijlagen toegevoegd
            </Typography>
          )}
        </Paper>
      )}

      {/* Financieel Tab */}
      {tabValue === 3 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Aankoopgegevens
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Aankoopdatum"
                type="date"
                value={artwork.purchase.date}
                onChange={(e) => handleNestedInputChange('purchase', 'date', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Aankoopprijs"
                type="number"
                value={artwork.purchase.price}
                onChange={(e) => handleNestedInputChange('purchase', 'price', e.target.value)}
                InputProps={{
                  startAdornment: <Typography variant="body2">€</Typography>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Leverancier"
                value={artwork.purchase.supplier}
                onChange={(e) => handleNestedInputChange('purchase', 'supplier', e.target.value)}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom>
            Waardering
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Marktwaarde"
                type="number"
                name="marketValue"
                value={artwork.marketValue}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <Typography variant="body2">€</Typography>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Verzekerde waarde"
                type="number"
                name="insuredValue"
                value={artwork.insuredValue}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <Typography variant="body2">€</Typography>
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
}

export default ArtworkDetail;

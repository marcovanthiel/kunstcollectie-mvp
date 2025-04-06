import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardMedia,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import PaletteIcon from '@mui/icons-material/Palette';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import EditIcon from '@mui/icons-material/Edit';
import MapIcon from '@mui/icons-material/Map';

function LocationDetail({ locationId }) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Simuleer het laden van gegevens van de API
  useEffect(() => {
    // In een echte applicatie zou dit een API call zijn
    const fetchLocation = async () => {
      // Simuleer API vertraging
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Voorbeeld locatie
      const mockLocation = {
        id: 1,
        name: 'Hoofdkantoor',
        address: 'Keizersgracht 123',
        postalCode: '1015 CW',
        city: 'Amsterdam',
        country: 'Nederland',
        locationType: { id: 1, name: 'Kantoor' },
        notes: 'Dit is ons hoofdkantoor waar de meeste kunstwerken worden tentoongesteld. De ruimte heeft optimale belichting en klimaatbeheersing voor de kunstcollectie.',
        artworks: [
          {
            id: 1,
            title: 'Zonnebloemen',
            artist: 'Vincent van Gogh',
            year: 1889,
            type: 'Schilderij',
            image: 'https://via.placeholder.com/150?text=Zonnebloemen'
          },
          {
            id: 4,
            title: 'Guernica',
            artist: 'Pablo Picasso',
            year: 1937,
            type: 'Schilderij',
            image: 'https://via.placeholder.com/150?text=Guernica'
          },
          {
            id: 7,
            title: 'De Schreeuw',
            artist: 'Edvard Munch',
            year: 1893,
            type: 'Schilderij',
            image: 'https://via.placeholder.com/150?text=De+Schreeuw'
          }
        ]
      };
      
      setLocation(mockLocation);
      setLoading(false);
    };
    
    fetchLocation();
  }, [locationId]);
  
  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Laden...</Typography>
      </Box>
    );
  }
  
  if (!location) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Locatie niet gevonden.</Typography>
      </Box>
    );
  }
  
  // Genereer Google Maps URL
  const getMapsUrl = () => {
    const address = encodeURIComponent(
      `${location.address}, ${location.postalCode} ${location.city}, ${location.country}`
    );
    return `https://www.google.com/maps/search/?api=1&query=${address}`;
  };
  
  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {location.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Chip 
                icon={<BusinessIcon />} 
                label={location.locationType.name} 
                color="primary" 
                variant="outlined" 
              />
              <Chip 
                icon={<PaletteIcon />} 
                label={`${location.artworks.length} kunstwerken`} 
                color="secondary" 
                variant="outlined" 
              />
            </Box>
          </Box>
          <Box>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<EditIcon />}
              href={`/location/edit/${location.id}`}
              sx={{ mr: 1 }}
            >
              Bewerken
            </Button>
            <Button
              variant="outlined"
              startIcon={<MapIcon />}
              href={getMapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              Bekijk op kaart
            </Button>
          </Box>
        </Box>
        
        <Grid container spacing={4}>
          {/* Adresgegevens */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Adresgegevens
            </Typography>
            
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', width: '40%' }}>
                      Adres
                    </TableCell>
                    <TableCell>{location.address}</TableCell>
                  </TableRow>
                  {location.postalCode && (
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                        Postcode
                      </TableCell>
                      <TableCell>{location.postalCode}</TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                      Stad
                    </TableCell>
                    <TableCell>{location.city}</TableCell>
                  </TableRow>
                  {location.country && (
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                        Land
                      </TableCell>
                      <TableCell>{location.country}</TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                      Type
                    </TableCell>
                    <TableCell>{location.locationType.name}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            
            {location.notes && (
              <>
                <Typography variant="h6" gutterBottom>
                  Notities
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                    {location.notes}
                  </Typography>
                </Paper>
              </>
            )}
          </Grid>
          
          {/* Kunstwerken */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Kunstwerken op deze locatie
            </Typography>
            
            {location.artworks.length === 0 ? (
              <Typography variant="body1">
                Geen kunstwerken gevonden op deze locatie.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {location.artworks.map(artwork => (
                  <Grid item xs={12} sm={6} md={4} key={artwork.id}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="150"
                        image={artwork.image}
                        alt={artwork.title}
                      />
                      <CardContent>
                        <Typography variant="subtitle1" component="div">
                          {artwork.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {artwork.artist}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {artwork.year} • {artwork.type}
                        </Typography>
                        <Button 
                          size="small" 
                          sx={{ mt: 1 }}
                          href={`/artwork/${artwork.id}`}
                        >
                          Details
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default LocationDetail;

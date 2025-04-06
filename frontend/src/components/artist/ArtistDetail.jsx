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
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaletteIcon from '@mui/icons-material/Palette';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';

function ArtistDetail({ artistId }) {
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Simuleer het laden van gegevens van de API
  useEffect(() => {
    // In een echte applicatie zou dit een API call zijn
    const fetchArtist = async () => {
      // Simuleer API vertraging
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Voorbeeld kunstenaar
      const mockArtist = {
        id: 1,
        name: 'Vincent van Gogh',
        address: 'Grote Markt 1',
        city: 'Amsterdam',
        country: 'Nederland',
        email: 'info@vangoghmuseum.nl',
        phone: '+31 20 123 4567',
        website: 'https://www.vangoghmuseum.nl',
        birthDate: '1853-03-30',
        deathDate: '1890-07-29',
        biography: 'Vincent Willem van Gogh was een Nederlands kunstschilder. Zijn werk valt onder het postimpressionisme, een kunststroming die het negentiende-eeuwse impressionisme opvolgde. Van Gogh wordt gezien als een van de belangrijkste schilders van de 19e eeuw.\n\nTijdens zijn leven verkocht hij slechts één schilderij. Na zijn dood werd zijn werk echter al snel erkend als baanbrekend en invloedrijk. Van Gogh leed aan psychische problemen en sneed, na een ruzie met Paul Gauguin, een stuk van zijn linkeroor af. Hij bracht tijd door in psychiatrische inrichtingen en pleegde uiteindelijk zelfmoord op 37-jarige leeftijd.',
        portraitUrl: 'https://via.placeholder.com/400x500?text=Vincent+van+Gogh',
        artworks: [
          {
            id: 1,
            title: 'Zonnebloemen',
            year: 1889,
            type: 'Schilderij',
            image: 'https://via.placeholder.com/150?text=Zonnebloemen'
          },
          {
            id: 2,
            title: 'De Sterrennacht',
            year: 1889,
            type: 'Schilderij',
            image: 'https://via.placeholder.com/150?text=Sterrennacht'
          },
          {
            id: 4,
            title: 'Aardappeleters',
            year: 1885,
            type: 'Schilderij',
            image: 'https://via.placeholder.com/150?text=Aardappeleters'
          }
        ]
      };
      
      setArtist(mockArtist);
      setLoading(false);
    };
    
    fetchArtist();
  }, [artistId]);
  
  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Laden...</Typography>
      </Box>
    );
  }
  
  if (!artist) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Kunstenaar niet gevonden.</Typography>
      </Box>
    );
  }
  
  // Bereken leeftijd of levensduur
  const calculateAge = (birthDate, deathDate) => {
    if (!birthDate) return 'Onbekend';
    
    const birth = new Date(birthDate);
    const death = deathDate ? new Date(deathDate) : new Date();
    const yearDiff = death.getFullYear() - birth.getFullYear();
    
    // Controleer of de verjaardag al is geweest dit jaar
    const monthDiff = death.getMonth() - birth.getMonth();
    const dayDiff = death.getDate() - birth.getDate();
    const hasBirthdayPassed = monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0);
    
    return hasBirthdayPassed ? yearDiff : yearDiff - 1;
  };
  
  // Formatteer datums
  const formatDate = (dateString) => {
    if (!dateString) return 'Onbekend';
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  
  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {artist.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Chip 
                icon={<PersonIcon />} 
                label={artist.country || 'Onbekend land'} 
                color="primary" 
                variant="outlined" 
              />
              <Chip 
                icon={<PaletteIcon />} 
                label={`${artist.artworks.length} kunstwerken`} 
                color="secondary" 
                variant="outlined" 
              />
              {artist.deathDate ? (
                <Chip 
                  icon={<CalendarTodayIcon />} 
                  label={`${calculateAge(artist.birthDate, artist.deathDate)} jaar oud geworden`} 
                  variant="outlined" 
                />
              ) : artist.birthDate ? (
                <Chip 
                  icon={<CalendarTodayIcon />} 
                  label={`${calculateAge(artist.birthDate)} jaar oud`} 
                  variant="outlined" 
                />
              ) : null}
            </Box>
          </Box>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<EditIcon />}
            href={`/artist/edit/${artist.id}`}
          >
            Bewerken
          </Button>
        </Box>
        
        <Grid container spacing={4}>
          {/* Portret en contactgegevens */}
          <Grid item xs={12} md={4}>
            {artist.portraitUrl && (
              <Box 
                component="img"
                src={artist.portraitUrl}
                alt={artist.name}
                sx={{ 
                  width: '100%', 
                  borderRadius: 2,
                  mb: 3
                }}
              />
            )}
            
            <Typography variant="h6" gutterBottom>
              Contactgegevens
            </Typography>
            
            <List>
              {artist.email && (
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <EmailIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={artist.email} 
                    primaryTypographyProps={{ 
                      component: 'a', 
                      href: `mailto:${artist.email}`,
                      sx: { textDecoration: 'none' }
                    }} 
                  />
                </ListItem>
              )}
              
              {artist.phone && (
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <PhoneIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={artist.phone} 
                    primaryTypographyProps={{ 
                      component: 'a', 
                      href: `tel:${artist.phone}`,
                      sx: { textDecoration: 'none' }
                    }} 
                  />
                </ListItem>
              )}
              
              {artist.website && (
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <LanguageIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={artist.website} 
                    primaryTypographyProps={{ 
                      component: 'a', 
                      href: artist.website,
                      target: '_blank',
                      rel: 'noopener noreferrer',
                      sx: { textDecoration: 'none' }
                    }} 
                  />
                </ListItem>
              )}
              
              {(artist.address || artist.city || artist.country) && (
                <ListItem disableGutters alignItems="flex-start">
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <LocationOnIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <>
                        {artist.address && <div>{artist.address}</div>}
                        {artist.city && artist.country ? (
                          <div>{artist.city}, {artist.country}</div>
                        ) : (
                          <>
                            {artist.city && <div>{artist.city}</div>}
                            {artist.country && <div>{artist.country}</div>}
                          </>
                        )}
                      </>
                    }
                  />
                </ListItem>
              )}
            </List>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Persoonlijke informatie
            </Typography>
            
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                      Geboortedatum
                    </TableCell>
                    <TableCell>{formatDate(artist.birthDate)}</TableCell>
                  </TableRow>
                  {artist.deathDate && (
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                        Overlijdensdatum
                      </TableCell>
                      <TableCell>{formatDate(artist.deathDate)}</TableCell>
                    </TableRow>
                  )}
                  {artist.birthDate && (
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                        Leeftijd
                      </TableCell>
                      <TableCell>
                        {artist.deathDate ? (
                          `${calculateAge(artist.birthDate, artist.deathDate)} jaar oud geworden`
                        ) : (
                          `${calculateAge(artist.birthDate)} jaar oud`
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          
          {/* Biografie en kunstwerken */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Biografie
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
              {artist.biography || 'Geen biografie beschikbaar.'}
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Kunstwerken
            </Typography>
            
            {artist.artworks.length === 0 ? (
              <Typography variant="body1">
                Geen kunstwerken gevonden voor deze kunstenaar.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {artist.artworks.map(artwork => (
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

export default ArtistDetail;

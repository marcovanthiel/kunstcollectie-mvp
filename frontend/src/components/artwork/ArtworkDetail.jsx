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
  Chip
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaletteIcon from '@mui/icons-material/Palette';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EuroIcon from '@mui/icons-material/Euro';
import EditIcon from '@mui/icons-material/Edit';

function ArtworkDetail({ artworkId }) {
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Simuleer het laden van gegevens van de API
  useEffect(() => {
    // In een echte applicatie zou dit een API call zijn
    const fetchArtwork = async () => {
      // Simuleer API vertraging
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Voorbeeld kunstwerk
      const mockArtwork = {
        id: 1,
        title: 'Zonnebloemen',
        artist: { 
          id: 1, 
          name: 'Vincent van Gogh',
          birthDate: '1853-03-30',
          deathDate: '1890-07-29'
        },
        artworkType: { id: 1, name: 'Schilderij' },
        year: 1889,
        estimated: false,
        height: 92.1,
        width: 73,
        depth: null,
        weight: null,
        isEdition: false,
        editionDesc: null,
        isSigned: true,
        signatureDesc: 'Rechtsonder gesigneerd met "Vincent"',
        description: 'Een van de beroemdste schilderijen van Van Gogh, onderdeel van een serie stillevens met zonnebloemen in een vaas.',
        location: { 
          id: 1, 
          name: 'Hoofdkantoor',
          address: 'Museumplein 1',
          city: 'Amsterdam'
        },
        purchaseDate: '2010-05-15',
        purchasePrice: 12500000,
        supplier: 'Christie\'s Veilinghuis',
        marketValue: 15000000,
        insuredValue: 18000000,
        images: [
          { 
            id: 1, 
            url: 'https://via.placeholder.com/800x600?text=Zonnebloemen',
            isPrimary: true,
            name: 'zonnebloemen_voorkant.jpg'
          },
          { 
            id: 2, 
            url: 'https://via.placeholder.com/800x600?text=Zonnebloemen+Detail',
            isPrimary: false,
            name: 'zonnebloemen_detail.jpg'
          },
          { 
            id: 3, 
            url: 'https://via.placeholder.com/800x600?text=Zonnebloemen+Achterkant',
            isPrimary: false,
            name: 'zonnebloemen_achterkant.jpg'
          }
        ],
        attachments: [
          {
            id: 1,
            name: 'Certificaat van Echtheid.pdf',
            url: '#',
            type: 'application/pdf'
          },
          {
            id: 2,
            name: 'Restauratierapport_2018.docx',
            url: '#',
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          }
        ]
      };
      
      setArtwork(mockArtwork);
      setLoading(false);
    };
    
    fetchArtwork();
  }, [artworkId]);
  
  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Laden...</Typography>
      </Box>
    );
  }
  
  if (!artwork) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Kunstwerk niet gevonden.</Typography>
      </Box>
    );
  }
  
  // Vind de primaire afbeelding
  const primaryImage = artwork.images.find(img => img.isPrimary) || artwork.images[0];
  
  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {artwork.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {artwork.artist.name}, {artwork.year}{artwork.estimated ? ' (geschat)' : ''}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Chip 
                icon={<PaletteIcon />} 
                label={artwork.artworkType.name} 
                color="primary" 
                variant="outlined" 
              />
              <Chip 
                icon={<LocationOnIcon />} 
                label={artwork.location.name} 
                color="secondary" 
                variant="outlined" 
              />
            </Box>
          </Box>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<EditIcon />}
            href={`/artwork/edit/${artwork.id}`}
          >
            Bewerken
          </Button>
        </Box>
        
        <Grid container spacing={4}>
          {/* Afbeelding sectie */}
          <Grid item xs={12} md={6}>
            <Box 
              component="img"
              src={primaryImage.url}
              alt={artwork.title}
              sx={{ 
                width: '100%', 
                maxHeight: 500, 
                objectFit: 'contain',
                borderRadius: 1,
                mb: 2
              }}
            />
            
            {artwork.images.length > 1 && (
              <Grid container spacing={1}>
                {artwork.images.map((image) => (
                  <Grid item xs={4} key={image.id}>
                    <Box 
                      component="img"
                      src={image.url}
                      alt={`Thumbnail ${image.id}`}
                      sx={{ 
                        width: '100%', 
                        height: 100, 
                        objectFit: 'cover',
                        borderRadius: 1,
                        border: image.isPrimary ? '2px solid #3f51b5' : '1px solid #eee',
                        cursor: 'pointer'
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
          
          {/* Details sectie */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Details
            </Typography>
            
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', width: '40%' }}>
                      Kunstenaar
                    </TableCell>
                    <TableCell>
                      {artwork.artist.name}
                      {artwork.artist.birthDate && artwork.artist.deathDate && (
                        <Typography variant="body2" color="text.secondary">
                          {new Date(artwork.artist.birthDate).getFullYear()} - {new Date(artwork.artist.deathDate).getFullYear()}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                      Type
                    </TableCell>
                    <TableCell>{artwork.artworkType.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                      Jaar
                    </TableCell>
                    <TableCell>{artwork.year}{artwork.estimated ? ' (geschat)' : ''}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                      Afmetingen
                    </TableCell>
                    <TableCell>
                      {artwork.height && artwork.width ? (
                        <>
                          {artwork.height} × {artwork.width} cm
                          {artwork.depth ? ` × ${artwork.depth} cm` : ''}
                        </>
                      ) : (
                        'Niet gespecificeerd'
                      )}
                      {artwork.weight && (
                        <Typography variant="body2">
                          Gewicht: {artwork.weight} kg
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                  {artwork.isEdition && (
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                        Editie
                      </TableCell>
                      <TableCell>{artwork.editionDesc}</TableCell>
                    </TableRow>
                  )}
                  {artwork.isSigned && (
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                        Signatuur
                      </TableCell>
                      <TableCell>{artwork.signatureDesc || 'Gesigneerd'}</TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                      Locatie
                    </TableCell>
                    <TableCell>
                      {artwork.location.name}
                      <Typography variant="body2" color="text.secondary">
                        {artwork.location.address}, {artwork.location.city}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            
            <Typography variant="h6" gutterBottom>
              Beschrijving
            </Typography>
            <Typography variant="body1" paragraph>
              {artwork.description || 'Geen beschrijving beschikbaar.'}
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Financiële Informatie
            </Typography>
            
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', width: '40%' }}>
                      Aankoopdatum
                    </TableCell>
                    <TableCell>
                      {artwork.purchaseDate ? new Date(artwork.purchaseDate).toLocaleDateString('nl-NL') : 'Onbekend'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                      Aankoopprijs
                    </TableCell>
                    <TableCell>
                      {artwork.purchasePrice ? new Intl.NumberFormat('nl-NL', { 
                        style: 'currency', 
                        currency: 'EUR',
                        maximumFractionDigits: 0
                      }).format(artwork.purchasePrice) : 'Onbekend'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                      Leverancier
                    </TableCell>
                    <TableCell>{artwork.supplier || 'Onbekend'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                      Huidige marktwaarde
                    </TableCell>
                    <TableCell>
                      {artwork.marketValue ? new Intl.NumberFormat('nl-NL', { 
                        style: 'currency', 
                        currency: 'EUR',
                        maximumFractionDigits: 0
                      }).format(artwork.marketValue) : 'Onbekend'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                      Verzekerde waarde
                    </TableCell>
                    <TableCell>
                      {artwork.insuredValue ? new Intl.NumberFormat('nl-NL', { 
                        style: 'currency', 
                        currency: 'EUR',
                        maximumFractionDigits: 0
                      }).format(artwork.insuredValue) : 'Onbekend'}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            
            {artwork.attachments && artwork.attachments.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Bijlagen
                </Typography>
                <Box sx={{ mb: 3 }}>
                  {artwork.attachments.map(attachment => (
                    <Button
                      key={attachment.id}
                      variant="outlined"
                      href={attachment.url}
                      target="_blank"
                      sx={{ mr: 1, mb: 1 }}
                    >
                      {attachment.name}
                    </Button>
                  ))}
                </Box>
              </>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default ArtworkDetail;

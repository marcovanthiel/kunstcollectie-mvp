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
  CardActions,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import PaletteIcon from '@mui/icons-material/Palette';

function ArtistList() {
  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    country: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [countries, setCountries] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState(null);
  
  // Simuleer het laden van gegevens van de API
  useEffect(() => {
    // In een echte applicatie zouden deze gegevens van de API komen
    const fetchData = async () => {
      // Simuleer API vertraging
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Voorbeeld kunstenaars
      const mockArtists = [
        {
          id: 1,
          name: 'Vincent van Gogh',
          country: 'Nederland',
          birthDate: '1853-03-30',
          deathDate: '1890-07-29',
          artworkCount: 3,
          portraitUrl: 'https://via.placeholder.com/150?text=Van+Gogh'
        },
        {
          id: 2,
          name: 'Rembrandt van Rijn',
          country: 'Nederland',
          birthDate: '1606-07-15',
          deathDate: '1669-10-04',
          artworkCount: 2,
          portraitUrl: 'https://via.placeholder.com/150?text=Rembrandt'
        },
        {
          id: 3,
          name: 'Auguste Rodin',
          country: 'Frankrijk',
          birthDate: '1840-11-12',
          deathDate: '1917-11-17',
          artworkCount: 1,
          portraitUrl: 'https://via.placeholder.com/150?text=Rodin'
        },
        {
          id: 4,
          name: 'Pablo Picasso',
          country: 'Spanje',
          birthDate: '1881-10-25',
          deathDate: '1973-04-08',
          artworkCount: 4,
          portraitUrl: 'https://via.placeholder.com/150?text=Picasso'
        },
        {
          id: 5,
          name: 'Claude Monet',
          country: 'Frankrijk',
          birthDate: '1840-11-14',
          deathDate: '1926-12-05',
          artworkCount: 2,
          portraitUrl: 'https://via.placeholder.com/150?text=Monet'
        }
      ];
      
      // Extraheer unieke landen
      const uniqueCountries = [...new Set(mockArtists.map(artist => artist.country))];
      
      setArtists(mockArtists);
      setFilteredArtists(mockArtists);
      setCountries(uniqueCountries);
      setLoading(false);
    };
    
    fetchData();
  }, []);
  
  // Filter kunstenaars op basis van zoekterm en filters
  useEffect(() => {
    let result = [...artists];
    
    // Zoekterm filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(artist => 
        artist.name.toLowerCase().includes(lowerSearchTerm) ||
        (artist.country && artist.country.toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    // Land filter
    if (filters.country) {
      result = result.filter(artist => artist.country === filters.country);
    }
    
    setFilteredArtists(result);
    setPage(0); // Reset naar eerste pagina bij filteren
  }, [searchTerm, filters, artists]);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const resetFilters = () => {
    setFilters({
      country: ''
    });
    setSearchTerm('');
  };
  
  const handleDeleteClick = (artist) => {
    setArtistToDelete(artist);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    // In een echte applicatie zou dit een API call zijn
    // Controleer eerst of er kunstwerken aan deze kunstenaar zijn gekoppeld
    if (artistToDelete.artworkCount > 0) {
      alert(`Deze kunstenaar kan niet worden verwijderd omdat er ${artistToDelete.artworkCount} kunstwerken aan gekoppeld zijn.`);
    } else {
      const updatedArtists = artists.filter(artist => artist.id !== artistToDelete.id);
      setArtists(updatedArtists);
    }
    setDeleteDialogOpen(false);
    setArtistToDelete(null);
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setArtistToDelete(null);
  };
  
  // Bereken paginering
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredArtists.length) : 0;
  const visibleRows = filteredArtists.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
  // Functie om leeftijd of levensduur te berekenen
  const calculateLifespan = (birthDate, deathDate) => {
    if (!birthDate) return 'Onbekend';
    
    const birth = new Date(birthDate);
    const death = deathDate ? new Date(deathDate) : new Date();
    const yearDiff = death.getFullYear() - birth.getFullYear();
    
    // Controleer of de verjaardag al is geweest dit jaar
    const monthDiff = death.getMonth() - birth.getMonth();
    const dayDiff = death.getDate() - birth.getDate();
    const hasBirthdayPassed = monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0);
    
    const age = hasBirthdayPassed ? yearDiff : yearDiff - 1;
    
    return deathDate ? `${age} jaar (${birth.getFullYear()}-${death.getFullYear()})` : `${age} jaar`;
  };
  
  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            Kunstenaars Beheren
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            href="/artist/add"
          >
            Nieuwe Kunstenaar
          </Button>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Zoeken"
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                startIcon={<FilterListIcon />}
                onClick={toggleFilters}
                sx={{ mr: 1 }}
              >
                {showFilters ? 'Filters Verbergen' : 'Filters Tonen'}
              </Button>
              {(searchTerm || filters.country) && (
                <Button 
                  variant="outlined" 
                  color="secondary"
                  onClick={resetFilters}
                >
                  Filters Wissen
                </Button>
              )}
            </Grid>
          </Grid>
          
          {showFilters && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Land"
                    name="country"
                    value={filters.country}
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">
                      <em>Alle landen</em>
                    </MenuItem>
                    {countries.map(country => (
                      <MenuItem key={country} value={country}>
                        {country}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
        
        {loading ? (
          <Typography>Laden...</Typography>
        ) : filteredArtists.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Geen kunstenaars gevonden die voldoen aan de zoekcriteria.
            </Typography>
          </Paper>
        ) : (
          <>
            {/* Kaartweergave voor kunstenaars */}
            <Grid container spacing={3}>
              {visibleRows.map((artist) => (
                <Grid item xs={12} sm={6} md={4} key={artist.id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      image={artist.portraitUrl}
                      alt={artist.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent>
                      <Typography variant="h6" component="div" gutterBottom>
                        {artist.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <Chip 
                          icon={<PersonIcon />} 
                          label={artist.country || 'Onbekend land'} 
                          size="small" 
                          variant="outlined" 
                        />
                        <Chip 
                          icon={<PaletteIcon />} 
                          label={`${artist.artworkCount} kunstwerken`} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {calculateLifespan(artist.birthDate, artist.deathDate)}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        startIcon={<VisibilityIcon />}
                        href={`/artist/${artist.id}`}
                      >
                        Bekijken
                      </Button>
                      <Button 
                        size="small" 
                        startIcon={<EditIcon />}
                        href={`/artist/edit/${artist.id}`}
                      >
                        Bewerken
                      </Button>
                      <Button 
                        size="small" 
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteClick(artist)}
                        disabled={artist.artworkCount > 0}
                      >
                        Verwijderen
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            <TablePagination
              rowsPerPageOptions={[6, 12, 24]}
              component="div"
              count={filteredArtists.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Kunstenaars per pagina:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} van ${count}`}
            />
          </>
        )}
      </Paper>
      
      {/* Verwijder bevestigingsdialoog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Kunstenaar verwijderen</DialogTitle>
        <DialogContent>
          <Typography>
            Weet u zeker dat u de kunstenaar "{artistToDelete?.name}" wilt verwijderen?
            {artistToDelete?.artworkCount > 0 ? (
              <Typography color="error" sx={{ mt: 1 }}>
                Let op: Deze kunstenaar heeft {artistToDelete.artworkCount} kunstwerken in de collectie.
                Verwijder eerst deze kunstwerken of koppel ze aan een andere kunstenaar.
              </Typography>
            ) : (
              <Typography sx={{ mt: 1 }}>
                Deze actie kan niet ongedaan worden gemaakt.
              </Typography>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Annuleren</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={artistToDelete?.artworkCount > 0}
          >
            Verwijderen
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ArtistList;

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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

function ArtworkList() {
  const [artworks, setArtworks] = useState([]);
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    artistId: '',
    typeId: '',
    locationId: '',
    minValue: '',
    maxValue: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [artists, setArtists] = useState([]);
  const [artworkTypes, setArtworkTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [artworkToDelete, setArtworkToDelete] = useState(null);
  
  // Simuleer het laden van gegevens van de API
  useEffect(() => {
    // In een echte applicatie zouden deze gegevens van de API komen
    const fetchData = async () => {
      // Simuleer API vertraging
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Voorbeeld kunstwerken
      const mockArtworks = [
        {
          id: 1,
          title: 'Zonnebloemen',
          artist: { id: 1, name: 'Vincent van Gogh' },
          artworkType: { id: 1, name: 'Schilderij' },
          year: 1889,
          location: { id: 1, name: 'Hoofdkantoor' },
          marketValue: 15000000,
          image: 'https://via.placeholder.com/150?text=Zonnebloemen'
        },
        {
          id: 2,
          title: 'De Nachtwacht',
          artist: { id: 2, name: 'Rembrandt van Rijn' },
          artworkType: { id: 1, name: 'Schilderij' },
          year: 1642,
          location: { id: 2, name: 'Museum' },
          marketValue: 500000000,
          image: 'https://via.placeholder.com/150?text=Nachtwacht'
        },
        {
          id: 3,
          title: 'De Denker',
          artist: { id: 3, name: 'Auguste Rodin' },
          artworkType: { id: 2, name: 'Sculptuur' },
          year: 1904,
          location: { id: 3, name: 'Tuin' },
          marketValue: 8000000,
          image: 'https://via.placeholder.com/150?text=De+Denker'
        },
        {
          id: 4,
          title: 'Guernica',
          artist: { id: 4, name: 'Pablo Picasso' },
          artworkType: { id: 1, name: 'Schilderij' },
          year: 1937,
          location: { id: 1, name: 'Hoofdkantoor' },
          marketValue: 200000000,
          image: 'https://via.placeholder.com/150?text=Guernica'
        },
        {
          id: 5,
          title: 'Waterlelies',
          artist: { id: 5, name: 'Claude Monet' },
          artworkType: { id: 1, name: 'Schilderij' },
          year: 1916,
          location: { id: 2, name: 'Museum' },
          marketValue: 80000000,
          image: 'https://via.placeholder.com/150?text=Waterlelies'
        }
      ];
      
      // Voorbeeld kunstenaars
      const mockArtists = [
        { id: 1, name: 'Vincent van Gogh' },
        { id: 2, name: 'Rembrandt van Rijn' },
        { id: 3, name: 'Auguste Rodin' },
        { id: 4, name: 'Pablo Picasso' },
        { id: 5, name: 'Claude Monet' }
      ];
      
      // Voorbeeld kunstwerk types
      const mockArtworkTypes = [
        { id: 1, name: 'Schilderij' },
        { id: 2, name: 'Sculptuur' },
        { id: 3, name: 'Tekening' },
        { id: 4, name: 'Fotografie' },
        { id: 5, name: 'Installatie' }
      ];
      
      // Voorbeeld locaties
      const mockLocations = [
        { id: 1, name: 'Hoofdkantoor' },
        { id: 2, name: 'Museum' },
        { id: 3, name: 'Tuin' },
        { id: 4, name: 'Opslag' },
        { id: 5, name: 'Uitgeleend' }
      ];
      
      setArtworks(mockArtworks);
      setFilteredArtworks(mockArtworks);
      setArtists(mockArtists);
      setArtworkTypes(mockArtworkTypes);
      setLocations(mockLocations);
      setLoading(false);
    };
    
    fetchData();
  }, []);
  
  // Filter kunstwerken op basis van zoekterm en filters
  useEffect(() => {
    let result = [...artworks];
    
    // Zoekterm filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(artwork => 
        artwork.title.toLowerCase().includes(lowerSearchTerm) ||
        artwork.artist.name.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // Kunstenaar filter
    if (filters.artistId) {
      result = result.filter(artwork => artwork.artist.id === parseInt(filters.artistId));
    }
    
    // Type filter
    if (filters.typeId) {
      result = result.filter(artwork => artwork.artworkType.id === parseInt(filters.typeId));
    }
    
    // Locatie filter
    if (filters.locationId) {
      result = result.filter(artwork => artwork.location.id === parseInt(filters.locationId));
    }
    
    // Waarde filters
    if (filters.minValue) {
      result = result.filter(artwork => artwork.marketValue >= parseFloat(filters.minValue));
    }
    if (filters.maxValue) {
      result = result.filter(artwork => artwork.marketValue <= parseFloat(filters.maxValue));
    }
    
    setFilteredArtworks(result);
    setPage(0); // Reset naar eerste pagina bij filteren
  }, [searchTerm, filters, artworks]);
  
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
      artistId: '',
      typeId: '',
      locationId: '',
      minValue: '',
      maxValue: ''
    });
    setSearchTerm('');
  };
  
  const handleDeleteClick = (artwork) => {
    setArtworkToDelete(artwork);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    // In een echte applicatie zou dit een API call zijn
    const updatedArtworks = artworks.filter(artwork => artwork.id !== artworkToDelete.id);
    setArtworks(updatedArtworks);
    setDeleteDialogOpen(false);
    setArtworkToDelete(null);
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setArtworkToDelete(null);
  };
  
  // Bereken paginering
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredArtworks.length) : 0;
  const visibleRows = filteredArtworks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            Kunstwerken Beheren
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            href="/artwork/add"
          >
            Nieuw Kunstwerk
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
              {(searchTerm || Object.values(filters).some(value => value !== '')) && (
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
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Kunstenaar</InputLabel>
                    <Select
                      name="artistId"
                      value={filters.artistId}
                      onChange={handleFilterChange}
                      label="Kunstenaar"
                    >
                      <MenuItem value="">
                        <em>Alle kunstenaars</em>
                      </MenuItem>
                      {artists.map(artist => (
                        <MenuItem key={artist.id} value={artist.id}>
                          {artist.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select
                      name="typeId"
                      value={filters.typeId}
                      onChange={handleFilterChange}
                      label="Type"
                    >
                      <MenuItem value="">
                        <em>Alle types</em>
                      </MenuItem>
                      {artworkTypes.map(type => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Locatie</InputLabel>
                    <Select
                      name="locationId"
                      value={filters.locationId}
                      onChange={handleFilterChange}
                      label="Locatie"
                    >
                      <MenuItem value="">
                        <em>Alle locaties</em>
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
                  <TextField
                    fullWidth
                    label="Minimale waarde"
                    name="minValue"
                    value={filters.minValue}
                    onChange={handleFilterChange}
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">€</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Maximale waarde"
                    name="maxValue"
                    value={filters.maxValue}
                    onChange={handleFilterChange}
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">€</InputAdornment>,
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
        
        {loading ? (
          <Typography>Laden...</Typography>
        ) : filteredArtworks.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Geen kunstwerken gevonden die voldoen aan de zoekcriteria.
            </Typography>
          </Paper>
        ) : (
          <>
            {/* Tabelweergave */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Afbeelding</TableCell>
                    <TableCell>Titel</TableCell>
                    <TableCell>Kunstenaar</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Jaar</TableCell>
                    <TableCell>Locatie</TableCell>
                    <TableCell align="right">Waarde</TableCell>
                    <TableCell align="center">Acties</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleRows.map((artwork) => (
                    <TableRow key={artwork.id}>
                      <TableCell>
                        <Box
                          component="img"
                          sx={{
                            height: 60,
                            width: 60,
                            objectFit: 'cover',
                            borderRadius: 1
                          }}
                          src={artwork.image}
                          alt={artwork.title}
                        />
                      </TableCell>
                      <TableCell>{artwork.title}</TableCell>
                      <TableCell>{artwork.artist.name}</TableCell>
                      <TableCell>{artwork.artworkType.name}</TableCell>
                      <TableCell>{artwork.year}</TableCell>
                      <TableCell>{artwork.location.name}</TableCell>
                      <TableCell align="right">
                        {new Intl.NumberFormat('nl-NL', { 
                          style: 'currency', 
                          currency: 'EUR',
                          maximumFractionDigits: 0
                        }).format(artwork.marketValue)}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          color="primary" 
                          href={`/artwork/${artwork.id}`}
                          size="small"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton 
                          color="secondary" 
                          href={`/artwork/edit/${artwork.id}`}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleDeleteClick(artwork)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 73 * emptyRows }}>
                      <TableCell colSpan={8} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredArtworks.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Rijen per pagina:"
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
        <DialogTitle>Kunstwerk verwijderen</DialogTitle>
        <DialogContent>
          <Typography>
            Weet u zeker dat u het kunstwerk "{artworkToDelete?.title}" wilt verwijderen?
            Deze actie kan niet ongedaan worden gemaakt.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Annuleren</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Verwijderen
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ArtworkList;

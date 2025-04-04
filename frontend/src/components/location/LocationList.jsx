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
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import PaletteIcon from '@mui/icons-material/Palette';

function LocationList() {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    typeId: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [locationTypes, setLocationTypes] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);
  
  // Simuleer het laden van gegevens van de API
  useEffect(() => {
    // In een echte applicatie zouden deze gegevens van de API komen
    const fetchData = async () => {
      // Simuleer API vertraging
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Voorbeeld locatietypes
      const mockLocationTypes = [
        { id: 1, name: 'Kantoor' },
        { id: 2, name: 'Museum' },
        { id: 3, name: 'Galerie' },
        { id: 4, name: 'Opslag' },
        { id: 5, name: 'Uitgeleend' }
      ];
      
      // Voorbeeld locaties
      const mockLocations = [
        {
          id: 1,
          name: 'Hoofdkantoor',
          address: 'Keizersgracht 123',
          postalCode: '1015 CW',
          city: 'Amsterdam',
          country: 'Nederland',
          locationType: { id: 1, name: 'Kantoor' },
          artworkCount: 12
        },
        {
          id: 2,
          name: 'Museum Modern',
          address: 'Museumplein 10',
          postalCode: '1071 DJ',
          city: 'Amsterdam',
          country: 'Nederland',
          locationType: { id: 2, name: 'Museum' },
          artworkCount: 25
        },
        {
          id: 3,
          name: 'Galerie Noord',
          address: 'Prinsengracht 45',
          postalCode: '1012 HK',
          city: 'Amsterdam',
          country: 'Nederland',
          locationType: { id: 3, name: 'Galerie' },
          artworkCount: 8
        },
        {
          id: 4,
          name: 'Depot Zuid',
          address: 'Industrieweg 78',
          postalCode: '3077 BL',
          city: 'Rotterdam',
          country: 'Nederland',
          locationType: { id: 4, name: 'Opslag' },
          artworkCount: 32
        },
        {
          id: 5,
          name: 'Stedelijk Museum',
          address: 'Museumstraat 1',
          postalCode: '1071 XX',
          city: 'Amsterdam',
          country: 'Nederland',
          locationType: { id: 2, name: 'Museum' },
          artworkCount: 15
        }
      ];
      
      setLocationTypes(mockLocationTypes);
      setLocations(mockLocations);
      setFilteredLocations(mockLocations);
      setLoading(false);
    };
    
    fetchData();
  }, []);
  
  // Filter locaties op basis van zoekterm en filters
  useEffect(() => {
    let result = [...locations];
    
    // Zoekterm filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(location => 
        location.name.toLowerCase().includes(lowerSearchTerm) ||
        location.address.toLowerCase().includes(lowerSearchTerm) ||
        location.city.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // Type filter
    if (filters.typeId) {
      result = result.filter(location => location.locationType.id === parseInt(filters.typeId));
    }
    
    setFilteredLocations(result);
    setPage(0); // Reset naar eerste pagina bij filteren
  }, [searchTerm, filters, locations]);
  
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
      typeId: ''
    });
    setSearchTerm('');
  };
  
  const handleDeleteClick = (location) => {
    setLocationToDelete(location);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    // In een echte applicatie zou dit een API call zijn
    // Controleer eerst of er kunstwerken aan deze locatie zijn gekoppeld
    if (locationToDelete.artworkCount > 0) {
      alert(`Deze locatie kan niet worden verwijderd omdat er ${locationToDelete.artworkCount} kunstwerken aan gekoppeld zijn.`);
    } else {
      const updatedLocations = locations.filter(location => location.id !== locationToDelete.id);
      setLocations(updatedLocations);
    }
    setDeleteDialogOpen(false);
    setLocationToDelete(null);
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setLocationToDelete(null);
  };
  
  // Bereken paginering
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredLocations.length) : 0;
  const visibleRows = filteredLocations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            Locaties Beheren
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            href="/location/add"
          >
            Nieuwe Locatie
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
              {(searchTerm || filters.typeId) && (
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
                    label="Type"
                    name="typeId"
                    value={filters.typeId}
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">
                      <em>Alle types</em>
                    </MenuItem>
                    {locationTypes.map(type => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
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
        ) : filteredLocations.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Geen locaties gevonden die voldoen aan de zoekcriteria.
            </Typography>
          </Paper>
        ) : (
          <>
            {/* Kaartweergave voor locaties */}
            <Grid container spacing={3}>
              {visibleRows.map((location) => (
                <Grid item xs={12} sm={6} md={4} key={location.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" component="div" gutterBottom>
                        {location.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip 
                          icon={<BusinessIcon />} 
                          label={location.locationType.name} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                        <Chip 
                          icon={<PaletteIcon />} 
                          label={`${location.artworkCount} kunstwerken`} 
                          size="small" 
                          variant="outlined" 
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <LocationOnIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                        {location.address}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {location.postalCode && `${location.postalCode}, `}
                        {location.city}
                        {location.country && `, ${location.country}`}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        startIcon={<VisibilityIcon />}
                        href={`/location/${location.id}`}
                      >
                        Bekijken
                      </Button>
                      <Button 
                        size="small" 
                        startIcon={<EditIcon />}
                        href={`/location/edit/${location.id}`}
                      >
                        Bewerken
                      </Button>
                      <Button 
                        size="small" 
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteClick(location)}
                        disabled={location.artworkCount > 0}
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
              count={filteredLocations.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Locaties per pagina:"
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
        <DialogTitle>Locatie verwijderen</DialogTitle>
        <DialogContent>
          <Typography>
            Weet u zeker dat u de locatie "{locationToDelete?.name}" wilt verwijderen?
            {locationToDelete?.artworkCount > 0 ? (
              <Typography color="error" sx={{ mt: 1 }}>
                Let op: Deze locatie heeft {locationToDelete.artworkCount} kunstwerken in de collectie.
                Verplaats eerst deze kunstwerken naar een andere locatie.
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
            disabled={locationToDelete?.artworkCount > 0}
          >
            Verwijderen
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default LocationList;

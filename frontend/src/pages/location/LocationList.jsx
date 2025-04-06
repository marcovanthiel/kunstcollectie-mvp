import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  TextField, 
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom';

// Voorbeeld data voor locaties
const mockLocations = [
  { 
    id: 1, 
    name: 'Expositieruimte', 
    address: 'Kunstlaan 45',
    city: 'Amsterdam',
    country: 'Nederland',
    type: 'Galerie',
    artworkCount: 12
  },
  { 
    id: 2, 
    name: 'Vergaderzaal', 
    address: 'Bedrijfsweg 10',
    city: 'Utrecht',
    country: 'Nederland',
    type: 'Kantoor',
    artworkCount: 5
  },
  { 
    id: 3, 
    name: 'Hoofdkantoor', 
    address: 'Zakenstraat 123',
    city: 'Rotterdam',
    country: 'Nederland',
    type: 'Kantoor',
    artworkCount: 18
  },
  { 
    id: 4, 
    name: 'Entreehal', 
    address: 'Zakenstraat 123',
    city: 'Rotterdam',
    country: 'Nederland',
    type: 'Kantoor',
    artworkCount: 3
  },
  { 
    id: 5, 
    name: 'Opslag', 
    address: 'Magazijnweg 8',
    city: 'Almere',
    country: 'Nederland',
    type: 'Depot',
    artworkCount: 42
  },
];

function LocationList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter locaties op basis van zoekterm
  const filteredLocations = mockLocations.filter(location => 
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleAddLocation = () => {
    navigate('/locaties/nieuw');
  };

  const handleEditLocation = (id) => {
    navigate(`/locaties/${id}`);
  };

  const handleDeleteLocation = (id) => {
    // In een echte applicatie zou hier een API call plaatsvinden
    alert(`Locatie met ID ${id} verwijderen (simulatie)`);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Locaties
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddLocation}
        >
          Nieuwe Locatie
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Zoeken op naam, adres, stad of type..."
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
      </Paper>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="locaties tabel">
          <TableHead>
            <TableRow>
              <TableCell>Naam</TableCell>
              <TableCell>Adres</TableCell>
              <TableCell>Stad</TableCell>
              <TableCell>Land</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Aantal Werken</TableCell>
              <TableCell align="right">Acties</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLocations
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((location) => (
                <TableRow key={location.id} hover>
                  <TableCell component="th" scope="row" sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon sx={{ mr: 1, color: 'success.main' }} />
                    {location.name}
                  </TableCell>
                  <TableCell>{location.address}</TableCell>
                  <TableCell>{location.city}</TableCell>
                  <TableCell>{location.country}</TableCell>
                  <TableCell>
                    <Chip label={location.type} size="small" color="success" />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={location.artworkCount} 
                      color="primary" 
                      size="small" 
                      onClick={() => navigate(`/kunstwerken?location=${location.id}`)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      color="primary" 
                      onClick={() => handleEditLocation(location.id)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteLocation(location.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            {filteredLocations.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Geen locaties gevonden
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredLocations.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Rijen per pagina:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} van ${count}`}
        />
      </TableContainer>
    </Box>
  );
}

export default LocationList;

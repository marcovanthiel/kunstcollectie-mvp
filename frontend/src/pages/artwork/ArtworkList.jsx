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
import { useNavigate } from 'react-router-dom';

// Voorbeeld data voor kunstwerken
const mockArtworks = [
  { 
    id: 1, 
    title: 'Landschap met Bomen', 
    artist: 'Jan Jansen', 
    type: 'Schilderij', 
    dimensions: '80 x 120 cm',
    year: 2018,
    location: 'Hoofdkantoor',
    value: '€ 4.500'
  },
  { 
    id: 2, 
    title: 'Abstracte Compositie #3', 
    artist: 'Maria Pietersen', 
    type: 'Schilderij', 
    dimensions: '100 x 100 cm',
    year: 2020,
    location: 'Expositieruimte',
    value: '€ 6.800'
  },
  { 
    id: 3, 
    title: 'Bronzen Figuur', 
    artist: 'Pieter de Groot', 
    type: 'Sculptuur', 
    dimensions: '45 x 20 x 15 cm',
    year: 2015,
    location: 'Entreehal',
    value: '€ 12.000'
  },
  { 
    id: 4, 
    title: 'Stadsgezicht Amsterdam', 
    artist: 'Anna Bakker', 
    type: 'Fotografie', 
    dimensions: '60 x 90 cm',
    year: 2019,
    location: 'Vergaderzaal',
    value: '€ 2.200'
  },
  { 
    id: 5, 
    title: 'Zonder Titel #12', 
    artist: 'Thomas Visser', 
    type: 'Mixed Media', 
    dimensions: '70 x 50 cm',
    year: 2021,
    location: 'Hoofdkantoor',
    value: '€ 3.800'
  },
];

function ArtworkList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter kunstwerken op basis van zoekterm
  const filteredArtworks = mockArtworks.filter(artwork => 
    artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artwork.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artwork.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artwork.location.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleAddArtwork = () => {
    navigate('/kunstwerken/nieuw');
  };

  const handleEditArtwork = (id) => {
    navigate(`/kunstwerken/${id}`);
  };

  const handleDeleteArtwork = (id) => {
    // In een echte applicatie zou hier een API call plaatsvinden
    alert(`Kunstwerk met ID ${id} verwijderen (simulatie)`);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Kunstwerken
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddArtwork}
        >
          Nieuw Kunstwerk
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Zoeken op titel, kunstenaar, type of locatie..."
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
        <Table sx={{ minWidth: 650 }} aria-label="kunstwerken tabel">
          <TableHead>
            <TableRow>
              <TableCell>Titel</TableCell>
              <TableCell>Kunstenaar</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Afmetingen</TableCell>
              <TableCell>Jaar</TableCell>
              <TableCell>Locatie</TableCell>
              <TableCell>Waarde</TableCell>
              <TableCell align="right">Acties</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredArtworks
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((artwork) => (
                <TableRow key={artwork.id} hover>
                  <TableCell component="th" scope="row">
                    {artwork.title}
                  </TableCell>
                  <TableCell>{artwork.artist}</TableCell>
                  <TableCell>
                    <Chip label={artwork.type} size="small" />
                  </TableCell>
                  <TableCell>{artwork.dimensions}</TableCell>
                  <TableCell>{artwork.year}</TableCell>
                  <TableCell>{artwork.location}</TableCell>
                  <TableCell>{artwork.value}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      color="primary" 
                      onClick={() => handleEditArtwork(artwork.id)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteArtwork(artwork.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            {filteredArtworks.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Geen kunstwerken gevonden
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
      </TableContainer>
    </Box>
  );
}

export default ArtworkList;

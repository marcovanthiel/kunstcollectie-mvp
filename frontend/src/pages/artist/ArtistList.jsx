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
  InputAdornment,
  Avatar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

// Voorbeeld data voor kunstenaars
const mockArtists = [
  { 
    id: 1, 
    name: 'Maria Pietersen', 
    country: 'Nederland',
    city: 'Amsterdam',
    birthDate: '1975-03-12',
    website: 'www.mariapietersen.nl',
    artworkCount: 8
  },
  { 
    id: 2, 
    name: 'Jan Jansen', 
    country: 'Nederland',
    city: 'Utrecht',
    birthDate: '1968-07-22',
    website: 'www.janjansen.com',
    artworkCount: 12
  },
  { 
    id: 3, 
    name: 'Pieter de Groot', 
    country: 'België',
    city: 'Antwerpen',
    birthDate: '1982-11-05',
    website: 'www.pieterdegroot.be',
    artworkCount: 5
  },
  { 
    id: 4, 
    name: 'Anna Bakker', 
    country: 'Nederland',
    city: 'Rotterdam',
    birthDate: '1990-05-18',
    website: 'www.annabakker.nl',
    artworkCount: 7
  },
  { 
    id: 5, 
    name: 'Thomas Visser', 
    country: 'Duitsland',
    city: 'Berlijn',
    birthDate: '1972-09-30',
    website: 'www.thomasvisser.de',
    artworkCount: 15
  },
];

function ArtistList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter kunstenaars op basis van zoekterm
  const filteredArtists = mockArtists.filter(artist => 
    artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artist.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artist.city.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleAddArtist = () => {
    navigate('/kunstenaars/nieuw');
  };

  const handleEditArtist = (id) => {
    navigate(`/kunstenaars/${id}`);
  };

  const handleDeleteArtist = (id) => {
    // In een echte applicatie zou hier een API call plaatsvinden
    alert(`Kunstenaar met ID ${id} verwijderen (simulatie)`);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Kunstenaars
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddArtist}
        >
          Nieuwe Kunstenaar
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Zoeken op naam, land of stad..."
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
        <Table sx={{ minWidth: 650 }} aria-label="kunstenaars tabel">
          <TableHead>
            <TableRow>
              <TableCell>Kunstenaar</TableCell>
              <TableCell>Land</TableCell>
              <TableCell>Stad</TableCell>
              <TableCell>Geboortedatum</TableCell>
              <TableCell>Website</TableCell>
              <TableCell>Aantal Werken</TableCell>
              <TableCell align="right">Acties</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredArtists
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((artist) => (
                <TableRow key={artist.id} hover>
                  <TableCell component="th" scope="row" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>{getInitials(artist.name)}</Avatar>
                    {artist.name}
                  </TableCell>
                  <TableCell>{artist.country}</TableCell>
                  <TableCell>{artist.city}</TableCell>
                  <TableCell>{new Date(artist.birthDate).toLocaleDateString('nl-NL')}</TableCell>
                  <TableCell>{artist.website}</TableCell>
                  <TableCell>
                    <Chip 
                      label={artist.artworkCount} 
                      color="primary" 
                      size="small" 
                      onClick={() => navigate(`/kunstwerken?artist=${artist.id}`)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      color="primary" 
                      onClick={() => handleEditArtist(artist.id)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteArtist(artist.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            {filteredArtists.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Geen kunstenaars gevonden
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredArtists.length}
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

export default ArtistList;

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
  Switch,
  FormControlLabel,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SecurityIcon from '@mui/icons-material/Security';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    isActive: true,
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  // Simuleer het laden van gebruikers van de API
  useEffect(() => {
    // In een echte applicatie zouden deze gegevens van de API komen
    const fetchData = async () => {
      // Simuleer API vertraging
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Voorbeeld gebruikers
      const mockUsers = [
        {
          id: 1,
          name: 'Admin Gebruiker',
          email: 'admin@kunstcollectie.nl',
          role: 'admin',
          isActive: true,
          lastLogin: '2025-04-03T14:32:21Z'
        },
        {
          id: 2,
          name: 'Jan Jansen',
          email: 'jan@kunstcollectie.nl',
          role: 'manager',
          isActive: true,
          lastLogin: '2025-04-02T09:15:43Z'
        },
        {
          id: 3,
          name: 'Piet Pietersen',
          email: 'piet@kunstcollectie.nl',
          role: 'user',
          isActive: true,
          lastLogin: '2025-04-01T11:22:33Z'
        },
        {
          id: 4,
          name: 'Klaas Klaassen',
          email: 'klaas@kunstcollectie.nl',
          role: 'user',
          isActive: false,
          lastLogin: '2025-03-15T16:45:12Z'
        },
        {
          id: 5,
          name: 'Marie Maassen',
          email: 'marie@kunstcollectie.nl',
          role: 'user',
          isActive: true,
          lastLogin: '2025-03-28T13:11:09Z'
        }
      ];
      
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setLoading(false);
    };
    
    fetchData();
  }, []);
  
  // Filter gebruikers op basis van zoekterm
  useEffect(() => {
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(lowerSearchTerm) ||
        user.email.toLowerCase().includes(lowerSearchTerm) ||
        user.role.toLowerCase().includes(lowerSearchTerm)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
    setPage(0); // Reset naar eerste pagina bij filteren
  }, [searchTerm, users]);
  
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
  
  const handleAddUser = () => {
    setCurrentUser(null);
    setUserFormData({
      name: '',
      email: '',
      role: 'user',
      isActive: true,
      password: '',
      confirmPassword: ''
    });
    setFormErrors({});
    setUserDialogOpen(true);
  };
  
  const handleEditUser = (user) => {
    setCurrentUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      password: '',
      confirmPassword: ''
    });
    setFormErrors({});
    setUserDialogOpen(true);
  };
  
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    // In een echte applicatie zou dit een API call zijn
    const updatedUsers = users.filter(user => user.id !== userToDelete.id);
    setUsers(updatedUsers);
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };
  
  const handleUserDialogClose = () => {
    setUserDialogOpen(false);
  };
  
  const handleUserFormChange = (e) => {
    const { name, value, checked, type } = e.target;
    setUserFormData({
      ...userFormData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Verwijder eventuele foutmelding voor dit veld
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  const validateUserForm = () => {
    const errors = {};
    
    if (!userFormData.name) errors.name = 'Naam is verplicht';
    if (!userFormData.email) {
      errors.email = 'E-mail is verplicht';
    } else if (!/\S+@\S+\.\S+/.test(userFormData.email)) {
      errors.email = 'Ongeldig e-mailadres';
    }
    
    // Controleer of e-mail al bestaat (behalve bij bewerken van dezelfde gebruiker)
    const emailExists = users.some(user => 
      user.email === userFormData.email && (!currentUser || user.id !== currentUser.id)
    );
    if (emailExists) {
      errors.email = 'E-mailadres is al in gebruik';
    }
    
    // Wachtwoord validatie alleen bij nieuwe gebruiker of als wachtwoord is ingevuld
    if (!currentUser || userFormData.password) {
      if (!currentUser && !userFormData.password) {
        errors.password = 'Wachtwoord is verplicht';
      } else if (userFormData.password && userFormData.password.length < 8) {
        errors.password = 'Wachtwoord moet minimaal 8 tekens bevatten';
      }
      
      if (userFormData.password !== userFormData.confirmPassword) {
        errors.confirmPassword = 'Wachtwoorden komen niet overeen';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleUserFormSubmit = () => {
    if (validateUserForm()) {
      if (currentUser) {
        // Update bestaande gebruiker
        const updatedUsers = users.map(user => {
          if (user.id === currentUser.id) {
            return {
              ...user,
              name: userFormData.name,
              email: userFormData.email,
              role: userFormData.role,
              isActive: userFormData.isActive
            };
          }
          return user;
        });
        setUsers(updatedUsers);
      } else {
        // Voeg nieuwe gebruiker toe
        const newUser = {
          id: users.length + 1,
          name: userFormData.name,
          email: userFormData.email,
          role: userFormData.role,
          isActive: userFormData.isActive,
          lastLogin: null
        };
        setUsers([...users, newUser]);
      }
      
      setUserDialogOpen(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Bereken paginering
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredUsers.length) : 0;
  const visibleRows = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
  // Vertaal rol naar leesbare tekst
  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'manager':
        return 'Manager';
      case 'user':
        return 'Gebruiker';
      default:
        return role;
    }
  };
  
  // Formateer datum
  const formatDate = (dateString) => {
    if (!dateString) return 'Nooit';
    const date = new Date(dateString);
    return date.toLocaleString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            Gebruikersbeheer
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={handleAddUser}
          >
            Nieuwe Gebruiker
          </Button>
        </Box>
        
        <Box sx={{ mb: 3 }}>
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
        </Box>
        
        {loading ? (
          <Typography>Laden...</Typography>
        ) : filteredUsers.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Geen gebruikers gevonden die voldoen aan de zoekcriteria.
            </Typography>
          </Paper>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Naam</TableCell>
                    <TableCell>E-mail</TableCell>
                    <TableCell>Rol</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Laatste login</TableCell>
                    <TableCell align="right">Acties</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleRows.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.role === 'admin' ? (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AdminPanelSettingsIcon color="primary" sx={{ mr: 1 }} />
                            {getRoleLabel(user.role)}
                          </Box>
                        ) : user.role === 'manager' ? (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <SecurityIcon color="secondary" sx={{ mr: 1 }} />
                            {getRoleLabel(user.role)}
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PersonIcon sx={{ mr: 1 }} />
                            {getRoleLabel(user.role)}
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            backgroundColor: user.isActive ? 'success.light' : 'error.light',
                            color: 'white'
                          }}
                        >
                          {user.isActive ? 'Actief' : 'Inactief'}
                        </Box>
                      </TableCell>
                      <TableCell>{formatDate(user.lastLogin)}</TableCell>
                      <TableCell align="right">
                        <IconButton 
                          color="primary" 
                          onClick={() => handleEditUser(user)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleDeleteClick(user)}
                          size="small"
                          disabled={user.role === 'admin'} // Voorkom verwijderen van admin
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredUsers.length}
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
      
      {/* Gebruiker toevoegen/bewerken dialoog */}
      <Dialog
        open={userDialogOpen}
        onClose={handleUserDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {currentUser ? 'Gebruiker Bewerken' : 'Nieuwe Gebruiker Toevoegen'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Naam"
                name="name"
                value={userFormData.name}
                onChange={handleUserFormChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="E-mail"
                name="email"
                type="email"
                value={userFormData.email}
                onChange={handleUserFormChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Rol</InputLabel>
                <Select
                  name="role"
                  value={userFormData.role}
                  onChange={handleUserFormChange}
                  label="Rol"
                >
                  <MenuItem value="admin">Administrator</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="user">Gebruiker</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="isActive"
                    checked={userFormData.isActive}
                    onChange={handleUserFormChange}
                    color="primary"
                  />
                }
                label="Actieve gebruiker"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1" gutterBottom>
                {currentUser ? 'Wachtwoord wijzigen (optioneel)' : 'Wachtwoord instellen'}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Wachtwoord"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={userFormData.password}
                onChange={handleUserFormChange}
                error={!!formErrors.password}
                helperText={formErrors.password}
                required={!currentUser}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bevestig wachtwoord"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={userFormData.confirmPassword}
                onChange={handleUserFormChange}
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
                required={!currentUser}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUserDialogClose}>Annuleren</Button>
          <Button 
            onClick={handleUserFormSubmit} 
            variant="contained" 
            color="primary"
          >
            {currentUser ? 'Opslaan' : 'Toevoegen'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Verwijder bevestigingsdialoog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Gebruiker verwijderen</DialogTitle>
        <DialogContent>
          <Typography>
            Weet u zeker dat u de gebruiker "{userToDelete?.name}" wilt verwijderen?
            Deze actie kan niet ongedaan worden gemaakt.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Annuleren</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
          >
            Verwijderen
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserManagement;

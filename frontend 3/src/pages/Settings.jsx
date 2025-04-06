import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Tab,
  Tabs
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import BackupIcon from '@mui/icons-material/Backup';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import SaveIcon from '@mui/icons-material/Save';

function Settings() {
  const [tabValue, setTabValue] = useState(0);
  const [settings, setSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    notificationsEnabled: true,
    darkMode: false,
    language: 'nl',
  });
  
  const [users, setUsers] = useState([
    { id: 1, email: 'marco@marcovanthiel.nl', name: 'Marco van Thiel', role: 'admin', active: true },
    { id: 2, email: 'gebruiker@voorbeeld.nl', name: 'Test Gebruiker', role: 'readonly', active: true }
  ]);
  
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    role: 'readonly'
  });
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleNewUserChange = (field, value) => {
    setNewUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddUser = () => {
    // Validatie
    if (!newUser.email || !newUser.name) {
      setSnackbar({
        open: true,
        message: 'Vul alle verplichte velden in',
        severity: 'error'
      });
      return;
    }
    
    // In een echte applicatie zou hier een API call plaatsvinden
    setUsers(prev => [
      ...prev,
      { 
        id: Math.max(...prev.map(u => u.id)) + 1, 
        ...newUser, 
        active: true 
      }
    ]);
    
    setNewUser({
      email: '',
      name: '',
      role: 'readonly'
    });
    
    setSnackbar({
      open: true,
      message: 'Gebruiker toegevoegd',
      severity: 'success'
    });
  };

  const handleToggleUserStatus = (userId) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, active: !user.active } : user
    ));
  };

  const handleSaveSettings = () => {
    // In een echte applicatie zou hier een API call plaatsvinden
    setSnackbar({
      open: true,
      message: 'Instellingen opgeslagen',
      severity: 'success'
    });
  };

  const handleBackupNow = () => {
    // In een echte applicatie zou hier een API call plaatsvinden
    setSnackbar({
      open: true,
      message: 'Backup gestart',
      severity: 'info'
    });
  };

  const handleImport = () => {
    // In een echte applicatie zou hier een bestandsupload plaatsvinden
    setSnackbar({
      open: true,
      message: 'Import functionaliteit (simulatie)',
      severity: 'info'
    });
  };

  const handleExport = () => {
    // In een echte applicatie zou hier een bestandsdownload plaatsvinden
    setSnackbar({
      open: true,
      message: 'Export functionaliteit (simulatie)',
      severity: 'info'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Instellingen
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<PersonIcon />} label="Gebruikers" />
          <Tab icon={<BackupIcon />} label="Backup & Import/Export" />
          <Tab icon={<SettingsIcon />} label="Algemeen" />
        </Tabs>
      </Paper>

      {/* Gebruikers Tab */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Gebruikers Beheren
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List>
                {users.map(user => (
                  <ListItem key={user.id} divider>
                    <ListItemIcon>
                      <PersonIcon color={user.role === 'admin' ? 'primary' : 'action'} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={user.name} 
                      secondary={
                        <>
                          {user.email}
                          <br />
                          <Typography 
                            component="span" 
                            variant="body2" 
                            color={user.role === 'admin' ? 'primary' : 'text.secondary'}
                          >
                            {user.role === 'admin' ? 'Administrator' : 'Alleen-lezen'}
                          </Typography>
                        </>
                      } 
                    />
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={user.active} 
                          onChange={() => handleToggleUserStatus(user.id)}
                          color="primary"
                        />
                      }
                      label={user.active ? 'Actief' : 'Inactief'}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Nieuwe Gebruiker
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Naam"
                    value={newUser.name}
                    onChange={(e) => handleNewUserChange('name', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="E-mail"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => handleNewUserChange('email', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Rol</InputLabel>
                    <Select
                      value={newUser.role}
                      onChange={(e) => handleNewUserChange('role', e.target.value)}
                      label="Rol"
                    >
                      <MenuItem value="admin">Administrator</MenuItem>
                      <MenuItem value="readonly">Alleen-lezen</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    onClick={handleAddUser}
                  >
                    Gebruiker Toevoegen
                  </Button>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3 }}>
                <Alert severity="info">
                  Nieuwe gebruikers ontvangen een e-mail met instructies om hun wachtwoord in te stellen.
                </Alert>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Backup & Import/Export Tab */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Backup Instellingen
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <FormControlLabel
                control={
                  <Switch 
                    checked={settings.autoBackup} 
                    onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                    color="primary"
                  />
                }
                label="Automatische backup"
                sx={{ mb: 2, display: 'block' }}
              />
              
              {settings.autoBackup && (
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Backup frequentie</InputLabel>
                  <Select
                    value={settings.backupFrequency}
                    onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                    label="Backup frequentie"
                  >
                    <MenuItem value="daily">Dagelijks</MenuItem>
                    <MenuItem value="weekly">Wekelijks</MenuItem>
                    <MenuItem value="monthly">Maandelijks</MenuItem>
                  </Select>
                </FormControl>
              )}
              
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<BackupIcon />}
                onClick={handleBackupNow}
                fullWidth
              >
                Nu Backup Maken
              </Button>
              
              <Box sx={{ mt: 3 }}>
                <Alert severity="info">
                  Backups worden veilig opgeslagen en kunnen worden gebruikt om de database te herstellen indien nodig.
                </Alert>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Import / Export
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Importeren
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Importeer kunstwerken, kunstenaars of locaties vanuit Excel bestanden.
                      </Typography>
                      <Button 
                        variant="outlined" 
                        startIcon={<CloudUploadIcon />}
                        onClick={handleImport}
                        fullWidth
                      >
                        Importeren
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Exporteren
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Exporteer kunstwerken, kunstenaars of locaties naar Excel bestanden.
                      </Typography>
                      <Button 
                        variant="outlined" 
                        startIcon={<CloudDownloadIcon />}
                        onClick={handleExport}
                        fullWidth
                      >
                        Exporteren
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Algemene Instellingen Tab */}
      {tabValue === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Algemene Instellingen
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={settings.notificationsEnabled} 
                    onChange={(e) => handleSettingChange('notificationsEnabled', e.target.checked)}
                    color="primary"
                  />
                }
                label="E-mail notificaties inschakelen"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={settings.darkMode} 
                    onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                    color="primary"
                  />
                }
                label="Donkere modus"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Taal</InputLabel>
                <Select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  label="Taal"
                >
                  <MenuItem value="nl">Nederlands</MenuItem>
                  <MenuItem value="en">Engels</MenuItem>
                  <MenuItem value="de">Duits</MenuItem>
                  <MenuItem value="fr">Frans</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<SaveIcon />}
                onClick={handleSaveSettings}
              >
                Instellingen Opslaan
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Settings;

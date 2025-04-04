import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  TextField, 
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  Tabs,
  Tab
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import StorageIcon from '@mui/icons-material/Storage';
import EmailIcon from '@mui/icons-material/Email';
import SecurityIcon from '@mui/icons-material/Security';

// TabPanel component voor de verschillende instellingen
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function Settings() {
  const [tabValue, setTabValue] = useState(0);
  const [generalSettings, setGeneralSettings] = useState({
    appName: 'Kunstcollectie Beheer',
    companyName: 'Uw Bedrijf',
    logoUrl: '',
    defaultCurrency: 'EUR',
    dateFormat: 'DD-MM-YYYY',
    itemsPerPage: 10
  });
  
  const [appearanceSettings, setAppearanceSettings] = useState({
    primaryColor: '#3f51b5',
    secondaryColor: '#f50057',
    accentColor: '#4caf50',
    darkMode: false,
    compactMode: false,
    showWelcomeMessage: true
  });
  
  const [databaseSettings, setDatabaseSettings] = useState({
    backupFrequency: 'daily',
    backupTime: '02:00',
    retentionDays: 30,
    backupLocation: 'cloud',
    lastBackup: '2025-04-03T02:00:00Z'
  });
  
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: 'smtp.sendgrid.net',
    smtpPort: 587,
    smtpUsername: 'apikey',
    smtpPassword: '••••••••••••••••',
    senderEmail: 'noreply@kunstcollectie.nl',
    senderName: 'Kunstcollectie Beheer',
    enableEmailNotifications: true
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecial: true,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    twoFactorAuth: false
  });
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleGeneralSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleAppearanceSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAppearanceSettings({
      ...appearanceSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleDatabaseSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDatabaseSettings({
      ...databaseSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleEmailSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmailSettings({
      ...emailSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSecuritySettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecuritySettings({
      ...securitySettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const saveSettings = (settingsType) => {
    // In een echte applicatie zou dit een API call zijn om de instellingen op te slaan
    console.log(`Saving ${settingsType} settings`);
    
    // Toon een bevestigingsbericht (in een echte applicatie zou je een snackbar of toast gebruiken)
    alert(`${settingsType} instellingen zijn opgeslagen.`);
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
        <Typography variant="h5" component="h2" gutterBottom>
          Systeeminstellingen
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="settings tabs">
            <Tab icon={<SettingsIcon />} label="Algemeen" />
            <Tab icon={<ColorLensIcon />} label="Uiterlijk" />
            <Tab icon={<StorageIcon />} label="Database" />
            <Tab icon={<EmailIcon />} label="E-mail" />
            <Tab icon={<SecurityIcon />} label="Beveiliging" />
          </Tabs>
        </Box>
        
        {/* Algemene instellingen */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Algemene instellingen
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Applicatienaam"
                name="appName"
                value={generalSettings.appName}
                onChange={handleGeneralSettingsChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bedrijfsnaam"
                name="companyName"
                value={generalSettings.companyName}
                onChange={handleGeneralSettingsChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Logo URL"
                name="logoUrl"
                value={generalSettings.logoUrl}
                onChange={handleGeneralSettingsChange}
                placeholder="https://voorbeeld.nl/logo.png"
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Standaard valuta</InputLabel>
                <Select
                  name="defaultCurrency"
                  value={generalSettings.defaultCurrency}
                  onChange={handleGeneralSettingsChange}
                  label="Standaard valuta"
                >
                  <MenuItem value="EUR">Euro (€)</MenuItem>
                  <MenuItem value="USD">US Dollar ($)</MenuItem>
                  <MenuItem value="GBP">Britse Pond (£)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Datumformaat</InputLabel>
                <Select
                  name="dateFormat"
                  value={generalSettings.dateFormat}
                  onChange={handleGeneralSettingsChange}
                  label="Datumformaat"
                >
                  <MenuItem value="DD-MM-YYYY">DD-MM-YYYY</MenuItem>
                  <MenuItem value="MM-DD-YYYY">MM-DD-YYYY</MenuItem>
                  <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Items per pagina"
                name="itemsPerPage"
                type="number"
                value={generalSettings.itemsPerPage}
                onChange={handleGeneralSettingsChange}
                InputProps={{ inputProps: { min: 5, max: 100 } }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={() => saveSettings('Algemene')}
                >
                  Instellingen opslaan
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Uiterlijk instellingen */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Uiterlijk instellingen
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Primaire kleur"
                name="primaryColor"
                value={appearanceSettings.primaryColor}
                onChange={handleAppearanceSettingsChange}
                type="color"
                InputProps={{
                  startAdornment: (
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: appearanceSettings.primaryColor,
                        mr: 1
                      }}
                    />
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Secundaire kleur"
                name="secondaryColor"
                value={appearanceSettings.secondaryColor}
                onChange={handleAppearanceSettingsChange}
                type="color"
                InputProps={{
                  startAdornment: (
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: appearanceSettings.secondaryColor,
                        mr: 1
                      }}
                    />
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Accent kleur"
                name="accentColor"
                value={appearanceSettings.accentColor}
                onChange={handleAppearanceSettingsChange}
                type="color"
                InputProps={{
                  startAdornment: (
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: appearanceSettings.accentColor,
                        mr: 1
                      }}
                    />
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Switch
                    name="darkMode"
                    checked={appearanceSettings.darkMode}
                    onChange={handleAppearanceSettingsChange}
                    color="primary"
                  />
                }
                label="Donkere modus"
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Switch
                    name="compactMode"
                    checked={appearanceSettings.compactMode}
                    onChange={handleAppearanceSettingsChange}
                    color="primary"
                  />
                }
                label="Compacte modus"
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Switch
                    name="showWelcomeMessage"
                    checked={appearanceSettings.showWelcomeMessage}
                    onChange={handleAppearanceSettingsChange}
                    color="primary"
                  />
                }
                label="Toon welkomstbericht"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={() => saveSettings('Uiterlijk')}
                >
                  Instellingen opslaan
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Database instellingen */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Database instellingen
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Laatste backup
                  </Typography>
                  <Typography variant="h5">
                    {formatDate(databaseSettings.lastBackup)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Volgende backup
                  </Typography>
                  <Typography variant="h5">
                    {databaseSettings.backupFrequency === 'daily' ? 'Vandaag' : 
                     databaseSettings.backupFrequency === 'weekly' ? 'Deze week' : 'Deze maand'} om {databaseSettings.backupTime}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Backup frequentie</InputLabel>
                <Select
                  name="backupFrequency"
                  value={databaseSettings.backupFrequency}
                  onChange={handleDatabaseSettingsChange}
                  label="Backup frequentie"
                >
                  <MenuItem value="daily">Dagelijks</MenuItem>
                  <MenuItem value="weekly">Wekelijks</MenuItem>
                  <MenuItem value="monthly">Maandelijks</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Backup tijd"
                name="backupTime"
                type="time"
                value={databaseSettings.backupTime}
                onChange={handleDatabaseSettingsChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Bewaartermijn (dagen)"
                name="retentionDays"
                type="number"
                value={databaseSettings.retentionDays}
                onChange={handleDatabaseSettingsChange}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Backup locatie</InputLabel>
                <Select
                  name="backupLocation"
                  value={databaseSettings.backupLocation}
                  onChange={handleDatabaseSettingsChange}
                  label="Backup locatie"
                >
                  <MenuItem value="local">Lokaal</MenuItem>
                  <MenuItem value="cloud">Cloud</MenuItem>
                  <MenuItem value="both">Beide</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                >
                  Nu backup maken
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={() => saveSettings('Database')}
                >
                  Instellingen opslaan
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* E-mail instellingen */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                E-mail instellingen
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SMTP Server"
                name="smtpServer"
                value={emailSettings.smtpServer}
                onChange={handleEmailSettingsChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SMTP Poort"
                name="smtpPort"
                type="number"
                value={emailSettings.smtpPort}
                onChange={handleEmailSettingsChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SMTP Gebruikersnaam"
                name="smtpUsername"
                value={emailSettings.smtpUsername}
                onChange={handleEmailSettingsChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SMTP Wachtwoord"
                name="smtpPassword"
                type="password"
                value={emailSettings.smtpPassword}
                onChange={handleEmailSettingsChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Afzender e-mail"
                name="senderEmail"
                type="email"
                value={emailSettings.senderEmail}
                onChange={handleEmailSettingsChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Afzender naam"
                name="senderName"
                value={emailSettings.senderName}
                onChange={handleEmailSettingsChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="enableEmailNotifications"
                    checked={emailSettings.enableEmailNotifications}
                    onChange={handleEmailSettingsChange}
                    color="primary"
                  />
                }
                label="E-mailnotificaties inschakelen"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                >
                  Test e-mail versturen
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={() => saveSettings('E-mail')}
                >
                  Instellingen opslaan
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Beveiliging instellingen */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Beveiliging instellingen
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Wachtwoordbeleid
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Minimale wachtwoordlengte"
                name="passwordMinLength"
                type="number"
                value={securitySettings.passwordMinLength}
                onChange={handleSecuritySettingsChange}
                InputProps={{ inputProps: { min: 6 } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    name="passwordRequireUppercase"
                    checked={securitySettings.passwordRequireUppercase}
                    onChange={handleSecuritySettingsChange}
                    color="primary"
                  />
                }
                label="Hoofdletters vereist"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    name="passwordRequireNumbers"
                    checked={securitySettings.passwordRequireNumbers}
                    onChange={handleSecuritySettingsChange}
                    color="primary"
                  />
                }
                label="Cijfers vereist"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    name="passwordRequireSpecial"
                    checked={securitySettings.passwordRequireSpecial}
                    onChange={handleSecuritySettingsChange}
                    color="primary"
                  />
                }
                label="Speciale tekens vereist"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Sessie-instellingen
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Sessie timeout (minuten)"
                name="sessionTimeout"
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={handleSecuritySettingsChange}
                InputProps={{ inputProps: { min: 5 } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Max. inlogpogingen"
                name="maxLoginAttempts"
                type="number"
                value={securitySettings.maxLoginAttempts}
                onChange={handleSecuritySettingsChange}
                InputProps={{ inputProps: { min: 3 } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Switch
                    name="twoFactorAuth"
                    checked={securitySettings.twoFactorAuth}
                    onChange={handleSecuritySettingsChange}
                    color="primary"
                  />
                }
                label="Twee-factor authenticatie"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={() => saveSettings('Beveiliging')}
                >
                  Instellingen opslaan
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Box>
  );
}

export default Settings;

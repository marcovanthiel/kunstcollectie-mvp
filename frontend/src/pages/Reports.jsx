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
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import TableChartIcon from '@mui/icons-material/TableChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import FilterListIcon from '@mui/icons-material/FilterList';

function Reports() {
  const [reportType, setReportType] = useState('');
  const [format, setFormat] = useState('pdf');
  const [filters, setFilters] = useState({
    artistId: '',
    locationId: '',
    typeId: '',
    startDate: '',
    endDate: '',
    minValue: '',
    maxValue: ''
  });

  // Voorbeeld data voor filters
  const mockArtists = [
    { id: 1, name: 'Maria Pietersen' },
    { id: 2, name: 'Jan Jansen' },
    { id: 3, name: 'Pieter de Groot' },
    { id: 4, name: 'Anna Bakker' },
    { id: 5, name: 'Thomas Visser' }
  ];

  const mockLocations = [
    { id: 1, name: 'Expositieruimte' },
    { id: 2, name: 'Vergaderzaal' },
    { id: 3, name: 'Hoofdkantoor' },
    { id: 4, name: 'Entreehal' },
    { id: 5, name: 'Opslag' }
  ];

  const mockTypes = [
    { id: 1, name: 'Schilderij' },
    { id: 2, name: 'Sculptuur' },
    { id: 3, name: 'Fotografie' },
    { id: 4, name: 'Mixed Media' },
    { id: 5, name: 'Tekening' }
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };

  const handleFormatChange = (e) => {
    setFormat(e.target.value);
  };

  const handleGenerateReport = () => {
    // In een echte applicatie zou hier een API call plaatsvinden
    alert(`Rapport genereren: Type=${reportType}, Format=${format} (simulatie)`);
  };

  const reportTypes = [
    { 
      id: 'inventory', 
      name: 'Inventarisatie Overzicht', 
      description: 'Een volledig overzicht van alle kunstwerken in de collectie.',
      icon: <DescriptionIcon fontSize="large" />
    },
    { 
      id: 'value', 
      name: 'Waarde Rapportage', 
      description: 'Overzicht van de financiële waarde van de kunstcollectie.',
      icon: <TableChartIcon fontSize="large" />
    },
    { 
      id: 'artist', 
      name: 'Kunstenaars Analyse', 
      description: 'Analyse van kunstwerken gegroepeerd per kunstenaar.',
      icon: <BarChartIcon fontSize="large" />
    },
    { 
      id: 'location', 
      name: 'Locatie Overzicht', 
      description: 'Overzicht van kunstwerken per locatie.',
      icon: <PieChartIcon fontSize="large" />
    }
  ];

  const exportFormats = [
    { id: 'pdf', name: 'PDF' },
    { id: 'docx', name: 'Word (DOCX)' },
    { id: 'xlsx', name: 'Excel (XLSX)' },
    { id: 'xml', name: 'XML' }
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Rapportages
      </Typography>

      <Grid container spacing={3}>
        {/* Rapport Types */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Selecteer Rapport Type
          </Typography>
          <Grid container spacing={2}>
            {reportTypes.map((type) => (
              <Grid item xs={12} sm={6} key={type.id}>
                <Card 
                  elevation={reportType === type.id ? 3 : 1}
                  sx={{ 
                    cursor: 'pointer',
                    height: '100%',
                    bgcolor: reportType === type.id ? 'primary.50' : 'background.paper',
                    border: reportType === type.id ? '1px solid' : 'none',
                    borderColor: 'primary.main'
                  }}
                  onClick={() => setReportType(type.id)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ color: 'primary.main', mr: 2 }}>
                        {type.icon}
                      </Box>
                      <Typography variant="h6" component="h3">
                        {type.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {type.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Export Opties */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Export Opties
          </Typography>
          <Paper sx={{ p: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Export Formaat</InputLabel>
              <Select
                value={format}
                onChange={handleFormatChange}
                label="Export Formaat"
              >
                {exportFormats.map(format => (
                  <MenuItem key={format.id} value={format.id}>{format.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button 
                variant="outlined" 
                startIcon={<PrintIcon />}
                onClick={() => alert('Afdrukken (simulatie)')}
              >
                Afdrukken
              </Button>
              <Button 
                variant="contained" 
                startIcon={<FileDownloadIcon />}
                onClick={handleGenerateReport}
                disabled={!reportType}
              >
                Genereren
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Filters */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FilterListIcon sx={{ mr: 1 }} />
              <Typography variant="h6">
                Filters
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Kunstenaar</InputLabel>
                  <Select
                    name="artistId"
                    value={filters.artistId}
                    onChange={handleFilterChange}
                    label="Kunstenaar"
                  >
                    <MenuItem value="">Alle kunstenaars</MenuItem>
                    {mockArtists.map(artist => (
                      <MenuItem key={artist.id} value={artist.id}>{artist.name}</MenuItem>
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
                    <MenuItem value="">Alle locaties</MenuItem>
                    {mockLocations.map(location => (
                      <MenuItem key={location.id} value={location.id}>{location.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Type Kunstwerk</InputLabel>
                  <Select
                    name="typeId"
                    value={filters.typeId}
                    onChange={handleFilterChange}
                    label="Type Kunstwerk"
                  >
                    <MenuItem value="">Alle types</MenuItem>
                    {mockTypes.map(type => (
                      <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Datum vanaf"
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Datum tot"
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Minimale waarde"
                  type="number"
                  name="minValue"
                  value={filters.minValue}
                  onChange={handleFilterChange}
                  InputProps={{
                    startAdornment: <Typography variant="body2">€</Typography>
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Maximale waarde"
                  type="number"
                  name="maxValue"
                  value={filters.maxValue}
                  onChange={handleFilterChange}
                  InputProps={{
                    startAdornment: <Typography variant="body2">€</Typography>
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Rapport Voorbeeld */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Rapport Voorbeeld
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {reportType ? (
              <Box sx={{ 
                bgcolor: 'grey.100', 
                p: 3, 
                borderRadius: 1, 
                minHeight: 300,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {reportTypes.find(r => r.id === reportType)?.icon}
                <Typography variant="h6" sx={{ mt: 2 }}>
                  {reportTypes.find(r => r.id === reportType)?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                  In de uiteindelijke applicatie wordt hier een voorbeeld van het rapport weergegeven.
                  <br />
                  Klik op 'Genereren' om het rapport te exporteren.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                minHeight: 300
              }}>
                <Typography variant="body1" color="text.secondary">
                  Selecteer een rapport type om een voorbeeld te zien
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Reports;

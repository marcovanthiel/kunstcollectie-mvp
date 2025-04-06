import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Tab,
  Tabs,
  IconButton
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import GetAppIcon from '@mui/icons-material/GetApp';
import PrintIcon from '@mui/icons-material/Print';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import TableChartIcon from '@mui/icons-material/TableChart';

// TabPanel component voor de verschillende rapporttypes
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
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

function Reports() {
  const [tabValue, setTabValue] = useState(0);
  const [reportType, setReportType] = useState('inventory');
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });
  const [filters, setFilters] = useState({
    artistId: '',
    locationId: '',
    typeId: ''
  });
  const [artists, setArtists] = useState([]);
  const [locations, setLocations] = useState([]);
  const [artworkTypes, setArtworkTypes] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Simuleer het laden van filteropties
  useEffect(() => {
    // In een echte applicatie zouden deze gegevens van de API komen
    const mockArtists = [
      { id: 1, name: 'Vincent van Gogh' },
      { id: 2, name: 'Rembrandt van Rijn' },
      { id: 3, name: 'Auguste Rodin' },
      { id: 4, name: 'Pablo Picasso' },
      { id: 5, name: 'Claude Monet' }
    ];
    
    const mockLocations = [
      { id: 1, name: 'Hoofdkantoor' },
      { id: 2, name: 'Museum Modern' },
      { id: 3, name: 'Galerie Noord' },
      { id: 4, name: 'Depot Zuid' },
      { id: 5, name: 'Stedelijk Museum' }
    ];
    
    const mockArtworkTypes = [
      { id: 1, name: 'Schilderij' },
      { id: 2, name: 'Sculptuur' },
      { id: 3, name: 'Tekening' },
      { id: 4, name: 'Fotografie' },
      { id: 5, name: 'Installatie' }
    ];
    
    setArtists(mockArtists);
    setLocations(mockLocations);
    setArtworkTypes(mockArtworkTypes);
  }, []);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
    // Reset report data when changing report type
    setReportData(null);
  };
  
  const handleDateChange = (date, field) => {
    setDateRange({
      ...dateRange,
      [field]: date
    });
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  const generateReport = () => {
    setLoading(true);
    
    // Simuleer API vertraging
    setTimeout(() => {
      // Genereer verschillende mock data afhankelijk van het rapporttype
      let mockData;
      
      if (reportType === 'inventory') {
        mockData = {
          title: 'Inventarisrapport Kunstcollectie',
          date: new Date().toLocaleDateString('nl-NL'),
          totalItems: 92,
          totalValue: 1245000,
          items: [
            { id: 1, title: 'Zonnebloemen', artist: 'Vincent van Gogh', type: 'Schilderij', location: 'Hoofdkantoor', value: 15000000 },
            { id: 2, title: 'De Nachtwacht', artist: 'Rembrandt van Rijn', type: 'Schilderij', location: 'Museum Modern', value: 500000000 },
            { id: 3, title: 'De Denker', artist: 'Auguste Rodin', type: 'Sculptuur', location: 'Tuin', value: 8000000 },
            { id: 4, title: 'Guernica', artist: 'Pablo Picasso', type: 'Schilderij', location: 'Hoofdkantoor', value: 200000000 },
            { id: 5, title: 'Waterlelies', artist: 'Claude Monet', type: 'Schilderij', location: 'Museum Modern', value: 80000000 }
          ],
          summary: {
            byType: [
              { type: 'Schilderij', count: 65, value: 980000000 },
              { type: 'Sculptuur', count: 12, value: 120000000 },
              { type: 'Tekening', count: 8, value: 45000000 },
              { type: 'Fotografie', count: 5, value: 25000000 },
              { type: 'Installatie', count: 2, value: 75000000 }
            ],
            byLocation: [
              { location: 'Hoofdkantoor', count: 35, value: 450000000 },
              { location: 'Museum Modern', count: 25, value: 580000000 },
              { location: 'Galerie Noord', count: 8, value: 65000000 },
              { location: 'Depot Zuid', count: 20, value: 120000000 },
              { location: 'Uitgeleend', count: 4, value: 30000000 }
            ]
          }
        };
      } else if (reportType === 'value') {
        mockData = {
          title: 'Waarderapport Kunstcollectie',
          date: new Date().toLocaleDateString('nl-NL'),
          totalValue: 1245000000,
          insuranceValue: 1500000000,
          purchaseValue: 875000000,
          valueGrowth: 42.3,
          topItems: [
            { id: 2, title: 'De Nachtwacht', artist: 'Rembrandt van Rijn', purchaseValue: 350000000, currentValue: 500000000, growth: 42.9 },
            { id: 4, title: 'Guernica', artist: 'Pablo Picasso', purchaseValue: 150000000, currentValue: 200000000, growth: 33.3 },
            { id: 5, title: 'Waterlelies', artist: 'Claude Monet', purchaseValue: 50000000, currentValue: 80000000, growth: 60.0 },
            { id: 1, title: 'Zonnebloemen', artist: 'Vincent van Gogh', purchaseValue: 12000000, currentValue: 15000000, growth: 25.0 },
            { id: 3, title: 'De Denker', artist: 'Auguste Rodin', purchaseValue: 6000000, currentValue: 8000000, growth: 33.3 }
          ],
          valueByYear: [
            { year: 2020, value: 950000000 },
            { year: 2021, value: 1050000000 },
            { year: 2022, value: 1125000000 },
            { year: 2023, value: 1200000000 },
            { year: 2024, value: 1245000000 }
          ]
        };
      } else if (reportType === 'location') {
        mockData = {
          title: 'Locatierapport Kunstcollectie',
          date: new Date().toLocaleDateString('nl-NL'),
          totalLocations: 5,
          locations: [
            { 
              id: 1, 
              name: 'Hoofdkantoor', 
              address: 'Keizersgracht 123, Amsterdam', 
              itemCount: 35, 
              totalValue: 450000000,
              items: [
                { id: 1, title: 'Zonnebloemen', artist: 'Vincent van Gogh', type: 'Schilderij', value: 15000000 },
                { id: 4, title: 'Guernica', artist: 'Pablo Picasso', type: 'Schilderij', value: 200000000 }
              ]
            },
            { 
              id: 2, 
              name: 'Museum Modern', 
              address: 'Museumplein 10, Amsterdam', 
              itemCount: 25, 
              totalValue: 580000000,
              items: [
                { id: 2, title: 'De Nachtwacht', artist: 'Rembrandt van Rijn', type: 'Schilderij', value: 500000000 },
                { id: 5, title: 'Waterlelies', artist: 'Claude Monet', type: 'Schilderij', value: 80000000 }
              ]
            },
            { 
              id: 3, 
              name: 'Galerie Noord', 
              address: 'Prinsengracht 45, Amsterdam', 
              itemCount: 8, 
              totalValue: 65000000,
              items: []
            },
            { 
              id: 4, 
              name: 'Depot Zuid', 
              address: 'Industrieweg 78, Rotterdam', 
              itemCount: 20, 
              totalValue: 120000000,
              items: [
                { id: 3, title: 'De Denker', artist: 'Auguste Rodin', type: 'Sculptuur', value: 8000000 }
              ]
            },
            { 
              id: 5, 
              name: 'Uitgeleend', 
              address: 'Diverse locaties', 
              itemCount: 4, 
              totalValue: 30000000,
              items: []
            }
          ]
        };
      } else if (reportType === 'artist') {
        mockData = {
          title: 'Kunstenaarsrapport Kunstcollectie',
          date: new Date().toLocaleDateString('nl-NL'),
          totalArtists: 12,
          artists: [
            { 
              id: 1, 
              name: 'Vincent van Gogh', 
              itemCount: 3, 
              totalValue: 25000000,
              items: [
                { id: 1, title: 'Zonnebloemen', type: 'Schilderij', location: 'Hoofdkantoor', value: 15000000 },
                { id: 8, title: 'Sterrennacht', type: 'Schilderij', location: 'Museum Modern', value: 10000000 }
              ]
            },
            { 
              id: 2, 
              name: 'Rembrandt van Rijn', 
              itemCount: 2, 
              totalValue: 550000000,
              items: [
                { id: 2, title: 'De Nachtwacht', type: 'Schilderij', location: 'Museum Modern', value: 500000000 },
                { id: 9, title: 'Zelfportret', type: 'Schilderij', location: 'Depot Zuid', value: 50000000 }
              ]
            },
            { 
              id: 4, 
              name: 'Pablo Picasso', 
              itemCount: 4, 
              totalValue: 350000000,
              items: [
                { id: 4, title: 'Guernica', type: 'Schilderij', location: 'Hoofdkantoor', value: 200000000 }
              ]
            },
            { 
              id: 5, 
              name: 'Claude Monet', 
              itemCount: 2, 
              totalValue: 120000000,
              items: [
                { id: 5, title: 'Waterlelies', type: 'Schilderij', location: 'Museum Modern', value: 80000000 }
              ]
            },
            { 
              id: 3, 
              name: 'Auguste Rodin', 
              itemCount: 1, 
              totalValue: 8000000,
              items: [
                { id: 3, title: 'De Denker', type: 'Sculptuur', location: 'Depot Zuid', value: 8000000 }
              ]
            }
          ]
        };
      }
      
      setReportData(mockData);
      setLoading(false);
    }, 1500);
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('nl-NL', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Render verschillende rapportinhoud op basis van het type
  const renderReportContent = () => {
    if (!reportData) return null;
    
    if (reportType === 'inventory') {
      return (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2">
              {reportData.title}
            </Typography>
            <Typography variant="subtitle1">
              Gegenereerd op: {reportData.date}
            </Typography>
          </Box>
          
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Totaal aantal kunstwerken
                  </Typography>
                  <Typography variant="h4">
                    {reportData.totalItems}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Totale waarde
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(reportData.totalValue)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Gemiddelde waarde
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(reportData.totalValue / reportData.totalItems)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Aantal locaties
                  </Typography>
                  <Typography variant="h4">
                    {reportData.summary.byLocation.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Typography variant="h6" gutterBottom>
            Overzicht kunstwerken
          </Typography>
          
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Titel</TableCell>
                  <TableCell>Kunstenaar</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Locatie</TableCell>
                  <TableCell align="right">Waarde</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.artist}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell align="right">{formatCurrency(item.value)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Verdeling per type
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Aantal</TableCell>
                      <TableCell align="right">Waarde</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.summary.byType.map((item) => (
                      <TableRow key={item.type}>
                        <TableCell>{item.type}</TableCell>
                        <TableCell align="right">{item.count}</TableCell>
                        <TableCell align="right">{formatCurrency(item.value)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Verdeling per locatie
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Locatie</TableCell>
                      <TableCell align="right">Aantal</TableCell>
                      <TableCell align="right">Waarde</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.summary.byLocation.map((item) => (
                      <TableRow key={item.location}>
                        <TableCell>{item.location}</TableCell>
                        <TableCell align="right">{item.count}</TableCell>
                        <TableCell align="right">{formatCurrency(item.value)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Box>
      );
    } else if (reportType === 'value') {
      return (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2">
              {reportData.title}
            </Typography>
            <Typography variant="subtitle1">
              Gegenereerd op: {reportData.date}
            </Typography>
          </Box>
          
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Huidige waarde
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(reportData.totalValue)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Verzekerde waarde
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(reportData.insuranceValue)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Aankoopwaarde
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(reportData.purchaseValue)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Waardegroei
                  </Typography>
                  <Typography variant="h4">
                    {reportData.valueGrowth}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Typography variant="h6" gutterBottom>
            Top 5 meest waardevolle kunstwerken
          </Typography>
          
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Titel</TableCell>
                  <TableCell>Kunstenaar</TableCell>
                  <TableCell align="right">Aankoopwaarde</TableCell>
                  <TableCell align="right">Huidige waarde</TableCell>
                  <TableCell align="right">Groei %</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.topItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.artist}</TableCell>
                    <TableCell align="right">{formatCurrency(item.purchaseValue)}</TableCell>
                    <TableCell align="right">{formatCurrency(item.currentValue)}</TableCell>
                    <TableCell align="right">{item.growth}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Typography variant="h6" gutterBottom>
            Waardeontwikkeling per jaar
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Jaar</TableCell>
                  <TableCell align="right">Waarde</TableCell>
                  <TableCell align="right">Groei t.o.v. vorig jaar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.valueByYear.map((item, index) => {
                  const prevValue = index > 0 ? reportData.valueByYear[index - 1].value : null;
                  const growthPercent = prevValue ? ((item.value - prevValue) / prevValue * 100).toFixed(1) : '-';
                  
                  return (
                    <TableRow key={item.year}>
                      <TableCell>{item.year}</TableCell>
                      <TableCell align="right">{formatCurrency(item.value)}</TableCell>
                      <TableCell align="right">{growthPercent !== '-' ? `${growthPercent}%` : '-'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      );
    } else if (reportType === 'location') {
      return (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2">
              {reportData.title}
            </Typography>
            <Typography variant="subtitle1">
              Gegenereerd op: {reportData.date}
            </Typography>
          </Box>
          
          <Typography variant="h6" gutterBottom>
            Overzicht locaties
          </Typography>
          
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Locatie</TableCell>
                  <TableCell>Adres</TableCell>
                  <TableCell align="right">Aantal kunstwerken</TableCell>
                  <TableCell align="right">Totale waarde</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.locations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell>{location.name}</TableCell>
                    <TableCell>{location.address}</TableCell>
                    <TableCell align="right">{location.itemCount}</TableCell>
                    <TableCell align="right">{formatCurrency(location.totalValue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {reportData.locations.map((location) => (
            location.items.length > 0 && (
              <Box key={location.id} sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Kunstwerken in {location.name}
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Titel</TableCell>
                        <TableCell>Kunstenaar</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell align="right">Waarde</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {location.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.title}</TableCell>
                          <TableCell>{item.artist}</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell align="right">{formatCurrency(item.value)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )
          ))}
        </Box>
      );
    } else if (reportType === 'artist') {
      return (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2">
              {reportData.title}
            </Typography>
            <Typography variant="subtitle1">
              Gegenereerd op: {reportData.date}
            </Typography>
          </Box>
          
          <Typography variant="h6" gutterBottom>
            Overzicht kunstenaars
          </Typography>
          
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Kunstenaar</TableCell>
                  <TableCell align="right">Aantal kunstwerken</TableCell>
                  <TableCell align="right">Totale waarde</TableCell>
                  <TableCell align="right">Gemiddelde waarde</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.artists.map((artist) => (
                  <TableRow key={artist.id}>
                    <TableCell>{artist.name}</TableCell>
                    <TableCell align="right">{artist.itemCount}</TableCell>
                    <TableCell align="right">{formatCurrency(artist.totalValue)}</TableCell>
                    <TableCell align="right">{formatCurrency(artist.totalValue / artist.itemCount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {reportData.artists.map((artist) => (
            artist.items.length > 0 && (
              <Box key={artist.id} sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Kunstwerken van {artist.name}
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Titel</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Locatie</TableCell>
                        <TableCell align="right">Waarde</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {artist.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.title}</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell align="right">{formatCurrency(item.value)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )
          ))}
        </Box>
      );
    }
    
    return null;
  };
  
  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Rapportages
        </Typography>
        
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Rapporten genereren" />
          <Tab label="Opgeslagen rapporten" />
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Rapport type</InputLabel>
                <Select
                  value={reportType}
                  onChange={handleReportTypeChange}
                  label="Rapport type"
                >
                  <MenuItem value="inventory">Inventarisrapport</MenuItem>
                  <MenuItem value="value">Waarderapport</MenuItem>
                  <MenuItem value="location">Locatierapport</MenuItem>
                  <MenuItem value="artist">Kunstenaarsrapport</MenuItem>
                </Select>
              </FormControl>
              
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Typography variant="subtitle1" gutterBottom>
                  Periode
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <DatePicker
                      label="Startdatum"
                      value={dateRange.startDate}
                      onChange={(date) => handleDateChange(date, 'startDate')}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <DatePicker
                      label="Einddatum"
                      value={dateRange.endDate}
                      onChange={(date) => handleDateChange(date, 'endDate')}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>
              
              <Typography variant="subtitle1" gutterBottom>
                Filters
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
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
              
              <FormControl fullWidth sx={{ mb: 2 }}>
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
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Type kunstwerk</InputLabel>
                <Select
                  name="typeId"
                  value={filters.typeId}
                  onChange={handleFilterChange}
                  label="Type kunstwerk"
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
              
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={generateReport}
                disabled={loading}
              >
                {loading ? 'Rapport genereren...' : 'Genereer rapport'}
              </Button>
            </Grid>
            
            <Grid item xs={12} md={8}>
              {loading ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography>Rapport genereren...</Typography>
                </Box>
              ) : reportData ? (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<PictureAsPdfIcon />}
                      sx={{ mr: 1 }}
                    >
                      PDF
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<GetAppIcon />}
                      sx={{ mr: 1 }}
                    >
                      Excel
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<PrintIcon />}
                    >
                      Afdrukken
                    </Button>
                  </Box>
                  
                  <Paper variant="outlined" sx={{ p: 3 }}>
                    {renderReportContent()}
                  </Paper>
                </Box>
              ) : (
                <Box sx={{ p: 3, textAlign: 'center', border: '1px dashed #ccc', borderRadius: 1 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Geen rapport gegenereerd
                  </Typography>
                  <Typography color="text.secondary">
                    Selecteer een rapport type en klik op 'Genereer rapport' om een rapport te maken.
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Opgeslagen rapporten
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Rapport naam</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Aangemaakt op</TableCell>
                  <TableCell>Aangemaakt door</TableCell>
                  <TableCell align="right">Acties</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Kwartaalrapport Q1 2025</TableCell>
                  <TableCell>Inventarisrapport</TableCell>
                  <TableCell>01-04-2025</TableCell>
                  <TableCell>Admin</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary">
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton size="small" color="primary">
                      <PictureAsPdfIcon />
                    </IconButton>
                    <IconButton size="small" color="primary">
                      <GetAppIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jaarlijkse waardebepaling 2024</TableCell>
                  <TableCell>Waarderapport</TableCell>
                  <TableCell>31-12-2024</TableCell>
                  <TableCell>Admin</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary">
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton size="small" color="primary">
                      <PictureAsPdfIcon />
                    </IconButton>
                    <IconButton size="small" color="primary">
                      <GetAppIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Locatie-inventarisatie Hoofdkantoor</TableCell>
                  <TableCell>Locatierapport</TableCell>
                  <TableCell>15-03-2025</TableCell>
                  <TableCell>Admin</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary">
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton size="small" color="primary">
                      <PictureAsPdfIcon />
                    </IconButton>
                    <IconButton size="small" color="primary">
                      <GetAppIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>
    </Box>
  );
}

export default Reports;

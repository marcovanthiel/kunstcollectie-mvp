import React from 'react';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import PaletteIcon from '@mui/icons-material/Palette';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useNavigate } from 'react-router-dom';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: '100%',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  },
}));

const IconWrapper = styled(Box)(({ theme, color }) => ({
  backgroundColor: color,
  borderRadius: '50%',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '& .MuiSvgIcon-root': {
    fontSize: 40,
    color: 'white',
  },
}));

const StatCard = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: '100%',
}));

function Dashboard() {
  const navigate = useNavigate();

  // Deze data zou normaal van de API komen
  const stats = {
    totalArtworks: 156,
    totalArtists: 42,
    totalLocations: 8,
    totalValue: '€ 1.245.600',
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      {/* Statistieken */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard elevation={2}>
            <Typography variant="h6" color="text.secondary">
              Kunstwerken
            </Typography>
            <Typography variant="h3" color="primary.main" sx={{ fontWeight: 'bold' }}>
              {stats.totalArtworks}
            </Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard elevation={2}>
            <Typography variant="h6" color="text.secondary">
              Kunstenaars
            </Typography>
            <Typography variant="h3" color="secondary.main" sx={{ fontWeight: 'bold' }}>
              {stats.totalArtists}
            </Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard elevation={2}>
            <Typography variant="h6" color="text.secondary">
              Locaties
            </Typography>
            <Typography variant="h3" color="success.main" sx={{ fontWeight: 'bold' }}>
              {stats.totalLocations}
            </Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard elevation={2}>
            <Typography variant="h6" color="text.secondary">
              Totale Waarde
            </Typography>
            <Typography variant="h3" color="text.primary" sx={{ fontWeight: 'bold' }}>
              {stats.totalValue}
            </Typography>
          </StatCard>
        </Grid>
      </Grid>

      {/* Snelkoppelingen */}
      <Typography variant="h5" component="h2" gutterBottom>
        Snelkoppelingen
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Item elevation={3}>
            <IconWrapper color="primary.main">
              <PaletteIcon />
            </IconWrapper>
            <Typography variant="h6" component="h3" gutterBottom>
              Kunstwerken
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Beheer uw kunstwerken, voeg nieuwe toe of wijzig bestaande.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate('/kunstwerken')}
              sx={{ mt: 'auto' }}
            >
              Bekijken
            </Button>
          </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Item elevation={3}>
            <IconWrapper color="secondary.main">
              <PersonIcon />
            </IconWrapper>
            <Typography variant="h6" component="h3" gutterBottom>
              Kunstenaars
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Beheer kunstenaars en bekijk hun geassocieerde kunstwerken.
            </Typography>
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={() => navigate('/kunstenaars')}
              sx={{ mt: 'auto' }}
            >
              Bekijken
            </Button>
          </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Item elevation={3}>
            <IconWrapper color="success.main">
              <LocationOnIcon />
            </IconWrapper>
            <Typography variant="h6" component="h3" gutterBottom>
              Locaties
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Beheer locaties waar uw kunstwerken zich bevinden.
            </Typography>
            <Button 
              variant="contained" 
              color="success" 
              onClick={() => navigate('/locaties')}
              sx={{ mt: 'auto' }}
            >
              Bekijken
            </Button>
          </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Item elevation={3}>
            <IconWrapper color="info.main">
              <AssessmentIcon />
            </IconWrapper>
            <Typography variant="h6" component="h3" gutterBottom>
              Rapportages
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Genereer en exporteer rapportages over uw kunstcollectie.
            </Typography>
            <Button 
              variant="contained" 
              color="info" 
              onClick={() => navigate('/rapportages')}
              sx={{ mt: 'auto' }}
            >
              Bekijken
            </Button>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;

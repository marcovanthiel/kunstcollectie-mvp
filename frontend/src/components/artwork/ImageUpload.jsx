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
  CardMedia,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function ImageUpload() {
  const [images, setImages] = useState([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // Simuleer bestaande afbeeldingen voor demo doeleinden
  useEffect(() => {
    // In een echte applicatie zouden deze van de API komen
    setImages([
      { 
        id: 1, 
        url: 'https://via.placeholder.com/300x200?text=Voorbeeld+Afbeelding+1',
        isPrimary: true,
        name: 'voorbeeld_afbeelding_1.jpg'
      },
      { 
        id: 2, 
        url: 'https://via.placeholder.com/300x200?text=Voorbeeld+Afbeelding+2',
        isPrimary: false,
        name: 'voorbeeld_afbeelding_2.jpg'
      }
    ]);
  }, []);
  
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setUploadProgress(0);
    setIsUploading(false);
  };
  
  const handleFileSelect = (event) => {
    // In een echte applicatie zou dit de bestanden uploaden naar de server
    // Voor demo doeleinden simuleren we het uploadproces
    
    const files = event.target.files;
    if (files.length > 0) {
      setIsUploading(true);
      
      // Simuleer upload voortgang
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          
          // Simuleer nieuwe afbeeldingen toevoegen
          const newImages = Array.from(files).map((file, index) => ({
            id: images.length + index + 1,
            url: URL.createObjectURL(file),
            isPrimary: false,
            name: file.name
          }));
          
          setImages([...images, ...newImages]);
          setIsUploading(false);
          handleCloseDialog();
        }
      }, 300);
    }
  };
  
  const handleSetPrimary = (index) => {
    setPrimaryImageIndex(index);
    
    // Update de isPrimary status van alle afbeeldingen
    const updatedImages = images.map((image, i) => ({
      ...image,
      isPrimary: i === index
    }));
    
    setImages(updatedImages);
  };
  
  const handleDeleteImage = (index) => {
    // Verwijder de afbeelding uit de lijst
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    // Als de primaire afbeelding is verwijderd, stel de eerste afbeelding in als primair
    if (index === primaryImageIndex && newImages.length > 0) {
      handleSetPrimary(0);
    } else if (index < primaryImageIndex) {
      // Als een afbeelding vóór de primaire afbeelding is verwijderd, pas de index aan
      setPrimaryImageIndex(primaryImageIndex - 1);
    }
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Afbeeldingen Beheren
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Afbeeldingen Toevoegen
        </Button>
      </Box>
      
      <Grid container spacing={2}>
        {images.map((image, index) => (
          <Grid item xs={12} sm={6} md={4} key={image.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={image.url}
                alt={`Afbeelding ${index + 1}`}
              />
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  {image.isPrimary ? (
                    <Chip label="Hoofdafbeelding" color="primary" size="small" />
                  ) : (
                    <Button 
                      size="small" 
                      onClick={() => handleSetPrimary(index)}
                    >
                      Als hoofdafbeelding instellen
                    </Button>
                  )}
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {image.name}
                  </Typography>
                </Box>
                <IconButton 
                  color="error" 
                  onClick={() => handleDeleteImage(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
        
        {images.length === 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <UploadIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Geen afbeeldingen toegevoegd
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<AddIcon />}
                onClick={handleOpenDialog}
                sx={{ mt: 2 }}
              >
                Afbeeldingen Toevoegen
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
      
      {/* Upload Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Afbeeldingen Uploaden</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            {!isUploading ? (
              <Box 
                sx={{ 
                  border: '2px dashed #ccc', 
                  borderRadius: 2, 
                  p: 3, 
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.02)'
                  }
                }}
                onClick={() => document.getElementById('file-upload').click()}
              >
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />
                <CloudUploadIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" gutterBottom>
                  Klik om afbeeldingen te selecteren of sleep ze hierheen
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ondersteunde formaten: JPG, PNG, GIF
                </Typography>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body1" gutterBottom>
                  Uploaden... {uploadProgress}%
                </Typography>
                <Box 
                  sx={{ 
                    height: 10, 
                    bgcolor: '#eee', 
                    borderRadius: 5, 
                    mt: 2, 
                    mb: 3,
                    position: 'relative'
                  }}
                >
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: `${uploadProgress}%`,
                      bgcolor: 'primary.main',
                      borderRadius: 5,
                      transition: 'width 0.3s ease'
                    }}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isUploading}>
            Annuleren
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ImageUpload;

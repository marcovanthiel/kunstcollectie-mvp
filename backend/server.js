// Extreem vereenvoudigde server.js voor Railway deployment
// Deze versie is specifiek ontworpen om poortconflicten te vermijden

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

// Initialiseer Express app
const app = express();

// Gebruik alleen de PORT die door Railway wordt toegewezen
// GEEN fallback port specificeren om conflicten te voorkomen
const PORT = process.env.PORT;

// Initialiseer Prisma client
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Basis route om te controleren of de server draait
app.get('/', (req, res) => {
  res.json({ 
    status: 'online', 
    message: 'Kunstcollectie API is actief',
    port: PORT,
    environment: process.env.NODE_ENV
  });
});

// Login route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Valideer input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email en wachtwoord zijn verplicht' });
    }
    
    // Zoek gebruiker
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    // Controleer of gebruiker bestaat
    if (!user) {
      return res.status(401).json({ error: 'Ongeldige inloggegevens' });
    }
    
    // Controleer wachtwoord
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Ongeldige inloggegevens' });
    }
    
    // Genereer JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'kunstcollectie_app_secret_key_2025',
      { expiresIn: '24h' }
    );
    
    // Stuur token terug
    res.json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error bij inloggen' });
  }
});

// Registratie route
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Valideer input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Naam, email en wachtwoord zijn verplicht' });
    }
    
    // Controleer of email al bestaat
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email is al in gebruik' });
    }
    
    // Hash wachtwoord
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Maak nieuwe gebruiker
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER'
      }
    });
    
    // Genereer JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'kunstcollectie_app_secret_key_2025',
      { expiresIn: '24h' }
    );
    
    // Stuur token terug
    res.status(201).json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error bij registratie' });
  }
});

// Middleware voor authenticatie
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Geen token gevonden' });
    }
    
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'kunstcollectie_app_secret_key_2025'
    );
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Ongeldige token' });
  }
};

// Beschermde route voor gebruikersinfo
app.get('/api/users/me', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Gebruiker niet gevonden' });
    }
    
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error bij ophalen gebruiker' });
  }
});

// Kunstwerken routes
app.get('/api/artworks', async (req, res) => {
  try {
    const artworks = await prisma.artwork.findMany();
    res.json(artworks);
  } catch (error) {
    console.error('Get artworks error:', error);
    res.status(500).json({ error: 'Server error bij ophalen kunstwerken' });
  }
});

app.get('/api/artworks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const artwork = await prisma.artwork.findUnique({
      where: { id }
    });
    
    if (!artwork) {
      return res.status(404).json({ error: 'Kunstwerk niet gevonden' });
    }
    
    res.json(artwork);
  } catch (error) {
    console.error('Get artwork error:', error);
    res.status(500).json({ error: 'Server error bij ophalen kunstwerk' });
  }
});

app.post('/api/artworks', authenticate, async (req, res) => {
  try {
    const { title, description, imageUrl, artist, year, price, sold } = req.body;
    
    // Valideer input
    if (!title || !artist) {
      return res.status(400).json({ error: 'Titel en artiest zijn verplicht' });
    }
    
    // Maak nieuw kunstwerk
    const artwork = await prisma.artwork.create({
      data: {
        title,
        description: description || '',
        imageUrl: imageUrl || '',
        artist,
        year: year || null,
        price: price || null,
        sold: sold || false,
        user: {
          connect: { id: req.user.id }
        }
      }
    });
    
    res.status(201).json(artwork);
  } catch (error) {
    console.error('Create artwork error:', error);
    res.status(500).json({ error: 'Server error bij aanmaken kunstwerk' });
  }
});

// Zoek route
app.get('/api/search', async (req, res) => {
  try {
    const { query, minPrice, maxPrice, sold } = req.query;
    
    const where = {};
    
    // Zoek op titel of artiest
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { artist: { contains: query, mode: 'insensitive' } }
      ];
    }
    
    // Filter op prijs
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    
    // Filter op verkocht status
    if (sold !== undefined) {
      where.sold = sold === 'true';
    }
    
    const artworks = await prisma.artwork.findMany({ where });
    res.json(artworks);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Server error bij zoeken' });
  }
});

// Start de server
if (PORT) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server draait op poort ${PORT}`);
    console.log(`Omgeving: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Database URL: ${process.env.DATABASE_URL ? 'Geconfigureerd' : 'Niet geconfigureerd'}`);
  });
} else {
  console.error('FOUT: Geen PORT omgevingsvariabele gevonden');
  console.error('De server kan niet starten zonder een PORT omgevingsvariabele');
  console.error('Stel de PORT omgevingsvariabele in via Railway dashboard');
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM ontvangen, server wordt afgesloten');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT ontvangen, server wordt afgesloten');
  await prisma.$disconnect();
  process.exit(0);
});

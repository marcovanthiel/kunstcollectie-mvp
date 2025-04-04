import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// JWT token generatie
export const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Wachtwoord hashen
export const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Wachtwoord vergelijken
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Middleware voor authenticatie
export const authenticateToken = (handler) => {
  return async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ error: 'Toegang geweigerd. Token ontbreekt.' });
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: 'Ongeldige token.' });
    }
  };
};

// Middleware voor admin rechten
export const requireAdmin = (handler) => {
  return async (req, res) => {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Toegang geweigerd. Admin rechten vereist.' });
      }
      
      return handler(req, res);
    } catch (error) {
      return res.status(500).json({ error: 'Server error.' });
    }
  };
};

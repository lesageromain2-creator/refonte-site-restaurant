// backend/server.js
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration session
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'votre_secret_key',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24h
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/dishes', require('./routes/dishes'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/menus', require('./routes/menus'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/settings', require('./routes/settings'));

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API fonctionnelle' });
});

// Gestion d'erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Erreur serveur'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

module.exports = app;
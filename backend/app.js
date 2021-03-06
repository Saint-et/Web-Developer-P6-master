const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const rateLimit = require('express-rate-limit')
const expressValidator = require('express-validator');
//Utilisation de la variable d'environnement
require("dotenv").config({path: "./env/.env"});


//route à suivre depuis le backend
const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

// Connection à la Base de donné (DATAbase)
mongoose.connect(process.env.DATABASE,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  const app = express();

  app.use(express.json());


//Erreurs de CORS _ accepte les requête entre server avec une adresse différente
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


//route à suivre depuis l'api
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;
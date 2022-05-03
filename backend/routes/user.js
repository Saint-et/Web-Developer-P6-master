//utilisation d'express
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

// inscription
router.post('/signup', userCtrl.signup);
// connexion
router.post('/login', userCtrl.login);

module.exports = router;
//utilisation d'express
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const rateLimit = require('express-rate-limit')


const createAccountLimiter = rateLimit({
	windowMs: 60000, // 1 min
	max: 3, // Limit each IP to 5 create account requests per `window` (here, per hour)
	message:
		'Too many accounts created from this IP, please try again after an hour',
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})


// inscription
router.post('/signup', userCtrl.signup);
// connexion
router.post('/login',createAccountLimiter, userCtrl.login);

module.exports = router;
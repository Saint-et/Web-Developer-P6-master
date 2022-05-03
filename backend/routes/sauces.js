//utilisation d'express
const express = require('express');
const router = express.Router();

//middleware d'authentification
const auth = require('../middleware/auth');

//middleware pour les images avec multer
const multer = require('../middleware/multer-config');

//les routes pour le controller des sauces
const stuffCtrl = require('../controllers/sauces');


// obtenir toutes les sauces
router.get('/', auth, stuffCtrl.getAllSauces);
// creation d'une sauce
router.post('/', auth, multer, stuffCtrl.createSauce);
// obtenir une sauce
router.get('/:id', auth, stuffCtrl.getOneSauce);
// modification d'une sauce
router.put('/:id', auth, multer, stuffCtrl.modifySauce);
// supression d'une sauce
router.delete('/:id', auth, stuffCtrl.deleteSauce);
// like et dislike
router.post('/:id/like', auth, stuffCtrl.like);


module.exports = router;
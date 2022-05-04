//récupération du Schema des sauces
const Sauce = require('../models/createSauce');

// fs signifie <file system> accès au fichier
const fs = require('fs');

//récupération de toutes les sauces
exports.getAllSauces = async (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
    
}
//récupération d'une sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
}

//création des par l'utilisateur sauces
exports.createSauce = (req, res, next) => {
  const thingObject = JSON.parse(req.body.sauce);
  
  const sauce = new Sauce({
    ...thingObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

//modification d'une sauce
exports.modifySauce = (req, res, next) => {
  
  //supression d'une image en cas de changement
  if (req.file) {
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, (error) => {
      if(error) throw error;
    })
    
  })
  .catch(error => res.status(400).json({ error }));
} else {
  console.log("False");
}

//opérateur ternaire changement sans image ou avec image
  const sauceimg = req.file ?
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : {
    ...req.body
  }

  //mise à jour de la sauce
  Sauce.updateOne({_id: req.params.id}, { ...sauceimg, _id: req.params.id })
    .then(() => res.status(200).json({
    message: 'Objet modifié !',
    contenu: sauceimg
  }))
    .catch(error => res.status(400).json({ error }));
}

//supression d'une sauce et de son image
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {

        //supression de la sauce
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};


//Ajout de like ou dislike
exports.like = (req, res, next) => {

//trouver la sauce dans la base de données
Sauce.findOne({_id : req.params.id})
    .then((promise) => {

      //LIKES

      //ajout du like et du usersLiked
      if(!promise.usersLiked.includes(req.body.userId) && (req.body.like) === 1){
        
        Sauce.updateOne(
           {_id : req.params.id},
           {$inc: {likes: 1},
           $push: {usersLiked: req.body.userId}
          })
      .then(() => res.status(201).json({ message: 'like ajouté'}))
      .catch(error => res.status(400).json({ error }));
      }
      
      //supression du like et du usersLiked
      if(promise.usersLiked.includes(req.body.userId) && (req.body.like) === 0){
        Sauce.updateOne(
          {_id : req.params.id},
          {$inc: {likes: -1},
          $pull: {usersLiked: req.body.userId}
         })
     .then(() => res.status(201).json({ message: 'like retiré'}))
     .catch(error => res.status(400).json({ error }));
      };

      //DISLIKES

      //ajout du dislike et du usersDisliked
      if(!promise.usersDisliked.includes(req.body.userId) && (req.body.like) === -1){
        
        Sauce.updateOne(
           {_id : req.params.id},
           {$inc: {dislikes: 1},
           $push: {usersDisliked: req.body.userId}
          })
      .then(() => res.status(201).json({ message: 'dislike ajouté'}))
      .catch(error => res.status(400).json({ error }));
      }
     
      //supression du dislike et du usersDisliked
      if(promise.usersDisliked.includes(req.body.userId) && (req.body.like) === 0){
        Sauce.updateOne(
          {_id : req.params.id},
          {$inc: {dislikes: -1},
          $pull: {usersDisliked: req.body.userId}
         })
     .then(() => res.status(201).json({ message: 'dislike retiré'}))
     .catch(error => res.status(400).json({ error }));
      };


    })
    .catch(error => res.status(400).json({ error }));
}
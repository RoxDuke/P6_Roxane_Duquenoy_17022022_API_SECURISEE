const Thing = require('../models/thing.model');
const fs = require('fs');

//Création d'une sauce
exports.createThing = (req, res, next) => {
  const thingObject = JSON.parse(req.body.sauce);
  console.log(thingObject);
  delete thingObject._id;
  const thing = new Thing({
    ...thingObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    
  });
  thing.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};
//Récupérer une sauce 
exports.getOneThing = (req, res, next) => {
  Thing.findOne({_id: req.params.id}).then((thing) => {
      res.status(200).json(thing);
    }
  ).catch((error) => {
      res.status(404).json({error: error});
    });
};
//Modification d'une sauce 
exports.modifyThing = (req, res, next) => {
  //L'utilisateur à mis à jour l'image ou pas: 1 >reçoit les données JSON, 2 > reçoit l'élément form data
  const thingObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};
//Suppression d'une sauce 
exports.deleteThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then(thing => {
      const filename = thing.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Thing.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};
//Récupérer toutes les sauces 
exports.getAllStuff = (req, res, next) => {
  Thing.find().then((things) => {
      res.status(200).json(things);
    }
  ).catch((error) => {
      res.status(400).json({error: error});
    });
};
//Aimer une sauce
exports.likeASauce = function (request, response, next) {
  Sauce.findOne({ _id: request.params.id })
    .then(function (sauce) {
      switch (request.body.like) {
        // Like = 1 => L'utilisateur aime la sauce (like = +1)
        case 1:
          if (!sauce.usersLiked.includes(request.body.userId) && request.body.like === 1) {
            Sauce.updateOne({ _id: request.params.id },
              {
                $inc: { likes: 1 }, $push: { usersLiked: request.body.userId }
              })
              .then(function () {
                response.status(201).json({ message: "La sauce a été likée !" });
              })
              .catch(function (error) {
                response.status(400).json({ error: error });
              });
          }
          break;
//L'utilisateur n'aime pas la sauce 
        case -1:
          if (!sauce.usersDisliked.includes(request.body.userId) && request.body.like === -1) {
            Sauce.updateOne({ _id: request.params.id },
              { $inc: { dislikes: 1 }, $push: { usersDisliked: request.body.userId }, }
            )
              .then(function () {
                response.status(201).json({ message: "La sauce a été dislikée !" });
              })
              .catch(function (error) {
                response.status(400).json({ error: error });
              });
          }
          break;
//Annulation du like par l'utilisateur
        case 0:
          if (sauce.usersLiked.includes(request.body.userId)) {
            Sauce.updateOne({ _id: request.params.id },
              { $inc: { likes: -1 }, $pull: { usersLiked: request.body.userId }, }
            )
              .then(function () {
                response.status(201).json({ message: "Le like de la sauce a été annulé !" });
              })
              .catch(function (error) {
                response.status(400).json({ error: error });
              });
          }
//Annulation du dislike 
          if (sauce.usersDisliked.includes(request.body.userId)) {
            Sauce.updateOne(
              { _id: request.params.id },
              { $inc: { dislikes: -1 }, $pull: { usersDisliked: request.body.userId }, }
            )
              .then(function () {
                response.status(201).json({ message: "Le dislike de la sauce a été annulé !" });
              })
              .catch(function (error) {
                response.status(400).json({ error: error });
              });
          }
          break;
      }
    })
    .catch(function (error) {
      response.status(404).json({ error: error });
    });
};
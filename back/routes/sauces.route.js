const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauces.controller');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//Création des routes (CRUD: Create Read Update Delete)
router.get('/', auth, sauceCtrl.getAllStuff);
router.post('/', auth, multer, sauceCtrl.createThing);
router.get('/:id', auth, sauceCtrl.getOneThing);
router.put('/:id', auth, multer, sauceCtrl.modifyThing);
router.delete('/:id',auth, sauceCtrl.deleteThing);
router.post("/:id/like", auth, sauceCtrl.likeASauce);

module.exports = router;
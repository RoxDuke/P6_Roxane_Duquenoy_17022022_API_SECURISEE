const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user.controller');
const mail = require("../middleware/mail");
const pwd = require('../middleware/pwd');
const connexion = require('../middleware/connexion');

router.post('/signup', pwd, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
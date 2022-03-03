require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const helmet = require('helmet');
const path = require('path');
const saucesRoutes = require('./routes/sauces.route');
const userRoutes = require("./routes/user.route");
const mongo_pwd = process.env.MONGODB_PASSWORD;
const mongo_name = process.env.MONGODB_NAME;
const mongo_data = process.env.MONGODB_DATABESE;

const cors = require("cors");
let corsOptions = {
  origin: "http://localhost:8081"
};

//Connexion à la base de données
mongoose.connect(`mongodb+srv://Roxane:${mongo_pwd}@${mongo_name}.mongodb.net/${mongo_data}retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Permet de sécuriser nos en-têtes HTPP
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

//Sécurité CORS, s'appliquant sur toutes les routes
//Sécurise les en-têtes HTTP de notre app Express
app.use(function (req, response, next) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});
app.use(cors(corsOptions));
//Gestion des requêtes POST
app.use(express.json());
//Middleware qui sert le dossier images
app.use('/images', express.static(path.join(__dirname, 'images')));
//Enregistrement du routeur
app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);

module.exports = app;
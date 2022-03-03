const jwt = require('jsonwebtoken');

//Vérifie le token en fonction du ID
//
module.exports = (req, res, next) => {
  try {
    //Retourne un tableau, vérifie le TOKEN, récupère l'userID
    //En tête AUTHORIZATION
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    req.auth = { userId };
    //Si le corps de la requête comporte un userId, on vérifie le userId correspond au token
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};
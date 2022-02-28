const dotenv = require("dotenv");
dotenv.config();

const http = require('http');
const { exit } = require('process');
const app = require('./app');
//Require pour importer le package

//Renvoi du port valide, sous la forme d'un numéro ou d'une chaîne
const normalizePort = val => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    if (isNaN(val)) {
      return false
    }
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000');
if (port == false) {
  console.log("Error invalid port number, it must be an integer and be > 0")
  exit()
}
app.set('port', port);

//Différentes erreurs + gestion de celles-ci 
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};


//Enregistré dans le serveur 
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
// const req = require('express/lib/request');
const multer = require('multer');
//Création d'un dictionnaire 
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}
//Enregistrement des fichiers, configuration de multer 
const storage = multer.diskStorage({
    destination: (req,file, callback) => {
        //nom du dossier ou se trouve les images ?? 
        callback(null, '')
    },
    //Nom de fichier à utiliser par multer 
    filename: (req, file, callback) => {
        const name = file.originalname.split('').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage}).single('image');
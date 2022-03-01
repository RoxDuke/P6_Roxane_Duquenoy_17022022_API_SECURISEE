const passwordValidator = require("password-validator"); 

// Création du schéma du mot de passe
const passwordSchema = new passwordValidator();

// Le schéma que doit respecter le mot de passe
passwordSchema
    .is()
    //Longueur minimal 8
    .min(8)
    .is()
    //Longueur maximal 20
    .max(20)
    .has()
    //Lettres majuscules
    .uppercase(1)
    .has()
    //Lettres minuscules
    .lowercase()
    .has()
    //1 chiffre minimum
    .digits(1)
    .has()
    .not()
    //Pas d'espaces
    .spaces()
    .is()
    .not()
    //Mdp interdits
    .oneOf(["Passw0rd", "Password123"]);

//Vérification du mot de passe
module.exports = function (req, res, next) {
    if (!passwordSchema.validate(req.body.password)) {
        return response.status(400).json({
            message:
                "Le mot de passe doit contenir entre 6 et 20 caractères, avec au moins une majuscule et un chiffre !",
        });
    } else {
        next();
    }
};

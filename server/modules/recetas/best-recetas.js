const mongose = require('mongoose');
const recetasShema = new mongose.Schema({
    responsableReceta:                {type: String},
    compuesto:                        {type: String},
    receta:                           {type: String},
    bolsaRecetaTamanio:               {type: String},
    materiaPrimaReceta:               {type: Array},  //Peso especificacion, Orden, Peso Minimo permitido, Peso Maximo permitido.
})
module.exports = mongose.model('recetas', recetasShema)
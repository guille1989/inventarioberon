const mongose = require('mongoose');
const mpShema = new mongose.Schema({
    materiaPrima:                           {type: String},
    pesoMateriaPrimaStock:                  {type: Number},
    pesoMateriaPrimaProduction:             {type: Number},
    pesoMateriaPrimaDesperdicio:            {type: Number},
    loteMateriaPrima:                       {type: String},
    pesoBulto:                              {type: Number},
    bultosEstiba:                           {type: Number},
    fechaEntrada:                           {type: Date},
    fechaVencimiento:                       {type: String},
    tieneExtencionFechaVencimiento:         {type: Boolean},
    responsableRecepcion:                   {type: String},
    consecutivo:                            {type: String},
})
module.exports = mongose.model('mps', mpShema)
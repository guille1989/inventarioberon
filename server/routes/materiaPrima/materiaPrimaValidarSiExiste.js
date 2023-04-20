const express = require('express');
const route = express();
const MateriaPrima = require('../../modules/materiaPrima/mp-model');

//GET
route.get('/:mt', (req, res) => {

    let mtAux = req.params.mt;

    let result = leerMateriaPrima(mtAux);
    result
        .then(mp => {
            res.json({
                mps: mp
            })
        })
        .catch(err => 
            res.json({
                error: 'Error en server ' + err
            }))

})

async function leerMateriaPrima(mtAux){

    let result = await MateriaPrima.find({"materiaPrima": mtAux});
    return result
    
}

module.exports = route;
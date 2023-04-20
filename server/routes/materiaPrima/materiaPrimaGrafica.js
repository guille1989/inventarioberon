const express = require('express');
const route = express();
const MateriaPrima = require('../../modules/materiaPrima/mp-model');

//GET
route.get('/', (req, res) => {

    let result = leerMateriaPrima();
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

async function leerMateriaPrima(){

    //let result = await MateriaPrima.find();

    //console.log(result)

    let resultAcum = await MateriaPrima.aggregate([
        { 
            $group:
                {
                    '_id': '$materiaPrima', 
                    totalMateriaPrima: { $sum: '$pesoMateriaPrimaStock'},
                    count: {$sum: 1} 
                } 
        },
        { 
            $sort : { totalMateriaPrima : -1} 
        }
        ])

    //console.log(resultAcum)
    return resultAcum
    
}

module.exports = route
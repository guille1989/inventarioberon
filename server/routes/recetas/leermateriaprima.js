const express = require('express');
const route = express();
const MateriaPrima = require('../../modules/materiaPrima/mp-model');
const RecetaModel = require('../../modules/recetas/best-recetas');

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

    //let result = await MateriaPrima.distinct('materiaPrima').sort();

    let resultRecetas = await RecetaModel.find()

    let result = await MateriaPrima.aggregate([
        { "$group": {
            "_id": "$materiaPrima",
            "count": { "$sum": 1 }
        }},
        { "$match": {
            "count": { "$gt": 0 }
        }}
    ]).sort({_id: 1})

    return {result, resultRecetas}
    
}

//POST

route.post('/', (req, res) => {
    let body = req.body;

    let result = IngresarReceta(body);

    result
        .then(msj => {
            res.json({
                receta_msj: msj
            })
        })
        .catch(err => {
            res.json({
                receta_err: err
            })
        })
})

async function IngresarReceta(body){

    let result = new RecetaModel({
        responsableReceta:                body.responsableReceta,
        compuesto:                        body.compuesto,
        receta:                           body.receta,
        bolsaRecetaTamanio:               body.bolsaRecetaTamanio,
        materiaPrimaReceta:               body.materiaPrimaReceta, 
    })

    return await result.save()
};

module.exports = route
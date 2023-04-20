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

    let result = await MateriaPrima.find();
    return result
    
}

//POST
route.post('/', (req, res) => {

    let body = req.body;

    let result = ingresarMateriaPrima(body);

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

async function ingresarMateriaPrima(body){

    //Revisamos si el nombre de la materia prima existe para asignar consecutivo:
    let materiaPrimaNombre = body.materiaPrima;

    let resultValidacionMP = await MateriaPrima.find({"materiaPrima" : materiaPrimaNombre});
    let consecutivoAux = materiaPrimaNombre + "_" + resultValidacionMP.length

    if(resultValidacionMP === []){
        //Existe la materia prima
        return `${materiaPrimaNombre} ya se encuentra un registro, por favor ajustar el nombre`
    }else{
        //No existe la materia prima
        //Se procede a ingresar
        let newMP = new MateriaPrima({
            materiaPrima:                           body.materiaPrima,
            pesoMateriaPrimaStock:                  parseInt(body.pesoMateriaPrimaStock),
            loteMateriaPrima:                       body.loteMateriaPrima,
            pesoBulto:                              parseInt(body.pesoBulto),
            bultosEstiba:                           parseInt(body.bultosEstiba),
            fechaEntrada:                           body.fechaEntrada,
            fechaVencimiento:                       body.fechaVencimiento,
            tieneExtencionFechaVencimiento:         false,
            responsableRecepcion:                   body.responsableRecepcion.toUpperCase(),
            consecutivo:                            consecutivoAux,
        })

        return await newMP.save()
        //return 'MP guardada en DB'
    }

}

//PUT

route.put('/:mp_id', (req, res) => {

    let mp_id = req.params.mp_id;
    let body = req.body;

    let result = actualizarMp(mp_id, body);

    result
        .then(msj => {
            res.json({
                msj_put: msj
            })
        })
        .catch(error => {
            res.json({
                err_put: error
            })
        })
})

async function actualizarMp(mp_id, body){

    let result = []
    let resultAux = await MateriaPrima.find({_id: mp_id})
    let fechaVencimientoAux = resultAux[0].fechaVencimiento

    if(body.fechaVencimientoExtencion.localeCompare(fechaVencimientoAux.split(',').pop()) === 0){
        fechaVencimientoAux = fechaVencimientoAux
    }else{
        fechaVencimientoAux = fechaVencimientoAux + "," + body.fechaVencimientoExtencion
    }   

    if(body.tieneExtencionFechaVencimiento){
        result = await MateriaPrima.updateOne({_id: mp_id}, {$set: {
            materiaPrima:                           body.materiaPrima,
            pesoMateriaPrimaStock:                  parseInt(body.pesoMateriaPrimaStock),
            loteMateriaPrima:                       body.loteMateriaPrima,
            pesoBulto:                              parseInt(body.pesoBulto),
            bultosEstiba:                           parseInt(body.bultosEstiba),
            fechaEntrada:                           body.fechaEntrada,
            responsableRecepcion:                   body.responsableRecepcion,
            tieneExtencionFechaVencimiento:         body.tieneExtencionFechaVencimiento,
            fechaVencimiento:                       fechaVencimientoAux
        }})

    }else{
        result = await MateriaPrima.updateOne({_id: mp_id}, {$set: {
            materiaPrima:                           body.materiaPrima,
            pesoMateriaPrimaStock:                  parseInt(body.pesoMateriaPrimaStock),
            loteMateriaPrima:                       body.loteMateriaPrima,
            pesoBulto:                              parseInt(body.pesoBulto),
            bultosEstiba:                           parseInt(body.bultosEstiba),
            fechaEntrada:                           body.fechaEntrada,
            fechaVencimiento:                       body.fechaVencimiento,
            responsableRecepcion:                   body.responsableRecepcion,
            tieneExtencionFechaVencimiento:         body.tieneExtencionFechaVencimiento,
        }})
    }

    return result
}

//DELETE

route.delete('/:mp_id', (req, res) => {

    let mp_id = req.params.mp_id;

    let result = eliminarMp(mp_id);

    result
        .then(msj => {
            res.json({
                msj_delete: msj
            })
        })
        .catch(error => {
            res.json({
                err_delete: error
            })
        })
})

async function eliminarMp(mp_id){

    let = await MateriaPrima.deleteOne({_id: mp_id})

    return result
}

module.exports = route
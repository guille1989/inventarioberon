const express = require('express');
const route = express.Router();
const bcrypt = require('bcrypt');
const User = require('../modules/user_model');
const jwt = require('jsonwebtoken');

route.post('/', (req, res) => {
    User.findOne({user: req.body.user})
        .then(msj => {
            if(msj){
                const passwordTrue = bcrypt.compareSync(req.body.password, msj.password);
                if(!passwordTrue) return res.status(400).json({error: 'ok', msj: 'Usuario o contraseña incorrecta.'});
                const jwToken = jwt.sign({ _id: msj._id, user: msj.user }, 'andres_beron', { expiresIn: '12h' });
                res.json({
                    user: {
                        _id: msj._id,
                        user: msj.user
                    },
                    jwToken
                });
            }else{
                res.status(400).json({
                    error: 'ok',
                    msj: 'Usuario o contraseña incorrecta.'
                })
            }
        })
        .catch(msj_e => {
            res.status(400).json({
                error: 'ok',
                maj: 'Error en el server ' + msj_e
            })
        })
})

module.exports = route
const express = require('express');
const route = express.Router();
const bcrypt = require('bcrypt');
const User = require('../modules/user_model');

route.post('/', (req, res) => {
    user = req.body.user;
    password = req.body.password;

    const result = NewUser(user, password);

    result
    .then(msj => {
        res.json({
            NewUser : msj
        })
    })
    .catch(msj_e => {
        res.json({
            error: msj_e
        })
    })
})

async function NewUser(user, password){

    const new_user = new User ({
        user: user,
        password: bcrypt.hashSync( password, 10 )
    })

    return await new_user.save()
}

module.exports = route;
const mongose = require('mongoose');
const usersShema = new mongose.Schema({
    user:                           {type: String},
    password:                       {type: String},
})
module.exports = mongose.model('users', usersShema)
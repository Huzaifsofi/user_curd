const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    name: {type: String},
    age: {type: Number},
    email: {type: String, unique: true} 
})

User =  mongoose.model('User', UserSchema)

module.exports = User
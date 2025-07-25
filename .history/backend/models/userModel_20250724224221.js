const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name : String,
    email : {
        type : String,
        unique : true,
        required : true,
    },
    password : String,
    profilePic : String,
    phone : String,
    address : {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    role : {
        type : String,
        enum : ['GENERAL', 'ADMIN'],
        default : 'GENERAL'
    }
}, {
    timestamps : true
})


const User = mongoose.model('User', userSchema);


module.exports = User
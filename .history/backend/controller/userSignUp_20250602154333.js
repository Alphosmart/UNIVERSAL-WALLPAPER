const userModel = require("../model/userModel");
const bcrypt = require('bcrypt');


async function userSignUpController(req,res){
    try{
        const {email, password, name} = req.body

        if(!email){
            throw new Error("please provide email");
        }
        if(!password){
            throw new Error("please provide password");
        }
        if(!name){
            throw new Error("please provide name");
        }

        const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

        const userData = new userModel(req.body)


    }catch(err){
        res.json({
            message : err,
            error : true,
            success : false,
        })
    }
}
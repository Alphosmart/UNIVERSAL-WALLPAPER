const User = require('../models/userModel');
const bcrypt = require('bcrypt');


async function userSignUpController(req,res){
    try{
        const {email, password, name} = req.body
        
        console.log("req.body);

        if(!email){
            throw new Error("please provide email");
        }
        if(!password){
            throw new Error("please provide password");
        }
        if(!name){
            throw new Error("please provide name");
        }


        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPassword = await bcrypt.hashSync(password, salt);

        if(!hashPassword){
            throw new Error("Something is wrong");
        }

        const payload = {
            ...req.body,
            password : hashPassword,
        }

        const userData = new userModel(payload)
        const saveUser = await userData.save()

        res.status(201).json({
            data : saveUser,
            success : true,
            error : false,
            message : "User created successfully"
        })


    }catch(err){
        res.json({
            message : err,
            error : true,
            success : false,
        })
    }
}

module.exports = userSignUpController;
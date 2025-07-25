
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


        const userDate =
    }catch(err){
        res.json({
            message : err,
            error : true,
            success : false,
        })
    }
}
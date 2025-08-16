
async function userSignUpController(req,res){
    try{
        const {email, password, name} = req.body

        if(!email){
            throw
        }

    }catch(err){
        res.json({
            message : err,
            error : true,
            success : false,
        })
    }
}
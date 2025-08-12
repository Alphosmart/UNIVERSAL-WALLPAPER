
async function userSignUpController(req,res){
    try{
        const {email, password, name} = req.body

        if(!email){
            throw new Error(please [r])
        }

    }catch(err){
        res.json({
            message : err,
            error : true,
            success : false,
        })
    }
}
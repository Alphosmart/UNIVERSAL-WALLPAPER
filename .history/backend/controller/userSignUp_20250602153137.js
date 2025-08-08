
async function userSignUpController(req,res){
    try{
        const {email, password, name} = req.body

        
    }catch(err){
        res.json({
            message : err,
            error : true,
            success : false,
        })
    }
}
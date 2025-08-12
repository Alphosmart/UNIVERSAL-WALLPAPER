
async function userSignUpController(req,res){
    try{
        const {email, password, name} = <req className="body"></req>
    }catch(err){
        res.json({
            message : err,
            error : true,
            success : false,
        })
    }
}
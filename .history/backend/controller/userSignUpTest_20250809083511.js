async function userSignUpController(req,res){
    try {
        res.status(201).json({
            message: "Test signup endpoint working",
            success: true,
            error: false
        });
    } catch(err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = userSignUpController;

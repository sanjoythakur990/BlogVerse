const { userDataValidation } = require("../utils/authUtils");

const registerController= async (req, res)=>{
    console.log("Register working");
    const {name, username, email, password}= req.body
    // validation
    try {
        await userDataValidation(req.body)
    } catch (error) {
        return res.send({
            status: 400,
            message: "Data invalid",
            error: error
        })
    }
    
    return res.send("register working")
}

const loginController= (req, res)=>{
    console.log("Login working");
    return res.send("Login working")
}

module.exports= {registerController, loginController}
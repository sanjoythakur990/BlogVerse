const bcrypt= require('bcryptjs')
const User = require("../models/userModel");
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
    
    // store user data
    const obj= new User(req.body)
    try {
        const savedUser= await obj.registerUser()
        return res.send({
            status: 201,
            message: "User registered successfully",
            data: savedUser
        })
    } catch (error) {
        return res.send({
            status: 500,
            message: "Internal server error",
            error: error
        })
    }
    
}

const loginController= async (req, res)=>{
    const {loginId, password} = req.body
    if(!loginId || !password) return res.send({status: 400, message: "Missing user credentials"})
    
    try {
        // find the user
        const userData= await User.findUserWithLoginId({loginId})
        // compare the password
        const isMatch= await bcrypt.compare(password, userData.password)
        if(!isMatch) return res.send({status: 400, message: "Incorrect password"})
        // session based auth
        req.session.isAuth= true
        req.session.user= {
            username: userData.username,
            email: userData.email,
            id: userData._id
        }

    } catch (error) {
        return res.send({
            status: 500,
            message: "Internal server error",
            error: error
        })
    }
    
    
    
    return res.send("Login working")
}

module.exports= {registerController, loginController}
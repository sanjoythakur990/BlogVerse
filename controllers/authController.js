const bcrypt= require('bcryptjs')
const mongoose= require('mongoose')
const Schema= mongoose.Schema
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
        const userData= await User.findUserWithkey({key : loginId})
        // compare the password
        const isMatch= await bcrypt.compare(password, userData.password)
        if(!isMatch) return res.send({status: 400, message: "Incorrect password"})
        // session based auth
        req.session.isAuth= true
        req.session.user= {
            username: userData.username,
            email: userData.email,
            userId: userData._id
        }
        return res.send({
            status: 200,
            message: "Login successfull"
        })

    } catch (error) {
        console.log(error);
        return res.send({
            status: 500,
            message: "Internal server error",
            error: error
        })
    }
    
    
}

const logoutController= (req, res)=>{
    req.session.destroy((err)=>{
        if(err) return res.send({status: 500, message: "Logout unsuccessfull"})

        return res.send({status: 200, message: "Logout successfull"})
    })
}

const loginPageController= (req, res)=>{
    return res.render("loginForm")
}

const logoutAllDevicesController= async (req,res)=>{
    const userId= req.session.user.userId
    // create a session schema
    const sessionSchema= new Schema({
        _id: {type: String}
    }, {
        strict: false      // this is indicating => even after adding new attributes in the sessionSchema after a certain point, 
                            // when already some data are present in the db with the old attributes, mongodb atlast will not
                            // throw any error
    })
    // convert it into a model
    const sessionModel= mongoose.model('session', sessionSchema)
    // mongoose query to delete all entries associated with the current user
    try {
        const deletedObj= await sessionModel.deleteMany({ "session.user.userId" : userId})
        console.log(deletedObj);
        return res.send({
            status: 200,
            message: `Logout from ${deletedObj.deletedCount} devices is successfull`,

        })
    } catch (error) {
        return res.send({
            status: 500,
            message: "Internal server error",
            error: error,
        });
    }
    
}
module.exports= {registerController, loginController, logoutController, logoutAllDevicesController, loginPageController}
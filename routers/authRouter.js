const express= require('express');
const { registerController, loginController, logoutController, logoutAllDevicesController, loginPageController} = require('../controllers/authController');
const isAuth = require('../middlewares/isAuthMidlleware');
const authRouter= express.Router()

authRouter
    .get("/login", loginPageController)
    .post("/register", registerController)
    .post("/login", loginController)
    .post("/logout", isAuth, logoutController)
    .post("/logout_all_devices", isAuth, logoutAllDevicesController)
    
module.exports= authRouter
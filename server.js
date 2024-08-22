const express= require('express')
const app= express()
require("dotenv").config()
const cli= require("cli-color")
const PORT= process.env.PORT

// file-imports
const dbConnect = require("./dbConnection")
const authRouter = require('./routers/authRouter')


// /auth/register
// /auth/login
app.use("/auth", authRouter)

app.listen(PORT, ()=>{
    console.log(cli.yellowBright.bold("Server is running on PORT: "+ PORT));
})
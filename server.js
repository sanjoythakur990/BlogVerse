const express= require('express')
const app= express()
require("dotenv").config()
const cli= require("cli-color")
const PORT= process.env.PORT
const session= require('express-session')
const mongodbSession= require('connect-mongodb-session')(session)
const store= new mongodbSession({
    uri: process.env.MONGO_URI,
    collection: "sessions"
})

// file-imports
const dbConnect = require("./dbConnection")
const authRouter = require('./routers/authRouter')


app.use(express.json())  // body parser
// /auth/register
// /auth/login
app.use("/auth", authRouter)
app.use(session({
    secret: process.env.SECRET_KEY,
    store: store,
    resave: false, 
    saveUninitialized: false
}))


app.listen(PORT, ()=>{
    console.log(cli.yellowBright.bold("Server is running on PORT: "+ PORT));
})
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
const blogRouter = require('./routers/blogRouter')
const isAuth = require('./middlewares/isAuthMidlleware')
const followRouter = require('./routers/followRouter')
const cleanUpBin = require('./cron')


app.set("view engine", "ejs")

app.use(session({
    secret: process.env.SECRET_KEY,
    store: store,
    resave: false, 
    saveUninitialized: false
}))
app.use(express.json())  // body parser
app.use(express.urlencoded({ extended: true }));
// /auth/register
// /auth/login
app.use("/auth", authRouter)
app.use("/blog", isAuth, blogRouter)   // by adding isAuth here, we are protecting all the blog apis
app.use("/follow", isAuth, followRouter)



app.listen(PORT, ()=>{
    console.log(cli.yellowBright.bold("Server is running on PORT: "+ PORT));
    cleanUpBin()      // adding clean up here, because I want it to get executed when the server is running
})
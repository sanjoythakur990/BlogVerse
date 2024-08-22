const mongoose= require('mongoose')
const Schema= mongoose.Schema

const userSchema= new Schema({
    name: {type: String},
    username: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String,
         required: true,
        select: false   // by doing this u can read all the information of user from the Db, except password
        }
})

module.exports= mongoose.model("user", userSchema)
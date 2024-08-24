const bcrypt= require('bcryptjs')
const userSchema= require('../schemas/userSchema');
const { isValidObjectId } = require('mongoose');

const User = class {
    username;
    name;
    password;
    email;
    // even if I don't write the attribute's name(line 2-5). It will be fine becuase of the constructor's 'this' keyword. It will 
    // automatically consider the attributes are present in this class
    constructor({name, email, username, password}){
        this.name=name;
        this.username=username;
        this.email=email;
        this.password=password
    }

    registerUser() {
        return new Promise(async (resolve, reject) => {
            // checking in the db if email or username already exist or not

            /* userSchema.findOne(this.email)
               userSchema.findOne(this.username) */

            // we are gonna use mongodb operator => OR
            const userExist= await userSchema.findOne({
                $or: [{email: this.email}, {username: this.username}]
            })
            if(userExist){
                if(userExist.email === this.email) reject("Email already exists")
                if(userExist.username === this.username) reject("Username already exists")
            }

            const hashedPassword= await bcrypt.hash(this.password, Number(process.env.SALT))

            const userObj= new userSchema({
                name: this.name,
                username: this.username,
                email: this.email,
                password: hashedPassword
            })

            try {
                const userEntry = await userObj.save()
                resolve(userEntry)
            } catch (error) {
                reject(error)
            }  
        })
    }


    static findUserWithkey({key}){
        return new Promise(async (resolve, reject)=>{
            try {
                console.log(isValidObjectId(key));
                if(!key) reject("key is missing")
                const userEntry= await userSchema.findOne({
                    $or: [isValidObjectId(key) ? {_id: key} : {email: key}, {username: key}]
                }).select("+password")
                if(!userEntry) reject("User not found")
                resolve(userEntry)
            } catch (error) {
                reject(error)
            }
        })
    }
}



module.exports= User
const mongoose= require('mongoose')
const Schema= mongoose.Schema

const blogSchema= new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 3,
        maxLength: 100
    },
    textBody: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 1000
    },
    creationDateTime:{
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user"     // by this line, it has become a foreign key to user collection
    },
    imagePath: {
        type: String
    }
})

// we can just rename the required image file like userId_blogId_picture.png

module.exports= mongoose.model("blog", blogSchema)
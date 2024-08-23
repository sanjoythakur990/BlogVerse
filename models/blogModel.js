const blogSchema = require("../schemas/blogSchema")

const createBlog=({title, textBody, userId})=>{
    return new Promise(async (resolve, reject)=>{
        const blogObj= new blogSchema({
            title, textBody, userId, creationDateTime: Date.now()
        })
        
        try {
            const blogEntry= await blogObj.save()
            resolve(blogEntry)
        } catch (error) {
            reject(error)
        }

    })
}

module.exports= createBlog
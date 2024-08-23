const createBlog = require("../models/blogModel")
const blogDataValidator = require("../utils/blogUtils")

const createBlogController=async (req, res)=>{
    const {title, textBody}= req.body
    const userId= req.session.user.userId
    // data validation
    try {
        await blogDataValidator(req.body)
    } catch (error) {
        return res.send({
            status: 400,
            message: "Invalid blog data",
            error: error
        })
    }
    
    try {
        const blogdata= await createBlog({title, textBody, userId})
        return res.send({
            status: 201,
            message: "Blog created successfully",
            data: blogdata
        })
    } catch (error) {
        return res.send({
            status: 500,
            message: "Internal srever error",
            error: error
        })
    }
    

    return res.send("blog controller is working")
}

module.exports={createBlogController}

const blogDataValidator = require("../utils/blogUtils")
const {createBlog, getAllBlogs, getMyBlogs, getBlogwithId, editBlog} = require("../models/blogModel")

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

// skip comes from client side, limit comes from server side
const getBlogsController= async (req, res)=>{
    const SKIP = Number(req.query.skip) || 0

    // call a function
    try {
        const blogsData= await getAllBlogs({SKIP})
        return res.send({
            status: 200, 
            message: "Read success",
            data: blogsData
        })
    } catch (error) {
        return res.send({
            status: 500,
            message: "Internal srever error",
            error: error
        })
    }
}

const getMyBlogsController= async (req,res)=>{
    const userId= req.session.user.userId
    const SKIP= Number(req.query.skip) || 0

    try {
        const myBlogsData= await getMyBlogs({userId, SKIP})

        if(myBlogsData.length===0) return res.send({status: 204, message: "No more blogs found"})
        return res.send({
            status:200,
            message: "Read successfull",
            data: myBlogsData
        })
    } catch (error) {
        return res.send({
            status: 500,
            message: "Internal server error",
            error: error
        })
    }
}

const editBlogController= async (req, res)=>{
    const {title, textBody, blogId}= req.body
    const userId= req.session.user.userId

    // data validation
    try {
        await blogDataValidator({title, textBody})
    } catch (error) {
        return res.send({
            status: 400,
            message: "Invalid data",
            error: error
        })
    }

    // find the blog
    // ownership check
    // update the info
    try {
        const blogData= await getBlogwithId({blogId})

        if(!userId.equals(blogData.userId)) {  // using .equals because userId is in ObjectId format. ANd it doesnt support === operator
            return res.send({
                status: 403,
                message: "Not allowed to edit the blog"
            })
        }

        const previousBlogData= await editBlog({title, textBody, blogId})

        return res.send({
            status:200,
            message: "Blog updated successfully",
            data: previousBlogData
        })
    } catch (error) {
        return res.send({
            status: 500,
            message: "Internal server error",
            error: error
        })
    }
    
    
}

module.exports={createBlogController, getBlogsController, getMyBlogsController, editBlogController}
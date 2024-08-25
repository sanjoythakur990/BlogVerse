const { LIMIT } = require("../privateConstants")
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

const getAllBlogs=({SKIP})=>{
    return new Promise(async (resolve, reject)=>{
        // aggregate method -> pagination (skip, limit), sort => first we need to sort them in desc order, then we will do skip, limit
        try {
            const blogEntries= await blogSchema.aggregate([
                {
                    $match: {isDeleted: {$ne: true}}
                },
                {
                    $sort: {creationDateTime: -1}  //  -1 -> desc order, +1 => asc order
                },
                {
                    $skip: SKIP
                },
                {
                    $limit: LIMIT
                }
            ])
            resolve(blogEntries)
        } catch (error) {
            reject(error)
        }
    })
}


const getMyBlogs= ({userId, SKIP})=>{
    return new Promise(async (resolve, reject)=>{
        // match, sort, pagination(skip, limit)
        try {
            const myBlogs= await blogSchema.aggregate([
                {
                    $match: {userId: userId, isDeleted: {$ne: true}}   // here not writing isDeleted: false, because there are entries which doesnt have isDeleted attribute, so 'not equal to true' will work 
                },
                {
                    $sort: {creationDateTime: -1}   // desc order => latest first
                },
                {
                    $skip: SKIP
                },
                {
                    $limit: LIMIT
                }
            ])

            resolve(myBlogs)
        } catch (error) {
            reject(err)
        }
    })
}

const getBlogwithId=({blogId})=>{
    return new Promise(async (resolve ,reject)=>{
        try {
            if(!blogId) reject("Blog id is missing")
            const blogEntry= await blogSchema.findOne({_id: blogId})
            if(!blogEntry) reject(`Blog not found with blog id = ${blogId}`)
            resolve(blogEntry)
        } catch (error) {
            reject(error)
        }
    })
}

const editBlog= ({title, textBody, blogId})=>{
    return new Promise(async (resolve ,reject)=>{
        try {
            const previousBlogData= await blogSchema.findOneAndUpdate(
                {_id: blogId}, 
                {title: title, textBody: textBody}
                )
            resolve(previousBlogData)
        } catch (error) {
            reject(error)
        }
    })
}

const deleteBlog= ({blogId})=>{
    return new Promise(async (resolve ,reject)=>{
        try {
            // const deletedBlogData= await blogSchema.findOneAndDelete(
            //     {_id: blogId}
            //     )

            const deletedBlogData= await blogSchema.findOneAndUpdate(
                {_id: blogId}, {isDeleted: true, deletionDateTime: Date.now()}
                )
            resolve(deletedBlogData)
        } catch (error) {
            reject(error)
        }
    })
}
module.exports= {createBlog, getAllBlogs, getMyBlogs, getBlogwithId, editBlog, deleteBlog}
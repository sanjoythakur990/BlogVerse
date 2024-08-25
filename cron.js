const cron = require('node-cron')
const blogSchema = require('./schemas/blogSchema')

function cleanUpBin(){
    cron.schedule('* * 0 * * *', async ()=>{           // this will run everyday at 12 am
        // find all blogs where isDeleted : true
        // if deletionDateTime > 30 days
        // delete the blog

        try {
            const deletedBlogs= await blogSchema.find({isDeleted: true})
            // console.log(deletedBlogs);
            let deletedBlogArray=[]
            if(deletedBlogs.length > 0){
                deletedBlogs.map((blog)=>{
                    let diff= (Date.now() - blog.deletionDateTime)/(1000 * 60 * 60 *24)  // converting it into days
                    if(diff > 30) deletedBlogArray.push(blog._id)
                    
                })
            }
            if(deletedBlogArray.length>0){
                try {
                    const deletedBlogDetails= await blogSchema.findOneAndDelete({_id: {$in : deletedBlogArray}})
                    console.log(`Blog has been deleted successfully: ${deletedBlogDetails._id}`);
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (error) {
            console.log(error);
        }
    })
}

module.exports= cleanUpBin
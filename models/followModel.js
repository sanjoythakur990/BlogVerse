const followSchema= require('../schemas/followSchema')

const followUser=({followingUserId, followerUserId})=>{
    return new Promise(async (resolve, reject)=>{
        const followObj= new followSchema({
            followerUserId: followerUserId,
            followingUserId: followingUserId
        })

        try {
            const followEntry= await followObj.save()
            resolve(followEntry)
        } catch (error) {
            reject(error)
        }
    })
}

const getFollowingList= ({followerUserId, SKIP})=>{
    return new Promise(async (resolve, reject)=>{
        try {
            const followEntry= await followSchema.find({followerUserId: followerUserId}).populate("followingUserId")
            console.log(followEntry);
            resolve(followEntry)
        } catch (error) {
            reject(error)
        }
    })
    
}

module.exports= {followUser, getFollowingList}
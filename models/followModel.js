const { LIMIT } = require('../privateConstants')
const followSchema= require('../schemas/followSchema')
const userSchema = require('../schemas/userSchema')

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
            // const followEntry= await followSchema.find({followerUserId: followerUserId}).populate("followingUserId")
            

            const followEntry= await followSchema.aggregate([
                {
                    $match: {followerUserId: followerUserId}
                },
                {
                    $sort: {creationDateTime: -1}
                },
                {
                    $skip: SKIP
                },
                {
                    $limit: LIMIT
                }
            ])
            const followingUserIdsArray= followEntry.map(follow => follow.followingUserId)
            const followingUserDetails= await userSchema.find({_id : {$in : followingUserIdsArray}})
            // console.log(followingUserDetails.reverse());
            resolve(followingUserDetails.reverse())
        } catch (error) {
            reject(error)
        }
    })
    
}

const getFollowerList= ({followingUserId, SKIP})=>{
    return new Promise(async (resolve, reject)=>{
        try {

            const followEntry= await followSchema.aggregate([
                {
                    $match: {followingUserId: followingUserId}
                },
                {
                    $sort: {creationDateTime: -1}
                },
                {
                    $skip: SKIP
                },
                {
                    $limit: LIMIT
                }
            ])
            const followerUserIdsArray= followEntry.map(follow => follow.followerUserId)
            const followerUserDetails= await userSchema.find({_id : {$in : followerUserIdsArray}})

            resolve(followerUserDetails.reverse())
        } catch (error) {
            reject(error)
        }
    })
    
}

const unfollow= ({followingUserId, followerUserId})=>{
    return new Promise(async (resolve, reject)=>{
        try {
            const deletedEntry= await followSchema.findOneAndDelete({followerUserId, followingUserId})
            resolve(deletedEntry)
        } catch (error) {
            reject(error)
        }

    })
}

module.exports= {followUser, getFollowingList, getFollowerList, unfollow}
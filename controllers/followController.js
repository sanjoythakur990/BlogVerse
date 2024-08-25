const { followUser, getFollowingList, getFollowerList, unfollow } = require("../models/followModel");
const User = require("../models/userModel");

const followUserController= async (req,res)=>{
    const followingUserId= req.body.followingUserId
    const followerUserId= req.session.user.userId

    
    // checking if following user is present in the db or not
    try {
        await User.findUserWithkey({key: followingUserId})
    } catch (error) {
        return res.send({
            status: 400, 
            message: "following user not found",
            error: error
        })
    }

    // checking if follower user is present in the db or not
    try {
        await User.findUserWithkey({key: followerUserId})
    } catch (error) {
        return res.send({
            status: 400, 
            message: "follower user not found",
            error: error
        })
    }

    try {
        const followEntry = await followUser({followerUserId, followingUserId})
        return res.send({
            status: 201,
            message: "Follow successfull",
            data: followEntry
        })
    } catch (error) {
        return res.send({
            status: 500,
            message: "Internal server error",
            error: error
        })
    }
  
}

const getFollowingListController= async (req,res)=>{
    const followerUserId= req.session.user.userId
    const SKIP= Number(req.query.skip) || 0

    try {
        const followingList= await getFollowingList({followerUserId, SKIP})

        return res.send({
            status: 200,
            message: "Read success",
            data: followingList
        })
    } catch (error) {

        return res.send({
            status: 500,
            message: "Internal server error",
            error: error
        })
    }

}

const getFollowerListController=async (req,res)=>{
    const followingUserId= req.session.user.userId
    const SKIP= Number(req.query.skip) || 0

    try {
        const followerList= await getFollowerList({followingUserId, SKIP})

        return res.send({
            status: 200,
            message: "Read success",
            data: followerList
        })
    } catch (error) {

        return res.send({
            status: 500,
            message: "Internal server error",
            error: error
        })
    }

}

const unfollowController= async (req,res) => {
    const followingUserId= req.body.followingUserId
    const followerUserId= req.session.user.userId

    try {
        const deletedEntry= await unfollow({followerUserId, followingUserId})

        return res.send({
            status: 200, 
            message: "Unfollowed successfully",
            data: deletedEntry
        })
    } catch (error) {
        return res.send({
            status: 500,
            message: "Internal server error",
            error: error
        })
    }
}

module.exports= {followUserController, getFollowingListController, getFollowerListController, unfollowController}
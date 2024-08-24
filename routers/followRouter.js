const express= require('express')
const { followUserController, getFollowingListController } = require('../controllers/followController')
const followRouter= express.Router()

followRouter.post("/follow-user", followUserController)
.get("/following-list", getFollowingListController)

module.exports= followRouter
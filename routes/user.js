const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requiredLogin = require('../middlewares/requiredLogin')
const { request } = require('express')
const Post = mongoose.model('Post')
const User = mongoose.model('User')

router.get('/user/:username', (request, response) => {
    User.findOne({username: request.params.username})
    .select('-password')
    .exec((error, user) => {
        if(error || !user) {
            return response.status(404).json({
                error: 'User not found'
            })
        }
        Post.find({postedBy: user._id})
        .populate('postedBy', '_id username')
        .exec((error, posts) => {
            if(error) {
                return response.status(422).json(error)
            }
            return response.json({user, posts})
        })
    })
})

router.put('/follow', requiredLogin, (request, response) => {
    User.findByIdAndUpdate(request.body.userId,{
        $push:{
            followers: request.user._id
        }
    }, {new: true})
    .exec((error, resultFollower) =>{
        if(error) {
            response.status(422).json(error)
        }
        User.findByIdAndUpdate(request.user._id, {
            $push:{
                following: request.body.userId
            }
        }, {new: true})
        .select('-password')
        .exec((error, resultFollowing) => {
            if(error) {
                response.status(422).json(error)
            }
            response.json(resultFollower)
        })
    } )
})

router.put('/unfollow', requiredLogin, (request, response) => {
    User.findByIdAndUpdate(request.body.userId,{
        $pull:{
            followers: request.user._id
        }
    }, {new: true})
    .exec((error, resultFollower) =>{
        if(error) {
            response.status(422).json(error)
        }
        User.findByIdAndUpdate(request.user._id, {
            $pull:{
                following: request.body.userId
            }
        }, {new: true})
        .select('-password')
        .exec((error, resultFollowing) => {
            if(error) {
                response.status(422).json(error)
            }
            response.json(resultFollower)
        })
    } )
})

module.exports = router
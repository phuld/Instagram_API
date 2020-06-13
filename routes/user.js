const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requiredLogin = require('../middlewares/requiredLogin')
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

module.exports = router
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middlewares/requiredLogin')

const Post = mongoose.model('Post')



router.post('/createpost', requireLogin, (request, response) => {
    const { caption, photo } = request.body
    if (!caption || !photo) {
        response.status(422).json({
            general: 'Please add all the fields'
        })
    }
    const post = new Post({
        caption,
        photo,
        postedBy: request.user
    })
    post.save()
        .then(postData => {
            response.json({
                post: postData
            })
        })
        .catch(error => {
            console.log(error)
        })
})

router.get('/allposts', (request, response) => {
    Post.find()
        .populate('postedBy', "_id username")
        .then(data => {
            response.json({
                posts: data
            })
        })
        .catch(error => {
            console.log(error)
        })
})

router.get('/myposts', requireLogin, (request, response) => {
    Post.find({ "postedBy": request.user._id })
        .then(myposts => {
            response.json({
                myposts: myposts
            })
        })
})

module.exports = router
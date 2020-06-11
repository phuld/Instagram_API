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

router.put('/like', requireLogin, (request, response) => {
    Post.findByIdAndUpdate(request.body.postId, {
        $push: {
            likes: request.user._id
        }
    },{
        new: true
    }).exec((err, result) => {
        if(err) {
            return response.status(422).json({
                error: err
            })
        }else if(!result) {
            return response.status(404).json({
                error: 'Post not found'
            })
        }else {
            return response.json(result)
        }
    })
})

router.put('/unlike', requireLogin, (request, response) => {
    Post.findByIdAndUpdate(request.body.postId, {
        $pull:{
            likes: request.user._id
        }
    }, {new: true}).exec((error, result) => {
        if(error) {
            return response.status(422).json({
                error: error
            })
        }else if(!result) {
            return  response.status(404).json({
                error: "You didn't like this post"
            })
        }else {
            return response.json(result)
        }
    })
})

module.exports = router
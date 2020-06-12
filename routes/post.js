const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middlewares/requiredLogin')
const { request } = require('express')

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
        postedBy: request.user,
        createdAt: new Date().toISOString()
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
        .sort({ createdAt: -1 })
        .populate('postedBy', "_id username")
        .populate('comments.postedBy', "_id username")
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
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return response.status(422).json({
                error: err
            })
        } else if (!result) {
            return response.status(404).json({
                error: 'Post not found'
            })
        } else {
            return response.json(result)
        }
    })
})

router.put('/unlike', requireLogin, (request, response) => {
    Post.findByIdAndUpdate(request.body.postId, {
        $pull: {
            likes: request.user._id
        }
    }, { new: true }).exec((error, result) => {
        if (error) {
            return response.status(422).json({
                error: error
            })
        } else if (!result) {
            return response.status(404).json({
                error: "You didn't like this post"
            })
        } else {
            return response.json(result)
        }
    })
})

router.post('/comment', requireLogin, (request, response) => {
    const { text } = request.body
    if (!text) {
        return response.status(422).json({
            error: 'Must not be empty'
        })
    }
    const newComment = {
        text,
        postedBy: request.user._id,
        createdAt: new Date().toISOString()
    }
    Post.findByIdAndUpdate(request.body.postId, {
        $push: {
            comments: newComment
        }
    }, {
        new: true
    })
        .populate('postedBy', "_id username")
        .populate('comments.postedBy', '_id username')
        .exec((error, result) => {
            if (error) {
                return response.status(422).json(error)
            } else {
                return response.json(result)
            }
        })
})

router.delete('/posts/:postId', requireLogin, (request, response) => {
    Post.findOne({ _id: request.params.postId })
        .populate('postedBy', '_id')
        .exec((error, post) => {
            if (error || !post) {
                return response.status(422).json({
                    error: error
                })
            }
            if (post.postedBy._id.toString() === request.user._id.toString()) {
                post.remove()
                    .then(result => {
                        return response.json(result)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } else {
                return response.status(422).json({
                    error: "Not permition to delete this post"
                })
            }
        })
})

module.exports = router
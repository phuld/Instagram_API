const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    likes: [
        {
            type: ObjectId, 
            ref: 'User'
        }
    ],
    comments: [
        {
            text: String, 
            postedBy: {
                type: ObjectId, 
                ref: 'User'
            }, 
            createdAt: Date
        }
    ],
    postedBy: {
        type: ObjectId, 
        ref: 'User'
    },
    saved: [
        {
            type: ObjectId, 
            ref: 'User'
        }
    ],
    createdAt: {
        type: Date
    }
})

mongoose.model('Post', postSchema)
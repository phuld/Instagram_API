const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    fullname: {
        type: String, 
        required: true
    }, 
    username: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true
    }, 
    password: {
        type: String, 
        required: true
    }, 
    avatar: {
        type: String, 
        default: "https://res.cloudinary.com/phuld/image/upload/v1592279348/no-avatar_vtfmeq.png"
    },
    website: {
        type: String
    },
    bio: {
        type: String
    }, 
    phoneNumber: {
        type: String
    }, 
    gender: {
        type: String
    },
    followers:[
        {
            type: ObjectId, 
            ref: 'User'
        }
    ], 
    following: [
        {
            type: ObjectId, 
            ref: 'User'
        }
    ]
})

mongoose.model('User', userSchema)
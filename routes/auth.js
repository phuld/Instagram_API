const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../keys')
const requiredLogin = require('../middlewares/requiredLogin')
const { validateSignup, validateLogin, validateProfile } = require('../utils/validators')

const User = mongoose.model('User')

router.post('/signup', (request, response) => {
    const { fullname, username, email, password, confirmPassword } = request.body;
    const newUser = {
        fullname,
        username,
        email,
        password,
        confirmPassword
    }
    const { valid, errors } = validateSignup(newUser)
    if (!valid) {
        return response.status(422).json(errors)
    }
    User.findOne({ email: email })
        .then(data => {
            if (data) {
                return response.status(422).json({
                    general: 'Email is already in use'
                })
            }
            User.findOne({ username: username })
                .then((data) => {
                    if (data) {
                        return response.status(422).json({
                            general: 'Usename is already in use, please choose other name.'
                        })
                    }
                    bcrypt.hash(password, 12)
                        .then(hashPassword => {
                            const user = new User({
                                fullname,
                                username,
                                email,
                                password: hashPassword
                            })
                            user.save()
                                .then(user => {
                                    const token = jwt.sign({ _id: user._id }, JWT_SECRET)
                                    return response.json({ token })
                                })
                                .catch(error => {
                                    console.log(error);
                                })
                        })
                })
                .catch(error => {
                    console.log(error)
                })

        })
        .catch(error => {
            console.log(error);
        })
})

router.post('/login', (request, response) => {
    const { email, password } = request.body;
    const { valid, errors } = validateLogin({ email, password })
    if (!valid) {
        return response.status(422).json(errors)
    }
    User.findOne({ email: email })
        .then(data => {
            if (!data) {
                return response.status(404).json({
                    general: 'Email not found'
                })
            }
            bcrypt.compare(password, data.password)
                .then(isMatch => {
                    if (isMatch) {
                        const token = jwt.sign({ _id: data._id }, JWT_SECRET)
                        return response.json({ token })
                    } else {
                        response.status(422).json({
                            general: 'Invalid email or password'
                        })
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        })
        .catch(error => {
            console.log(error)
        })
})

router.get('/user', requiredLogin, (request, response) => {
    // console.log(request.user._id)
    User.findById(request.user._id)
        .select('-password')
        .then(data => {
            return response.json(data)
        })
        .catch(error => {
            console.log(error)

        })
})

router.put('/user', requiredLogin, (request, response) => {
    const { fullname, username, website, bio, phoneNumber, gender } = request.body;
    const updateProfile = {
        fullname,
        username,
        website,
        bio,
        phoneNumber,
        gender
    }
    const message = validateProfile(updateProfile)
    if (message) {
        return response.status(422).json({ error: message })
    }
    User.findOne({ username: updateProfile.username })
        .then(result => {
            if (result && result.username !== request.user.username) {
                response.status(422).json({ error: 'Username existed, please choose other name.' })
            }else {
                User.findByIdAndUpdate(request.user._id, updateProfile, { new: true })
                .exec((error, result) => {
                    if (error) {
                        response.status(422).json(error)
                    }
                    response.json(result)
                })
            }
        })
})

// router.get('/protected', )

module.exports = router
const isEmpty = (value) => {
    if(!value || value.trim() === '') return true;
    return false;
}

const isEmail = (email) => {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email.toLowerCase())
}

exports.validateSignup = (newUser) => {
    const errors = {};
    if(isEmpty(newUser.email)) {
        errors.email = "Email must not be empty"
    } else if(!isEmail(newUser.email)) {
        errors.email = "Must be a valid email"
    }
    if(isEmpty(newUser.fullname)) {
        errors.fullname = "Fullname must not be empty"
    }
    if(isEmpty(newUser.username)) {
        errors.username = "Username must not be empty"
    }
    if(isEmpty(newUser.password)) {
        errors.password = "Password must not be empty"
    }
    if(newUser.password !== newUser.confirmPassword) {
        errors.confirmPassword = "Password must match"
    }
    return {
        valid: Object.keys(errors).length > 0 ? false: true, 
        errors
    }
}

exports.validateLogin = (userData) => {
    const errors = {}
    if(isEmpty(userData.email)) {
        errors.email = "Email must not be empty"
    }else if(!isEmail(userData.email)) {
        errors.email = "Must be a valid email"
    }
    if(isEmpty(userData.password)) {
        errors.password = "Password must not be empty"
    }
    return {
        valid: Object.keys(errors).length === 0,
        errors
    }
}
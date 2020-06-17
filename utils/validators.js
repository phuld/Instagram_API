const isEmpty = (value) => {
    if(!value || value.trim() === '') return true;
    return false;
}

const isEmail = (email) => {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email.toLowerCase())
}

const isWebsite = (website) => {
    const array = website.split('.')
    if(!array[0] || !array[1]) return false
    return true
}

const isPhoneNumber = (number) => {
    let regex =/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return regex.test(number)
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

exports.validateProfile = (profile) => {
    let errors = ''
    if(isEmpty(profile.username)) {
        errors = "Username must not empty"
    }
    else if(!isEmpty(profile.website) && !isWebsite(profile.website)) {
        errors = "Must be a valid website"
    }      
    else if(!isEmpty(profile.phoneNumber) && !isPhoneNumber(profile.phoneNumber)) {
        errors = "Must be a valid phone number"
    }   
    return errors
}
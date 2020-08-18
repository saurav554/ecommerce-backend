const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;



const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        // validate the format of the email - custom validation
        validate: {
            validator: function(value){
                return validator.isEmail(value);
            },
            message: function(){
                return `invalid email format`
            }
        }
    },
    password: {
        type: String,
        minlength: 8,
        maxlength: 128,
        required: true
    },
    mobile:{
        type: String,
        unique: true,
        required: true,
        minlength: 10,
        maxlength: 10,
        validate: {
            validator: function(value){
                return validator.isNumeric(value);
            },
            message: function(){
                return `invalid mobile number format`
            }
        }
    },
    tokens:[{
        token:{
            type: String
        }
    }]
});

// to define our own instance methods
userSchema.methods.generateToken = function(){
    let user = this;
    console.log(user);
    let tokenData = {
        userId: this._id
    }
    let jwtToken = jwt.sign(tokenData, 'supersecret')
    user.tokens.push({token: jwtToken})
    
    return user.save().then(function(user){
        return jwtToken
    })
}

// npm install --save bcryptjs

userSchema.pre('save', function(next){
    let user = this;
    //console.log(user);
    if(user.isNew){
        //console.log('this function was called even before saving the record', user);
    bcryptjs.genSalt(10).then(function(salt){
        bcryptjs.hash(user.password, salt).then(function(encrypted){
            user.password = encrypted;
            next();
        }).catch(function(err){
            console.log(err)
        })
    })
    }else{
        next()
    }
})

userSchema.statics.findByCredentails = function(email, password){
    let User = this;
    return User.findOne({email : email}).then(function(user){
        if(!user){
            return Promise.reject('invalid email or password');
        }
        return bcryptjs.compare(password, user.password).then(function(res){
            if(res){
                return Promise.resolve(user);
            }else{
                return Promise.reject('invalid email or password');
            }
        })
    })
}

userSchema.statics.findByToken = function(token){
    let User = this;
    let tokenData;
    
    try{
        tokenData = jwt.verify(token, "supersecret")
    } catch(err){
        return Promise.reject(err.message)
    }

    return User.findOne({
        "_id": tokenData.userId,
        "tokens.token": token
    })
}


// pre validate - function()
// actual validation
//post validate - function()
// pre save - function()
// actual save
//post save - function()

// pre remove- function()
//actual remove
// post remove - function()


const User = mongoose.model("User", userSchema);

module.exports = {
    User
}
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const userSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    }
    ,
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true
    }
    ,
    imageUrl:{
        type: String
    }
   
})

userSchema.pre('save',async function(next){
    try {
        
        const user = this
        if(!user.isModified('password')){
            next()
        }
        try {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(user.password,salt)
            user.password = hashPassword
            next()
            
        } catch (error) {
            return next(error)
        }

    } catch (error) {
        return next(error)
    }
})

userSchema.methods.comparePassword= async function(candidatePassword){
    try {
        const isMatch = await bcrypt.compare(candidatePassword,this.password)

        return isMatch;
    } catch (error) {
        throw (error)
    }
}

userSchema.methods.jsonWebToken= function(){
    return jwt.sign({id: this._id},"123456",{
        expiresIn: 3000000
    })
}

const User = mongoose.model('User',userSchema);
module.exports = User
const jwt = require('jsonwebtoken');
const User = require('../model/userSchema');

const isUserAuthenticate = async(req,res,next)=>{
    const token = req.cookies.user
    //console.log(token);
    //console.log(req.user);
    
    if(!token)
    {
        return res.status(404).json({
            success: false,
            message: "Please Authenticate"
        })
    }
    const decoded = jwt.verify(token,"123456");
    req.user = await User.findById(decoded.id);
    //console.log(req.user);
    //console.log(decoded)
    next()
    
}

module.exports = isUserAuthenticate
const express = require('express');
const User = require('../model/userSchema');
const router = express.Router();
const bcrypt = require('bcrypt');
const generateToken = require('../jwt');
const isUserAuthenticate = require('../middleweare/userMiddleweare');
const cloudinary = require('cloudinary').v2;


require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

//signUp
router.post('/signup',async(req,res)=>{
    try {
        const cloudinaryResponse = await cloudinary.uploader.upload(req.files.image.tempFilePath);
        const user = await User.find({email: req.body.email})
        //console.log(user);
        
        if(user[0])
        {
            return res.status(500).json({
                success:false,
                message: "Email Already Exist"
            })
        }
        
        // const salt = await bcrypt.genSalt(10);
        // const hashPassword = await bcrypt.hash(req.body.password, salt);
        // console.log(hashPassword);
        //console.log(cloudinaryResponse.secure_url);
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password:req.body.password,
            email: req.body.email,
            imageUrl: cloudinaryResponse.secure_url
        })
        const response = await newUser.save();
        res.status(200).json({
            success: true,
            response
        })
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return res.status(500).json({
            success: false,
            message: error
        })
    }
})

//login

router.post('/login',async(req,res)=>{
    try {
        const user = await User.find({email:req.body.email});
        if(!user[0])
        {
            return res.status(500).json({
                success: false,
                message: "User Not Found"
            })
        }

        const isMatch = await user[0].comparePassword(req.body.password)
        if(isMatch)
        {
            console.log(`${user[0].firstName} ${user[0].lastName} Logged in Successfully`)
            //generate token
            generateToken(user[0],"Log in Successfull",res)
        }
        else
        {
            res.status(404).json({
                success: false,
                message: "User Password Not Matched"
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(404).json({
            success: false,
            message: "error"
        })
    }

})

//User can see Data After Login
router.get('/' ,isUserAuthenticate ,async (req,res)=>{
    const response = await User.find();
    res.status(200).json({
        message: "Success",
        response
    })
})



module.exports = router;
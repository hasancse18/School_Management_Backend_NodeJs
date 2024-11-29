const express = require('express');
const isUserAuthenticate = require('../middleweare/userMiddleweare');
const Course = require('../model/courseSchema');
const router = express.Router();
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
//Add Batch Details
router.post('/add-course',isUserAuthenticate,async(req,res)=>{
    //res.status(200).json({msg: 'Add Batch Details'});
    const token = req.cookies.user;
    const verify = jwt.verify(token,"123456")
    //console.log(verify.id);
    try {
        const cloudinary_response = await cloudinary.uploader.upload(req.files.image.tempFilePath);

        const newCourse = new Course({
            courseName: req.body.courseName,
            price: req.body.price,
            description: req.body.description,
            startingDate: req.body.startingDate,
            endDate: req.body.endDate,
            imageUrl: cloudinary_response.secure_url,
            uId: verify.id
        })
        const response = await newCourse.save();
        return res.status(200).json({
            success: true,
            message: response
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in add course",
            error
        })
    }
    res.status(200).json({
        success: true
    })
})

router.get('/',(req,res)=>{
    res.status(200).json({
        message: "Hello"
    })
})

module.exports = router;
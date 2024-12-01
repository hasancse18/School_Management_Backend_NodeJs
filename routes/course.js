const express = require('express');
const isUserAuthenticate = require('../middleweare/userMiddleweare');
const Course = require('../model/courseSchema');
const User = require('../model/userSchema')
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
            imageId: cloudinary_response.public_id,
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

//get all the course of a user
router.get('/getcourses',isUserAuthenticate,async(req,res)=>{
    const token = req.cookies.user
    //console.log(token);
    
    if(token)
    {
        const verify = jwt.verify(token,"123456")
        //console.log(verify);        
        try {
            
            const response = await Course.find({uId:verify.id})
            
            
            if(response[0]){
                res.status(200).json({
                    success: true,
                    response
                })
            }
            else
            {
                res.status(404).json({
                    success: false,
                    message: 'No Data Found'
                })
            }
        } catch (error) {
            console.log(error);
            
            res.status(500).json({
                success: false,
                message: 'No Data Found',
                error
            })
        }
    }

})

//get course details by id
router.get('/getcourses/:id',isUserAuthenticate,async(req,res)=>{
    try {
        const response = await Course.findById(req.params.id);
        if(response){
            res.status(200).json({
                success: true,
                message: response
            })
           
        }
        else
        {
            res.status(404).json({
                message: "Invalid Id"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({
            success: false,
            message: "Get Courses By Id Error"
        })
    }
})
//Delete Course by their Id
router.delete('/deletecourse/:id',isUserAuthenticate, async(req,res)=>{
    try {
        const token = req.cookies.user;
        const verify  = jwt.verify(token,"123456")
        const userId = await Course.findById(req.params.id)
        if(userId.uId === verify.id)
        {
            const response = await Course.findByIdAndDelete(req.params.id)
            const deleteResponse = await cloudinary.uploader.destroy(userId.imageId)
            res.status(200).json({
                response,
                deleteResponse,
                message: "Delete Successfully"
            })
        }
       
    } catch (error) {
        res.status(500).json({
            success:false,
            message: 'Cannot Delete the course'
        })
    }
})

// router.get('/',(req,res)=>{
//     res.status(200).json({
//         message: "Hello"
//     })
// })

module.exports = router;
const express = require('express');
const isUserAuthenticate = require('../middleweare/userMiddleweare');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
const stuedent = require('../model/stuedent');
const Course = require('../model/courseSchema');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
//Add Student
router.get('/',(req,res)=>{
    res.status(200).json({msg: 'Add Student'});
})
//Add Student

router.post('/add-student',isUserAuthenticate,async(req,res)=>{
    const token = req.cookies.user;
    const verify = jwt.verify(token,"123456")
    const data = req.body
    try {
        const cloudinary_response = await cloudinary.uploader.upload(req.files.image.tempFilePath)
        const newStudent = new stuedent({
            ...data,
            imageUrl: cloudinary_response.secure_url,
            imageId: cloudinary_response.public_id,
            uId: verify.id
        })
        const response = newStudent.save();
        return res.status(200).json({
            success: true,
            messsage: response
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in Add Student",
            error
        })
        console.log(error);
        
    }
})
//get all Student of a User

router.get('/get-student',isUserAuthenticate,async(req,res)=>{
    const token = req.cookies.user;
    if(token)
    {
        const verify = jwt.verify(token,"123456");
        try {
            const response = await stuedent.find({uId:verify.id})
            if(response[0])
            {
                res.status(200).json({
                    response
                })
            }
            else
            {
                res.status(404).json({
                    message: 'No Data Found',
                    response
                })
            }
        } catch (error) {
            res.status(500).json({
                message:'Internal Server Error',
                error
            })
            
        }
    }
})

//get Student by their id
router.get('/getstudent/:id',isUserAuthenticate,async(req,res)=>{
    try {
        const response = await stuedent.findById(req.params.id);
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
            message: "Get Student By Id Error"
        })
    }
})

//Delete Student by Their Id

router.delete('/deletestudent/:id',isUserAuthenticate,async(req,res)=>{
    const token = req.cookies.user;
    const verify = jwt.verify(token,"123456");
    const students = await stuedent.findById(req.params.id);
    if(students.uId === verify.id)
    {
        try {
            const response = await stuedent.findByIdAndDelete(req.params.id);
            const cloudinary_response = await cloudinary.uploader.destroy(students.imageId);
            res.status(200).json({
                response,
                cloudinary_response,
                message: "Delete Successfully"
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Cannot Delete The Student",
                
                
            });
            console.log(error);
        }
    }

})

module.exports = router;
const express = require('express');
const isUserAuthenticate = require('../middleweare/userMiddleweare');
const Course = require('../model/courseSchema');
const router = express.Router();
const jwt = require('jsonwebtoken')

//Add Batch Details
router.post('/add-course',isUserAuthenticate,(req,res)=>{
    //res.status(200).json({msg: 'Add Batch Details'});
    const token = req.cookies.user;
    const verify = jwt.verify(token,"123456")
    console.log(verify.id);
    try {
        const newCourse = new Course({
            courseName: req.body.courseName,
            price: req.body.price,
            description: req.body.description,
            startingDate: req.body.startingDate,
            endDate: req.body.endDate,
            uId: verify.id
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
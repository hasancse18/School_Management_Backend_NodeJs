const express = require('express');
const router = express.Router();

//Add Batch Details
router.post('/',(req,res)=>{
    res.status(200).json({msg: 'Add Batch Details'});
})

router.get('/',(req,res)=>{
    res.status(200).json({
        message: "Hello"
    })
})

module.exports = router;
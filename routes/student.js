const express = require('express');
const router = express.Router();

//Add Student
router.post('/',(req,res)=>{
    res.status(200).json({msg: 'Add Student'});
})



module.exports = router;
const express = require('express');
const router = express.Router();

//Fee Details
router.post('/',(req,res)=>{
    res.status(200).json({msg: 'Add Fee Data'});
})



module.exports = router;
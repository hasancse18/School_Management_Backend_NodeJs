const express = require('express')
const app = express();

const userRoute = require('./routes/user');
const studentRoute = require('./routes/student');
const feeRoute = require('./routes/fee');
const courseRoute = require('./routes/course');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload');
app.use(bodyParser.json())
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.use('/user',userRoute);
app.use('/course',courseRoute);
app.use('/student',studentRoute);
app.use('/fee',feeRoute);
app.use('/*',(req,res)=>{
    //console.log()
    res.status(404).json({error: 'Bad Request'})
})

module.exports = app;
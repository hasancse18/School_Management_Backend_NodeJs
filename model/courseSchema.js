const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    courseName:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    startingDate:{
        type: String,
        required: true
    },
    endDate:{
        type: String,
        required: true
    },
    imageUrl:{
        type: String,
        required: true
    },
    uId:{
        type: String,
        required: true
    }
})

const Course = mongoose.model('Course',courseSchema);

module.exports = Course
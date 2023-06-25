const mongoose = require('mongoose')


const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userID:{
        type:String,
        required:true
    },
    category: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    image1: {
        type: String,
        required: true
    },
    image2: {
        type: String,
        required: true
    },
    image3: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ratingValues:{
        type:Array
    },
    rating:{
        type: Number,
    }
})

mongoose.model('petdetails',petSchema)
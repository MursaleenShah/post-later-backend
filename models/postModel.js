const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    title :{
        type : String,
        required : true,
    },
    content :{
        type : String,
        required : true,
    },
    mediaUrls : [{
        type: String
    }],
    scheduledTime :{
        type : Date,
        required : true,
    },
    status:{
        type : String,
        enum : ['pending' , 'sent'],
        default : 'pending',
    }
},{timestamps:true});

module.exports = mongoose.model('Post' , postSchema);
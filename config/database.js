const mongoose = require('mongoose');
require('dotenv').config();
const mongodbConnection = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("connected to database");
    } catch (error) {
        console.log(error);
    }
}

module.exports = mongodbConnection;
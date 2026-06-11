const express = require('express');
const {authenticate} = require('../middleware/auth')
const {registerUser , loginUser,logoutUser,getCurrentUser} = require('../controllers/userController');
const userRouter = express.Router();

userRouter.post('/register' , registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', logoutUser);
userRouter.get('/getUser',authenticate,getCurrentUser);

module.exports = {userRouter};
const express = require('express');
const postRouter = express.Router();
const{ upload} = require('../config/cloudinaryConnection')
const {createPost , getAllPosts, deletePost,updatePost,getPostById} = require('../controllers/postController')
const {authenticate} = require('../middleware/auth')


postRouter.post('/upload',authenticate,upload.array('media',5),createPost);
postRouter.patch('/update/:id',authenticate,upload.array('media',5),updatePost)
postRouter.get('/getallposts',authenticate, getAllPosts )
postRouter.delete('/deletepost/:id',authenticate, deletePost )
postRouter.get('/getpostbyid/:id',authenticate, getPostById )

module.exports = {postRouter};
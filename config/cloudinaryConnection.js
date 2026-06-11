const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const {CloudinaryStorage} = require('multer-storage-cloudinary')

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET

});

const storage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params : {
        folder : 'post_scheduler_media',
        allowed_formats: ['jpg', 'jpeg', 'png'],

    }
});

const upload = multer({ limits: { fileSize: 25 * 1024 * 1024 },storage});
module.exports = {cloudinary , upload}
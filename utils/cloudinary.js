// import cloudinary from 'cloudinary'
const cloudinary = require('cloudinary');


cloudinary.config({
  cloud_name: 'dmsxzw5rd', 
  api_key: '453662451246126', 
  api_secret: 'z5GFgsaI6iQyVTyQwuYhFLyVqxA'
//   cloud_name: process.env.CLOUDINARY_NAME, 
//   api_key: process.env.CLOUDINARY_API_KEY, 
//   api_secret: process.env.CLOUDINARY_API_SECRET
})

module.exports = cloudinary
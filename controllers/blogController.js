const BlogChema = require('../models/Blog/Blog') 
const BlogCategoryChema = require('../models/Blog/BlogCategory') 
const cloudinaryUpload = require('../utils/cloudinaryUpload')

class BlogController {
    async getBlogPosts (req, res) {
        try {
            const BlogPosts = await BlogChema.find({}).populate('category')
            
            res.status(200).json({status: 'success', data: BlogPosts})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }

    async getPostById (req, res) {
        try {
            const { id } = req.params
            
            if(!id) {
                res.status(400).send()
            }

            const blogPost = await BlogChema.findById(id)
            
            res.status(200).json({status: 'success', data: blogPost})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }

    async createBlogPost (req, res) {
        try {
            const blogPostRes = req.body
            const cloudinaryResp = await cloudinaryUpload.uploadFile(req.file, 'blog')

            const data = {
                ...blogPostRes,
                image: cloudinaryResp.url, 
            }

            const newBlogPost = await BlogChema.create(data)

            res.status(200).json({status: 'success', data: newBlogPost})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }

    async updateBlogPost (req, res) {
        try {
            const { title, description, category, status, url } = req.body
            const { id } = req.params
            let cloudinaryImageUrl = ''

            

            if(!id) {
                res.status(400).send()
            }
            
            const blogPost = await BlogChema.findById(id)

            if(req.file){
                const { url } = await cloudinaryUpload.uploadFile(req.file, 'blog')
                cloudinaryImageUrl = url
            }

            if (blogPost) {
                blogPost.title = title
                blogPost.description = description
                blogPost.category = category
                blogPost.status = status
                url ? blogPost.image = url : blogPost.image = cloudinaryImageUrl
                blogPost.save()


                res.status(200).json({status: 'success', data: blogPost})
            } else {
                res.status(400).json({status: 'error', message: 'Post not found!'})
            }
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }

    async deleteBlogPost (req, res) {
        try {
            const { id } = req.params

            if(!id) {
                res.status(400).send()
            }
            
            const blogPost = await BlogChema.findById(id)
            if(!blogPost) {
                res.status(400).json({status: 'error', message: 'Post not found!'})
            }
            blogPost.deleteOne()

            res.status(200).json({status: 'success', message: 'Post deleted!'})

        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }

    async getBlogCategories (req, res) {
        try {
            const BlogCategories = await BlogCategoryChema.find({})
            
            res.status(200).json({status: 'success', data: BlogCategories})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }

    async createBlogCategory (req, res) {
        try {
            const { name } = req.body

            console.log(req.body)
            const blogCatObj = {
                title: name,
                name: name,
            }
            // console.log(blogCatObj)

            const blogCategory = await BlogCategoryChema.create(blogCatObj)
            
            res.status(200).json({status: 'success', data: blogCategory})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }

    async updateBlogCategory (req, res) {
        try {
            const { name } = req.body
            const { id } = req.params

            if(!id) {
                res.status(400).send()
            }

            const blogCatObj = {
                title: name,
                name: name,
            }

            const blogCategory = await BlogCategoryChema.findByIdAndUpdate(id, blogCatObj)
            
            if(!blogCategory) {
                res.status(400).json({status: 'error', message: 'Blog Category not found!'})
            }

            res.status(200).json({status: 'success', data: blogCategory})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }

    async deleteBlogCategory (req, res) {
        try {
            const { id } = req.params

            if(!id) {
                res.status(400).send()
            }
            
            const blogCategory = await BlogCategoryChema.findById(id)
            if(!blogCategory) {
                res.status(400).json({status: 'error', message: 'Blog Category not found!'})
            }
            blogCategory.deleteOne()

            res.status(200).json({status: 'success', message: 'Blog Category deleted!'})

        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }

}

module.exports = new BlogController()
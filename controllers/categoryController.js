const CategorySchema = require('../models/Category')
const Image = require('../models/Image')
const cloudinaryUpload = require('../utils/cloudinaryUpload')

class CategoryController {
    async getAllCategories (req, res) {
        try {
            const AllCategories = await CategorySchema.find({}).populate('parent').populate('image').exec()
            
            res.status(200).json({status: 'success', data: AllCategories})
        } catch (error) {
            res.status(400).json({error, hhh: 'hhh'})
        }
    }

    async createCategory (req, res) {
        try {
            const categoryRes = req.body
            const cloudinaryResp = await cloudinaryUpload.uploadFile(req.file, 'category')
            // const { url } = await cloudinaryUpload.uploadFile(req.file, 'category')
            console.log(cloudinaryResp, req.file)
            // const image = await Image.create({
            //     name: req.file.originalname,
            //     url: cloudinaryResp.url,
            //     size: req.file.size,
            //     cloudinary_id: cloudinaryResp.public_id
            // })

            const data = {
                ...categoryRes,
                title: categoryRes.name,
                image: cloudinaryResp.url, 
            }
            // const data = {
            //     name, 
            //     image: url, 
            //     // parent,
            //     children,
            // }
            
            const newCategory = await CategorySchema.create(data)
            // console.log(newCategory, 'hdhdhdhdhdh')

            res.status(200).json({status: 'success', data: newCategory})
        } catch (error) {
            res.status(400).json({error})
        }
    }

    async getCategory (req, res) {
        try {
            const { categoryId } = req.body
            console.log(categoryId)
            const targetCategory = await CategorySchema.find({_id: categoryId}).populate('parent')
            res.status(200).json({status: 'success', data: targetCategory[0]})


        } catch (error) {
            res.status(400).json({error})
        }
    }

    async deleteCategory (req, res) {
        try {
            const { id } = req.params

            if(!id) {
                res.status(400).send()
            }
            
            const category = await CategorySchema.findById(id)
            if(!category) {
                res.status(400).json({status: 'error', message: 'Category not found!'})
            }
            category.deleteOne()

            // await category.delete()
            res.status(200).json({status: 'success', message: 'Category deleted!'})

        } catch (error) {
            res.status(400).json({status: 'error', message: 'some error'})
        }
    }

    async updateCategory (req, res) {
        try {
            const { name, parent, url } = req.body
            const { id } = req.params
            let cloudinaryImageUrl = ''
            console.log(name, 'it is name')
            if(!id) {
                res.status(400).send()
            }
            
            const category = await CategorySchema.findById(id)
            console.log(category)
            if(req.file){
                const { url } = await cloudinaryUpload.uploadFile(req.file, 'category')
                cloudinaryImageUrl = url
            }

            if (category) {
                category.name = name
                // category.parent = parent
                url ? category.image = url : category.image = cloudinaryImageUrl
                category.save()
                console.log(category)

                res.status(200).json({status: 'success', data: category})
            } else {
                res.status(400).json({status: 'error', message: 'Category not found!'})
            }
        } catch (error) {
            res.status(400).json({status: 'error', message: 'some error'})
        }
    }
}

module.exports = new CategoryController()

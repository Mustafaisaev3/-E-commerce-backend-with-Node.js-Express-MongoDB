const CategorySchema = require('../models/Category')
const cloudinaryUpload = require('../utils/cloudinaryUpload')

class CategoryController {
    async getAllCategories (req, res) {
        try {
            const AllCategories = await CategorySchema.find({}).populate('parent').exec()
            
            res.status(200).json({status: 'success', data: AllCategories})
        } catch (error) {
            res.status(400).json({error, hhh: 'hhh'})
        }
    }

    async createCategory (req, res) {
        try {
            const { name, parent, children} = req.body
            const { url } = await cloudinaryUpload.uploadFile(req.file, 'category')

            const data = {
                name, 
                image: url, 
                parent, 
                children,
            }

            const newCategory = await CategorySchema.create(data)

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
}

module.exports = new CategoryController()

const CategorySchema = require('../models/Category')
const cloudinaryUpload = require('../utils/cloudinaryUpload')

class CategoryController {
    async getAllCategories (req, res) {
        try {
            const AllCategories = await CategorySchema.find({}).populate('parent').populate('children').populate('image').exec()
            
            res.status(200).json({status: 'success', data: AllCategories})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }

    async createCategory (req, res) {
        try {
            const categoryRes = req.body
            const cloudinaryResp = await cloudinaryUpload.uploadFile(req.file, 'category')
            // const { url } = await cloudinaryUpload.uploadFile(req.file, 'category')
            // console.log(cloudinaryResp, req.file)
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

            if (categoryRes.parent) {
                const parentCategory = await CategorySchema.findById(categoryRes.parent)
                parentCategory.children.push(newCategory._id)
                parentCategory.save()
            }

            res.status(200).json({status: 'success', data: newCategory})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }

    async getCategory (req, res) {
        try {
            const { categoryId } = req.body

            const targetCategory = await CategorySchema.find({_id: categoryId}).populate('parent').populate(children)
            res.status(200).json({status: 'success', data: targetCategory[0]})


        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
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
            res.status(400).json({status: 'error', message: error.message})
        }
    }

    async updateCategory (req, res) {
        try {
            const { name, parent, url } = req.body
            const { id } = req.params
            let cloudinaryImageUrl = ''

            if(!id) {
                res.status(400).send()
            }
            
            const category = await CategorySchema.findById(id)

            if(req.file){
                const { url } = await cloudinaryUpload.uploadFile(req.file, 'category')
                cloudinaryImageUrl = url
            }

            if (category) {
                category.name = name
                // category.parent = parent
                url ? category.image = url : category.image = cloudinaryImageUrl
                category.save()


                res.status(200).json({status: 'success', data: category})
            } else {
                res.status(400).json({status: 'error', message: 'Category not found!'})
            }
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }
}

module.exports = new CategoryController()

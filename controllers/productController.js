const Product = require('../models/Product')
const ErrorHandler = require('../utils/errorHandler')
const bcrypt = require('bcryptjs')
const cloudinaryUpload = require('../utils/cloudinaryUpload')

class ProductController {
    async getProducts (req, res) {
        try {
            let queryObj = { ...req.query }
            const excludeFields = [ "page", "sort", "limit", "fields"]

            // Filtering
            excludeFields.forEach(el => delete queryObj[el])
            let queryStr = JSON.stringify(queryObj)
            queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)


            let query = Product.find(JSON.parse(queryStr)).populate('category')
            console.log(query)
            
            // Sorting
            if(req.query.sort) {
                const sortBy = req.query.sort.split(',').join(' ')
                query = query.sort(sortBy)
            } else {
                query = query.sort('-createdAt')
            }

            // Limiting fields
            if(req.query.fields) {
                const fields = req.query.fields.split(',').join(' ')
                query = query.select(fields)
            } else {
                query = query.select('-__v')
            }

            // Pagination
            const page = req.query.page
            const limit = req.query.limit
            const skip = (page - 1) * limit
            query = query.skip(skip).limit(limit)
            if(req.query.page){
                const productCount = await Product.countDocuments()
                if(skip >= productCount) {
                    console.log(productCount)
                    res.status(404).json({status: 'error', message: 'This Page does not exists'})
                }
            }

            const products = await query.populate('category')

            console.log(products)

            res.status(200).json({status: 'success', data: products})
        } catch (error) {
            console.log(error)
            res.status(400).json({error})
        }
    }

    async getProductById (req, res) {
        // console.log(req.params)
        try {
            const product = await Product.findById(req.params.id)

            if(!product) {
                res.status(404).json({status: 'error', message: 'Product not found'})
            }

            res.status(200).json({status: 'success', data: product})
        } catch (error) {
            res.status(400).json({error})
        }
    }

    async updateProduct (req, res) {
        try {
            const { urls } = req.body
            const files = req.files
            let images = []
            

            let product = await Product.findById(req.params.id)

            if(!product) {
                res.status(404).json({status: 'error', message: 'Product not found'})
            }

            if(urls) {
                // We get links as strings. Therefore, we need to separate from by comma
                // const urlsArr = urls.split(',')
                // console.log(urlsArr)
                images = urls
            }
            

            if(files) {
                const cloudinaryResp = await cloudinaryUpload.uploadFiles(files, 'product')

                if(typeof(images) == 'string') {
                    images = [images, ...cloudinaryResp]
                } else {
                    images = [...images, ...cloudinaryResp]
                }

                product = await Product.findByIdAndUpdate(req.params.id, req.body)

                product.images = images
                product.save()
                res.status(200).json({status: 'success', data: product, message: 'Product successfuly apdated'})
            } else {
                res.status(200).json({status: 'success', data: product, message: 'Product successfuly apdated'})
            }

            // product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            //     new: true,
            //     runValidators: true,
            //     useFindAndModify: false
            // })

        } catch (error) {
            res.status(400).json({error, message: 'error rrr'})
        }
    }

    async deleteProduct (req, res) {
        try {
            let product = await Product.findById(req.params.id)

            if(!product) {
                res.status(404).json({status: 'error', message: 'Product not found'})
            }

            await product.deleteOne()

            res.status(200).json({status: 'success', message: 'Product successfuly deleted'})
        } catch (error) {
            res.status(400).json({error})
        }
    }

    async newProduct (req, res) {
        try {
            const productRes = req.body
            const files = req.files
            // const images = []

            const images = await cloudinaryUpload.uploadFiles(files, 'product')
            
            const data = {
                ...productRes,
                name: productRes.title,
                images, 
            }
            
            const newProduct = await Product.create(data)

            res.status(201).json({status: 'success', data: newProduct})
        } catch (error) {
            res.status(400).json({error})
        }
    }
}

module.exports = new ProductController()
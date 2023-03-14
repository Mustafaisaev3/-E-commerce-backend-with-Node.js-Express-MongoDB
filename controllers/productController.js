const Product = require('../models/Product')
const ErrorHandler = require('../utils/errorHandler')
const bcrypt = require('bcryptjs')

class ProductController {
    async getProducts (req, res) {
        try {
            let queryObj = { ...req.query }
            const excludeFields = [ "page", "sort", "limit", "fields"]

            // Filtering
            excludeFields.forEach(el => delete queryObj[el])
            let queryStr = JSON.stringify(queryObj)
            queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)


            let query = Product.find(JSON.parse(queryStr))
            
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
                    // throw new Error('This Page does not exists')
                    res.status(404).json({status: 'error', message: 'This Page does not exists'})
                }
            }

            const products = await query

            res.status(200).json({status: 'success', products})
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

            res.status(200).json({status: 'success', product})
        } catch (error) {
            res.status(400).json({error})
        }
    }

    async updateProduct (req, res) {
        try {
            let product = await Product.findById(req.params.id)

            if(!product) {
                // res.status(404).json({status: 'error', message: 'Product not found'})
                return next(new ErrorHandler('Product not found', 404))
            }

            product = await Product.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true,
                useFindAndModify: false
            })

            res.status(200).json({status: 'success', product, message: 'Product successfuly apdated'})
        } catch (error) {
            res.status(400).json({error})
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
            const product = await Product.create(req.body)

            res.status(201).json({status: 'success', product})
        } catch (error) {
            res.status(400).json({error})
        }
    }
}

module.exports = new ProductController()
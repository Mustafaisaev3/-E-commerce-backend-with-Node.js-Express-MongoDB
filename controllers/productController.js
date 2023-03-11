const Product = require('../models/Product')
const ErrorHandler = require('../utils/errorHandler')

class ProductController {
    async getProducts (req, res) {
        try {
            const products = await Product.find()
            res.status(200).json({status: 'success', products})
        } catch (error) {
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
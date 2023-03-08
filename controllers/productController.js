

class ProductController {
    async getProducts (req, res) {
        try {
            res.status(200).json({status: 'success'})
        } catch (error) {
            res.status(400).json({error})
        }
    }
}

module.exports = new ProductController()
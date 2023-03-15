const jwt = require('jsonwebtoken')
// const config = require('config')


module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(401).json({message: 'Auth error'})
        }

        jwt.verify(
            token, 
            process.env.ACCESS_TOKEN_KEY,
            (error, decoded) => {
                if(error) return res.status(403)
                req.user = decoded
                next()
            }   
        )
    } catch (error) {
        return res.status(401).json({message: 'Auth errorrr'})
    }
}
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const refteshTokenMiddlware = (req, res) => {
    try {
       const cookies = req.cookies     
       if(!cookies?.jwt) return res.status(401)
       const refreshToken = cookies.jwt

       const user = await User.find({refreshToken})
       if(!user) return res.status(403)
        
       jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY,
        (error, decoded) => {
            if(error || user._id !== decoded._id) return res.status(403)

            const accessToken = jwt.sign(
                user,
                process.env.ACCESS_TOKEN_KEY,
                {expiresIn: '1d'}
            )
            res.status(200).json({accessToken})
        }
       )

    } catch (error) {
       res.status(400).json({message: 'Refresh token Error'}) 
    }
}

module.exports = refteshTokenMiddlware
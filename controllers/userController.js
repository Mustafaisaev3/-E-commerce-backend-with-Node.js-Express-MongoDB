const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')


class UserController {
    async register (req, res) {
        [
            check('email', 'Uncorrect email').isEmail(),
            check('password', 'Password must be longer than 3 and shorter than 12').isLength({min: 3, max: 12})
        ]

        try {
            const errors = validationResult(req)

            if(!errors.isEmpty()){
                res.status(400).json({message: 'Uncorrect request', errors})
            }

            const { name, email, password } = req.body

            const candidate = await User.findOne({email})

            if(candidate){
                res.status(400).json({message: `User with email ${email} alrady exist`})
            }

            const hashPassword = await bcrypt.hash(password, 8)

            const user = new User({
                name,
                email,
                password: hashPassword,
                avatar: {
                    public_id: 'some_id',
                    url: 'https://static.vecteezy.com/system/resources/previews/000/439/863/non_2x/vector-users-icon.jpg'
                }
            })

            await user.save()

            res.status(200).json({status: 'success', user})

        } catch (error) {
            res.status(400).json({status: 'error', error})
        }
    }

    async login (req, res) {
        try {
            const { email, password } = req.body

            const user = await User.findOne({email})

            if(!user){
                return res.status(404).json({message: 'User not found'})
            }

            const isValidPassword = bcrypt.compareSync(password, user.password)

            if(!isValidPassword){
                return res.status(400).json({message: "Password is incorrect"})
            }

            // const token = jwt.sign({id: user.id}, config.get('secretKey'), {expiresIn: '1h'})
            const accessToken = jwt.sign({id: user.id}, process.env.ACCESS_TOKEN_KEY, {expiresIn: '1h'})
            const refreshToken = jwt.sign({id: user.id}, process.env.REFRESH_TOKEN_KEY)

            user.refreshToken = refreshToken
            user.save()

            res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000})
            res.json({
                accessToken,
                user: {
                    id: user.id,
                    email: user.email,
                    avatar: user.avatar
                }
            })

        } catch (error) {
            console.log(error)
            res.status(400).json({status: 'error', error})
        }
    }

    async logout (req, res) {
        try {
            const cookies = req.cookies     
            if(!cookies?.jwt) return res.status(403)
            const refreshToken = cookies.jwt

            const user = await User.find({refreshToken})
            if(!user) {
                res.cleareCookies('jwt', {httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
                return res.status(204)
            }

            user.refreshToken = ''
            user.save()
            
            res.cleareCookies('jwt', {httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
            return res.status(204)
        } catch (error) {
            console.log(error)
           res.status(400).json({message: 'Refresh token Error'}) 
        }
    }

    async auth (req, res) {
        try {
            const user = await User.findOne({_id: req.user.id})

            const token = jwt.sign({id: user.id}, process.env.ACCESS_TOKEN_KEY)

            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    avatar: user.avatar
                }
            })

        } catch (error) {
            console.log(error)
            res.status(400).json({status: 'error', error})
        }
    }

    async refreshToken (req, res) {
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
    
                const accessToken = jwt.sign({id: user.id}, process.env.ACCESS_TOKEN_KEY, {expiresIn: '1h'})
                console.log(decoded)
                res.status(200).json({accessToken})
            }
           )
    
        } catch (error) {
            console.log(error)
           res.status(400).json({message: 'Refresh token Error'}) 
        }
    }
}

module.exports = new UserController()
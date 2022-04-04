const {decode} = require('../services/jwt')
const User = require('../models/user')

const authUser = async (req, res, next) => {
    try {
        let {auth_token} = req.headers
        let user_id = decode(auth_token).user_id
        let user = await User.findById(user_id)
        if (!user) return res.send({error: "User isn't authenticated"}).status(401)

        req.user = user
        next()
    } catch (error) {
        return res.send({error})
    }
}

module.exports = authUser
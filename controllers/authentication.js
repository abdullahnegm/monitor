const {encode} = require('../services/jwt')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const login = async (req, res) => {
    try {

        let {email, password} = req.body
        let user = await User.findOne({ email: email });

        if(user != null) match = await bcrypt.compare(password, user.password);
        if (!user || !match) return res.status(401).send({error: 'username or password may be incorrect'})
        let token = encode({user_id: user.id})

        return res.status(200).send({status: 200, data: {token}})

    } catch (error) {
        return res.send({error})
    }
}

const signup = async (req, res) => {
    try {

        let {email, password} = req.body
        let user = new User({email, password})
        user = await user.save()

        return res.status(200).send({status: 200, data: {user}})

    } catch (error) {
        return res.send({error})
    }
}

module.exports = {login, signup}
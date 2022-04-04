const jwt = require('jsonwebtoken');

const encode = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET);
}

const decode = (token) => {
    try {
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded
    } catch(error) {
        throw Error('User is not Authenticated')
    }
}

module.exports = {encode, decode}
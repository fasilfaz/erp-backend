const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    return jwt.sign(
        {
            _id: userId
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

module.exports = generateToken;
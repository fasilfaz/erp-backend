const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

export const verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthenicated request",
                isAuthenticated: false
            });
        };
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
        const user = await User.findById(decodedToken?._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid token",
                isAuthenticated: false
            });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            isAuthenticated: false,
            tokenExpired: error.expiredAt
        });
    }
}


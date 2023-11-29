const jwt = require('jsonwebtoken');
const { successHandler, errorHandler } = require('../helpers/responseHandler');
require('dotenv').config();


const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1];
        if (!token || token == null) {
            return errorHandler(res, 401, 'authenticate_token_error', 'Token missing.');
        }
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return errorHandler(res, 401, 'authenticate_token_error', 'Invalid token');
            }
            req.user = decoded;

            if (decoded.role === 'admin') {
                req.user = decoded;
                console.log(req.user);
                next()
            } else {
                return errorHandler(res, 403, 'authenticate_token_error', 'Access denied!');
            }

            // if (req.path === '/account-details' || req.path === '/uploadPicture' || req.path === '/forgot-password') {
            //     if (decoded.role === 'user') {
            //         next();
            //     } else {
            //         return errorHandler(res, 403, 'authenticate_token_error', 'Access denied: This route is for user user only.');
            //     }
            // }
            // else if (decoded.role === 'admin') {
            //     req.user = decoded;
            //     console.log(req.user);
            //     next();
            // }
            // else {
            //     return errorHandler(res, 403, 'authenticate_token_error', 'Access denied!');
            // }
        })
    } catch (error) {
        if (error.code === 500) {
            return errorHandler(res, 500, 'server_error', error.message);
        } else {
            return errorHandler(res, 409, 'authenticate_token_error', error.message);
        }
    }
}

module.exports = { authenticateToken }

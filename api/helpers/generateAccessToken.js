const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAccessToken = async (data) => {
    try {
        const token = jwt.sign(data, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        return { access_token: token };

    } catch (error) {
        console.log(`Could not generate access token: ${error.message}`);
        throw error;
    }

}

module.exports = { generateAccessToken };
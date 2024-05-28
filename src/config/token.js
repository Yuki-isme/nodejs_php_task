const jwt = require('jsonwebtoken');

const maxAge = 7 * 24 * 60 * 60 * 1000;

const token = {
    verifyAccessToken: function(accessToken, callback = () => {}) {
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, callback);
    },

    verifyRefreshToken: async function(refreshToken, callback = () => {}) {
        return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, callback);
    },

    generateAccessToken: async (user) => {
        return await generateToken(user, process.env.ACCESS_TOKEN_SECRET, '3s');
    },

    generateRefreshToken: async (user) => {
        return await generateToken(user, process.env.REFRESH_TOKEN_SECRET, maxAge);
    },

    storeAccessToken: async (res, accessToken) => {
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: maxAge
        });
    },

    storeRefreshToken: async (res, refreshToken) => {
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: maxAge
        });
    },
}

module.exports = token;

const generateToken = async (user, secret, time) => {
    return await jwt.sign(user, secret, {expiresIn: time});
}
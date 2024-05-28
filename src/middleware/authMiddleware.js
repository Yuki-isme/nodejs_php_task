const jwt = require('jsonwebtoken');
const token = require('../config/token');
const axios = require('axios');

const authenticateToken = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) return res.status(404).redirect('/login');
    token.verifyAccessToken(accessToken, async (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                const refreshToken = req.cookies.refreshToken;

                if (!refreshToken) {
                    return res.status(401).redirect('/login');
                }

                try {
                    const response = await apiClient.post('/refreshToken', {
                        refreshToken: refreshToken
                    });

                    const newAccessToken = response.data.accessToken;

                    await token.storeAccessToken(res, newAccessToken);

                    token.verifyAccessToken(newAccessToken, (err, user) => {
                        if (err) return res.status(403).json({ message: 'Invalid access token after refresh' });
                        req.user = user;
                        next();
                    });
                } catch (refreshError) {
                    return res.status(401).json({ message: 'Unable to refresh token' });
                }
            } else {
                return res.status(403).json({ message: 'Invalid access token' });
            }
        } else {
            req.user = user;
            next();
        }
    });
};

const apiClient = axios.create({
    baseURL: `${process.env.HTTP}${process.env.HOST_NAME}:${process.env.PORT}`,
    withCredentials: true,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

module.exports = authenticateToken;

const token = require('../config/token');
const bcrypt = require('bcryptjs');
const Controller = require('./Controller');

const AuthController = {
    login: async (req, res) => {
        await Controller.render(req, res, 'page.login.ejs', 'Login', {});
    },

    auth: async (req, res) => {
        const {username, password} = req.body;

        try {
            const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
            const user = rows[0];

            if (!user) return res.status(401).json({ message: 'Invalid credentials' });

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

            const accessToken = await token.generateAccessToken({ id: user.id, username: user.username });
            const refreshToken = await token.generateRefreshToken({ id: user.id, username: user.username });
            await token.storeAccessToken(res, accessToken);
            await token.storeRefreshToken(res, refreshToken);

            res.redirect('/');
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    refreshToken: async (req, res) => {
        const refreshToken  = req.body.refreshToken;
        // console.log(req.cookies);
        if (!refreshToken) return res.status(401).json({ message: 'Refresh token is missing' });

        try {
            const decoded = token.verifyRefreshToken(refreshToken);

            const accessToken = await token.generateAccessToken({ id: decoded.id, username: decoded.username });

            res.json({ accessToken });
        } catch (err) {
            console.error(err);
            res.status(403).json({ message: 'Invalid refresh token' });
        }
    },

    logout: async (req, res) => {
        try {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            return res.redirect('/login');
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
};

module.exports = AuthController;

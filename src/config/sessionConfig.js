require('dotenv').config();
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const sessionStore = new MySQLStore({expiration: 86400000, checkExpirationInterval: 900000}, pool);

const sessionConfig = (app) => {
    app.use(session({
        key: 'session_cookie_name',
        secret: 'session_cookie_secret',
        store: sessionStore,
        resave: true,
        saveUninitialized: true,
    }));

    app.use((req, res, next) => {
        if (!req.session.module) {
            req.session.module = {};
        }

        let modules = ['account', 'archive', 'bill', 'category', 'paymentStatus', 'service'];
        let properties = [
            {property: 'listing', properties: [
                {property: 'filter' },
                {property: 'search', default: ''},
                {property: 'query', properties: [{property: 'from'}, {property: 'where'}]},
                {property: 'selected', default: []},
            ]},
        ];

        modules.forEach((module) => {
            if (!req.session.module[module]) {
                req.session.module[module] = {};
            }
            createSessions(module, properties, req.session.module[module]);
        });
        next();
    });
}

const createSessions = (module, properties, sessionObject) => {
    properties.forEach(property => {
        if (!(sessionObject[property.property])) {
            if (property.default) {
                sessionObject[property.property] = property.default;
            } else {
                sessionObject[property.property] = {};
            }
        }

        if (property.properties) {
            createSessions(module, property.properties, sessionObject[property.property]);
        }
    });
}

module.exports = sessionConfig;
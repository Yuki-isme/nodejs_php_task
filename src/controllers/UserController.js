const db = require('../models/index.js');
const Controller = require('./Controller');
const Bill = require("../models/Bill");

const UserController = {
    index: async (req, res) => {
        const data = await db['User'].findAll({
            attributes: {
                include: [
                    [db.sequelize.literal(`CONCAT('<input type=\"hidden\" value=\"', User.id, '\" />')`), 'inputField'],
                    [db.sequelize.literal(`CONCAT('<div>', User.username, '</div>')`), 'username'],
                    [db.sequelize.literal(`DATE_FORMAT(CONVERT_TZ(User.createdAt, '+00:00', '+07:00'), '%d/%m/%Y %h:%i:%s %p')`), 'createdAt'],
                    [db.sequelize.literal(`DATE_FORMAT(CONVERT_TZ(User.updatedAt, '+00:00', '+07:00'), '%d/%m/%Y %h:%i:%s %p')`), 'updatedAt'],
                ]
            },
            include: [
                {
                    model: db.Role,
                    through: {
                        attributes: []
                    },
                    attributes: [
                        'id',
                        'name',
                        [db.sequelize.literal(`DATE_FORMAT(CONVERT_TZ(roles.createdAt, '+00:00', '+07:00'), '%d/%m/%Y %h:%i:%s %p')`), 'createdAt'],
                        [db.sequelize.literal(`DATE_FORMAT(CONVERT_TZ(roles.updatedAt, '+00:00', '+07:00'), '%d/%m/%Y %h:%i:%s %p')`), 'updatedAt'],
                    ]
                },
                {
                    model: db.Company,
                    attributes: [
                        'id',
                        'name',
                        [db.sequelize.literal(`DATE_FORMAT(CONVERT_TZ(roles.createdAt, '+00:00', '+07:00'), '%d/%m/%Y %h:%i:%s %p')`), 'createdAt'],
                        [db.sequelize.literal(`DATE_FORMAT(CONVERT_TZ(roles.updatedAt, '+00:00', '+07:00'), '%d/%m/%Y %h:%i:%s %p')`), 'updatedAt'],
                    ]
                }
            ]
        });



        data.forEach((user) => {
            console.log(user.toJSON());
        });

        await Controller.listingPage(req, res, Bill);
    }
}

module.exports = UserController;
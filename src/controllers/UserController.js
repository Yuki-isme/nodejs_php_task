const Controller = require('./Controller');

class UserController extends Controller {
    constructor() {
        super();
    }
    async index (req, res){
        // const data = await db['User'].findAll({
        //     attributes: {
        //         include: [
        //             [db.sequelize.literal(`CONCAT('<input type=\"hidden\" value=\"', User.id, '\" />')`), 'inputField'],
        //             [db.sequelize.literal(`CONCAT('<div>', User.username, '</div>')`), 'username'],
        //             [db.sequelize.literal(`DATE_FORMAT(CONVERT_TZ(User.createdAt, '+00:00', '+07:00'), '%d/%m/%Y %h:%i:%s %p')`), 'createdAt'],
        //             [db.sequelize.literal(`DATE_FORMAT(CONVERT_TZ(User.updatedAt, '+00:00', '+07:00'), '%d/%m/%Y %h:%i:%s %p')`), 'updatedAt'],
        //             [db.sequelize.col('Company.name'), 'company'],
        //             [db.sequelize.literal(`(
        //                                     SELECT GROUP_CONCAT(name SEPARATOR ', ')
        //                                     FROM Roles
        //                                     INNER JOIN user_role ON Roles.id = user_role.role_id
        //                                     WHERE user_role.user_id = User.id
        //                                   )`), 'roles']
        //         ]
        //     },
        //     include: [
        //         {
        //             model: db.Role,
        //             through: {
        //                 attributes: []
        //             },
        //             attributes: [
        //                 'id',
        //                 'name',
        //                 [db.sequelize.literal(`DATE_FORMAT(CONVERT_TZ(roles.createdAt, '+00:00', '+07:00'), '%d/%m/%Y %h:%i:%s %p')`), 'createdAt'],
        //                 [db.sequelize.literal(`DATE_FORMAT(CONVERT_TZ(roles.updatedAt, '+00:00', '+07:00'), '%d/%m/%Y %h:%i:%s %p')`), 'updatedAt'],
        //             ]
        //         },
        //         {
        //             model: db.Company,
        //             attributes: [
        //                 'id',
        //                 'name',
        //                 [db.sequelize.literal(`DATE_FORMAT(CONVERT_TZ(roles.createdAt, '+00:00', '+07:00'), '%d/%m/%Y %h:%i:%s %p')`), 'createdAt'],
        //                 [db.sequelize.literal(`DATE_FORMAT(CONVERT_TZ(roles.updatedAt, '+00:00', '+07:00'), '%d/%m/%Y %h:%i:%s %p')`), 'updatedAt'],
        //             ]
        //         }
        //     ],
        // });
        //
        // data.forEach((user) => {
        //     console.log(user.toJSON());
        // });

        await super.index(req, res, 'User');
    }
}

module.exports = UserController;
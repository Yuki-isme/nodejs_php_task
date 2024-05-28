const Model = require('../models/Model');

const User = {
    fieldDefs: [
        {field: 'username', label: 'Username', type: 'varchar',  hidden: false, query: true, relation: false},
        {field: 'password', label: 'Password', type: 'varchar',  hidden: false, query: true, relation: false},
    ],

    module: 'user',
    module_name: 'User',
    table: 'users',

    __init: async () => {
        [User.fieldDefs] = await Model.__init(User, true, false);
    },

    getFullRecords: async (req, res) => {
        return await Model.getFullRecords(req, res, User);
    }
}

module.exports = User;

(async () => {
    await User.__init();
})();
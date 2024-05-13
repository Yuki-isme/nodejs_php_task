const Model = require('../models/Model');

const Account = {
    fieldDefs: [
        {field: 'name', label: 'Account Number', type: 'varchar',  hidden: false, query: true, relation: false},
    ],

    module: 'account',
    module_name: 'Account',
    table: 'accounts',

    __init: async () => {
        [Account.fieldDefs] = await Model.__init(Account, true, false);
    },

    getFullRecords: async (req, res) => {
        return await Model.getFullRecords(req, res, Account);
    }
}

module.exports = Account;
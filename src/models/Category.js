const Model = require('../models/Model');

const Category = {
    fieldDefs: [
        {field: 'name', label: 'Category', type: 'varchar',  hidden: false, query: true, relation: false},
    ],

    module: 'category',
    module_name: 'Category',
    table: 'categories',

    __init: async () => {
        [Category.fieldDefs] = await Model.__init(Category, true, false);
    },

    getFullRecords: async (req, res) => {
        return await Model.getFullRecords(req, res, Category);
    }
}

module.exports = Category;
const Model = require('../models/Model');

const Bill = {
    fieldDefs: [
        {field: 'bill_id',           label: 'Bill ID',        type: 'varchar',  validate: ['unique'],             hidden: false, orderable: true, onlyQuery: false, insert: true, relation: false},
        {field: 'amount',            label: 'Amount',         type: 'double',   validate: ['number'],             hidden: false, orderable: true, onlyQuery: false, insert: true, relation: false},
        {field: 'comment',           label: 'Comment',        type: 'text',     validate: null,                   hidden: true,  orderable: true, onlyQuery: false, insert: true, relation: false},
        {field: 'service_id',        label: 'Service',        type: 'int',      validate: null,                   hidden: false, orderable: true, onlyQuery: false, insert: true, relation: {table: 'services',         field: 'name', alias_name: 'service'}},
        {field: 'payment_status_id', label: 'Payment Status', type: 'int',      validate: null,                   hidden: false, orderable: true, onlyQuery: false, insert: true, relation: {table: 'payment_statuses', field: 'name', alias_name: 'payment_status'}},
        {field: 'category_id',       label: 'Category',       type: 'int',      validate: null,                   hidden: false, orderable: true, onlyQuery: false, insert: true, relation: {table: 'categories',       field: 'name', alias_name: 'category'}},
        {field: 'closed_date',       label: 'Closes Date',    type: 'datetime', validate: ['greaterCurrentTime'], hidden: false, orderable: true, onlyQuery: false, insert: true, relation: false},
    ],

    module: 'bill',
    module_name: 'Bill',
    table: 'bills',

    __init: () => {
        [Bill.fieldDefs] = Model.__init(Bill);
    },

    getRecords: async (req, res) => {
        return await Model.getRecords(req, res, Bill);
    },

    getRecord: async (req, res) => {
        return await Model.getRecord(req, res, Bill);
    },

    archive: async (req, res) => {
        await Model.archive(req, res, Bill, 'archives');
    },
}

module.exports = Bill;
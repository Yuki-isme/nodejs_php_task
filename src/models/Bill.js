const Model = require('../models/Model');

const Bill = {
    fieldDefs: [
        {field: 'bill_id',           label: 'Bill ID',        type: 'varchar',  validate: {rules: [{rule: 'required', value: true, message: 'Please insert'}, {rule: 'unique', tables: ['bills', 'archives'], message: 'Bill ID already exists'}]}, display: true, hidden: false, orderable: true, onlySelect: false, insert: true, quick_edit: true, relation: false},
        {field: 'amount',            label: 'Amount',         type: 'double',   validate: {rules: [{rule: 'required', value: true, message: 'Please insert'}, {rule: 'pattern', value: '^(?=.*[1-9])\\d*(\\.\\d+)?$', message: 'Please pattern'}]}, display: true, hidden: false, orderable: true, onlySelect: false, insert: true, quick_edit: true, relation: false},
        {field: 'comment',           label: 'Comment',        type: 'text',     validate: false,                                                                                                                                                    display: true, hidden: true,  orderable: true, onlySelect: false, insert: true, quick_edit: true, relation: false},
        {field: 'service_id',        label: 'Service',        type: 'int',      validate: false,                                                                                                                                                    display: true, hidden: false, orderable: true, onlySelect: false, insert: true, quick_edit: true, relation: {table: 'services',         field: 'name', alias_name: 'service'}},
        {field: 'payment_status_id', label: 'Payment Status', type: 'int',      validate: false,                                                                                                                                                    display: true, hidden: false, orderable: true, onlySelect: false, insert: true, quick_edit: true, relation: {table: 'payment_statuses', field: 'name', alias_name: 'payment_status'}},
        {field: 'category_id',       label: 'Category',       type: 'int',      validate: false,                                                                                                                                                    display: true, hidden: false, orderable: true, onlySelect: false, insert: true, quick_edit: true, relation: {table: 'categories',       field: 'name', alias_name: 'category'}},
        {field: 'closed_date',       label: 'Closes Date',    type: 'datetime', validate: {rules: [{rule: 'required', value: true, message: 'Please insert'}]}, display: true, hidden: false, orderable: true, onlySelect: false, insert: true, quick_edit: true, relation: false},
    ],

    module: 'bill',
    module_name: 'Bill',
    table: 'bills',

    __init: async () => {
        [Bill.fieldDefs] = await Model.__init(Bill);
    },

    getRecords: async (req, res) => {
        return await Model.getRecords(req, res, Bill);
    },

    getRecord: async (req, res) => {
        return await Model.getRecord(req, res, Bill);
    },

    archiveConversion: async (req, res) => {
        await Model.archiveConversion(req, res, Bill, 'Archive');
    },

    checkExists: async (req, res) => {
        await Model.checkExists(req, res);
    },
}

module.exports = Bill;